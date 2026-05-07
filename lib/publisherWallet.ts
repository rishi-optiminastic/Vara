import { cache } from "react"
import { prisma } from "@/lib/prisma"
import type {
  Payout,
  Placement,
  PublisherEarning,
  PublisherStatement,
  PublisherWallet,
} from "@prisma/client"

export const getOrCreatePublisherWallet = cache(
  async (publisherId: string): Promise<PublisherWallet> => {
    const existing = await prisma.publisherWallet.findUnique({ where: { publisherId } })
    if (existing) return existing
    return prisma.publisherWallet.create({ data: { publisherId } })
  },
)

export type EarningWithPlacement = PublisherEarning & {
  placement: Pick<Placement, "id" | "name" | "format"> | null
}

export interface PayoutPageData {
  wallet: PublisherWallet
  earnings: EarningWithPlacement[]
  statements: PublisherStatement[]
  payouts: Payout[]
  earnings30d: { grossUsdcCents: number; netUsdcCents: number; impressions: number; clicks: number }
}

export async function loadPayoutPageData(publisherId: string): Promise<PayoutPageData> {
  const wallet = await getOrCreatePublisherWallet(publisherId)
  const since = new Date()
  since.setUTCHours(0, 0, 0, 0)
  since.setUTCDate(since.getUTCDate() - 30)

  const [earnings, statements, payouts, agg] = await Promise.all([
    prisma.publisherEarning.findMany({
      where: { publisherWalletId: wallet.id },
      orderBy: { date: "desc" },
      take: 25,
      include: { placement: { select: { id: true, name: true, format: true } } },
    }),
    prisma.publisherStatement.findMany({
      where: { publisherWalletId: wallet.id },
      orderBy: { periodStart: "desc" },
      take: 12,
    }),
    prisma.payout.findMany({
      where: { publisherWalletId: wallet.id },
      orderBy: { initiatedAt: "desc" },
      take: 25,
    }),
    prisma.publisherEarning.aggregate({
      where: { publisherWalletId: wallet.id, date: { gte: since } },
      _sum: {
        grossUsdcCents: true,
        netUsdcCents: true,
        impressions: true,
        clicks: true,
      },
    }),
  ])

  return {
    wallet,
    earnings,
    statements,
    payouts,
    earnings30d: {
      grossUsdcCents: agg._sum.grossUsdcCents ?? 0,
      netUsdcCents: agg._sum.netUsdcCents ?? 0,
      impressions: agg._sum.impressions ?? 0,
      clicks: agg._sum.clicks ?? 0,
    },
  }
}

export interface RevShareSplit {
  grossUsdcCents: number
  feeUsdcCents: number
  netUsdcCents: number
}

export function applyRevShare(grossUsdcCents: number, revShareBps: number): RevShareSplit {
  const netUsdcCents = Math.floor((grossUsdcCents * revShareBps) / 10_000)
  const feeUsdcCents = grossUsdcCents - netUsdcCents
  return { grossUsdcCents, feeUsdcCents, netUsdcCents }
}

export const PAYOUT_NETWORK_FEE_USDC_CENTS = 50

export function maxWithdrawableCents(wallet: PublisherWallet): number {
  return Math.max(0, wallet.availableUsdcCents - PAYOUT_NETWORK_FEE_USDC_CENTS)
}
