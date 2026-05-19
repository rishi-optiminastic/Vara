import { NextResponse, type NextRequest } from "next/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { env } from "@/lib/env"
import { getOrCreateWallet } from "@/lib/wallet"
import { verifySepoliaUsdcTransfer } from "@/lib/sepolia"
import { logger } from "@/lib/logger"

const Body = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Must be a 0x-prefixed 32-byte tx hash"),
  network: z.enum(["SEPOLIA"]).default("SEPOLIA"),
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ctx = await requireAdvertiser()
    if (isAuthError(ctx)) return ctx

    const parsed = Body.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
    }

    const receiver = env.WALLET_DEPOSIT_RECEIVER_SEPOLIA
    if (!receiver) {
      return jsonError(
        "Server is not configured to accept deposits. Set WALLET_DEPOSIT_RECEIVER_SEPOLIA in .env.",
        500,
      )
    }

    const existing = await prisma.deposit.findUnique({ where: { txHash: parsed.data.txHash } })
    if (existing) return jsonError("This transaction has already been credited", 409)

    let verified
    try {
      verified = await verifySepoliaUsdcTransfer(parsed.data.txHash, receiver)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to verify transaction"
      return jsonError(message, 400)
    }

    const wallet = await getOrCreateWallet(ctx.advertiser.id)

    const result = await prisma.$transaction(async (tx) => {
      const deposit = await tx.deposit.create({
        data: {
          walletId: wallet.id,
          chain: "ETHEREUM",
          network: "SEPOLIA",
          txHash: parsed.data.txHash,
          fromAddress: verified.fromAddress,
          toAddress: verified.toAddress,
          amountUsdcCents: verified.amountUsdcCents,
          blockNumber: verified.blockNumber,
          confirmedAt: new Date(),
        },
      })
      const walletTx = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "DEPOSIT",
          status: "COMPLETED",
          amountUsdcCents: verified.amountUsdcCents,
          description: "USDC deposit",
          source: `Sepolia · ${verified.fromAddress.slice(0, 6)}…${verified.fromAddress.slice(-4)}`,
          txHash: parsed.data.txHash,
          depositId: deposit.id,
        },
      })
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceUsdcCents: { increment: verified.amountUsdcCents },
          totalDepositedUsdcCents: { increment: verified.amountUsdcCents },
        },
      })
      return { deposit, walletTx, wallet: updated }
    })
    // Drop the cached RSC payload so the next render (triggered by
    // router.refresh() on the client) actually reads the post-credit wallet
    // rather than serving the stale pre-credit snapshot.
    revalidatePath("/dashboard/settings")
    revalidatePath("/dashboard")
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    // Surface the real error — this used to be swallowed as a bare 500 with
    // no body, which made the bug invisible. Testnet code, so leaking
    // details is fine; tighten for prod.
    logger.error({ err }, "POST /api/wallet/deposits failed")
    const message = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    return NextResponse.json(
      { error: message, stack: process.env.NODE_ENV === "production" ? undefined : stack },
      { status: 500 },
    )
  }
}
