import { NextResponse } from "next/server"
import { requireAdvertiser, isAuthError } from "@/lib/api"
import { loadWalletPageData } from "@/lib/wallet"

export async function GET(): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx
  const { wallet, transactions } = await loadWalletPageData(ctx.advertiser.id)
  return NextResponse.json({ wallet, transactions })
}
