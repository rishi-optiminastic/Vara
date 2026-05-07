import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { isPublisherAuthError, requirePublisher } from "@/lib/sspApi"
import {
  PAYOUT_NETWORK_FEE_USDC_CENTS,
  getOrCreatePublisherWallet,
} from "@/lib/publisherWallet"
import { WithdrawSchema } from "@/components/ssp/payouts/types"

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ctx = await requirePublisher()
  if (isPublisherAuthError(ctx)) return ctx

  const body = await req.json().catch(() => null)
  const parsed = WithdrawSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 },
    )
  }
  const { amountUsdcCents, chain, toAddress } = parsed.data
  const wallet = await getOrCreatePublisherWallet(ctx.publisher.id)

  if (amountUsdcCents <= PAYOUT_NETWORK_FEE_USDC_CENTS) {
    return NextResponse.json(
      { error: "Amount must exceed network fee" },
      { status: 422 },
    )
  }
  if (amountUsdcCents > wallet.availableUsdcCents) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 422 })
  }

  try {
    const payout = await prisma.$transaction(async tx => {
      const fresh = await tx.publisherWallet.findUniqueOrThrow({
        where: { id: wallet.id },
      })
      if (amountUsdcCents > fresh.availableUsdcCents) {
        throw new Error("Insufficient balance")
      }
      const created = await tx.payout.create({
        data: {
          publisherWalletId: wallet.id,
          chain,
          amountUsdcCents,
          feeUsdcCents: PAYOUT_NETWORK_FEE_USDC_CENTS,
          toAddress,
          status: "SUBMITTED",
        },
      })
      await tx.publisherWallet.update({
        where: { id: wallet.id },
        data: {
          availableUsdcCents: { decrement: amountUsdcCents },
          lifetimePaidUsdcCents: { increment: amountUsdcCents },
        },
      })
      return created
    })
    return NextResponse.json({ payout }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "Failed to submit withdrawal")
    const message = err instanceof Error ? err.message : "Withdrawal failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
