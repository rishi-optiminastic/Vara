import { NextResponse, type NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { isPublisherAuthError, requirePublisher } from "@/lib/sspApi"
import { getOrCreatePublisherWallet } from "@/lib/publisherWallet"
import { PayoutAddressSchema } from "@/components/ssp/payouts/types"

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const ctx = await requirePublisher()
  if (isPublisherAuthError(ctx)) return ctx

  const body = await req.json().catch(() => null)
  const parsed = PayoutAddressSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 },
    )
  }

  try {
    const existing = await getOrCreatePublisherWallet(ctx.publisher.id)
    const wallet = await prisma.publisherWallet.update({
      where: { id: existing.id },
      data: {
        payoutAddress: parsed.data.payoutAddress,
        payoutChain: parsed.data.payoutChain,
      },
    })
    return NextResponse.json({ wallet })
  } catch (err) {
    logger.error({ err }, "Failed to update payout address")
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}
