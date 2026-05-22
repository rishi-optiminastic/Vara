import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { getOrCreateWallet } from "@/lib/wallet"

// Demo top-up. Adds USDC to the calling user's wallet ledger so they can
// create campaigns without standing up an on-chain deposit flow first.
//
// Hard-gated to non-production. The route literally refuses to run if
// NODE_ENV === "production" so a stray deploy can't be abused to mint
// balances on a real environment.
const MAX_TOPUP_CENTS = 1_000_000_00 // $1,000,000 in cents — generous demo cap
const DEFAULT_TOPUP_CENTS = 100_000_00 // $100,000 in cents per click

export async function POST(req: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 })
  }

  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 })
    }

    const body = (await req.json().catch(() => ({}))) as { amountUsdcCents?: number }
    const requested = Number.isFinite(body.amountUsdcCents) ? Number(body.amountUsdcCents) : DEFAULT_TOPUP_CENTS
    const amount = Math.max(1, Math.min(Math.floor(requested), MAX_TOPUP_CENTS))

    const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)
    const wallet = await getOrCreateWallet(advertiser.id)

    const updated = await prisma.$transaction(async (tx) => {
      const w = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balanceUsdcCents: { increment: amount },
          totalDepositedUsdcCents: { increment: amount },
        },
      })
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "DEPOSIT",
          status: "COMPLETED",
          amountUsdcCents: amount,
          description: "Demo top-up",
          source: "demo",
        },
      })
      return w
    })

    return NextResponse.json({
      ok: true,
      addedUsdcCents: amount,
      balanceUsdcCents: updated.balanceUsdcCents,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: `Top-up failed: ${message}` }, { status: 500 })
  }
}
