import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type { Wallet, WalletTransaction } from "@prisma/client"
import { reconcileAdvertiserReservations } from "@/lib/walletEscrow"

export const getOrCreateWallet = cache(async (advertiserId: string): Promise<Wallet> => {
  // Self-heal reservation drift before returning. Cheap: one transaction
  // that short-circuits when state already matches truth.
  await reconcileAdvertiserReservations(advertiserId)
  const existing = await prisma.wallet.findUnique({ where: { advertiserId } })
  if (existing) return existing
  return prisma.wallet.create({ data: { advertiserId } })
})

export interface WalletPageData {
  wallet: Wallet
  transactions: WalletTransaction[]
}

export async function loadWalletPageData(advertiserId: string): Promise<WalletPageData> {
  const wallet = await getOrCreateWallet(advertiserId)
  const transactions = await prisma.walletTransaction.findMany({
    where: { walletId: wallet.id },
    orderBy: { occurredAt: "desc" },
    take: 25,
  })
  return { wallet, transactions }
}
