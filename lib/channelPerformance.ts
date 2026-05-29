import { prisma } from "@/lib/prisma"
import type { InventoryCategory } from "@prisma/client"

export interface ChannelRow {
  publisherId: string
  siteName: string
  primaryUrl: string | null
  category: InventoryCategory
  placementCount: number
  impressions: number
  clicks: number
  ctrPct: number
  grossUsdcCents: number
}

export async function fetchChannelPerformance(sinceDate: Date): Promise<ChannelRow[]> {
  const publishers = await prisma.publisher.findMany({
    include: {
      wallet: {
        include: {
          earnings: {
            where: { date: { gte: sinceDate } },
            select: { impressions: true, clicks: true, grossUsdcCents: true },
          },
        },
      },
      _count: { select: { placements: true } },
    },
  })

  const rows: ChannelRow[] = publishers.map((p) => {
    const earnings = p.wallet?.earnings ?? []
    const impressions = earnings.reduce((a, e) => a + e.impressions, 0)
    const clicks = earnings.reduce((a, e) => a + e.clicks, 0)
    const grossUsdcCents = earnings.reduce((a, e) => a + e.grossUsdcCents, 0)
    return {
      publisherId: p.id,
      siteName: p.siteName,
      primaryUrl: p.primaryUrl,
      category: p.category,
      placementCount: p._count.placements,
      impressions,
      clicks,
      ctrPct: impressions > 0 ? (clicks / impressions) * 100 : 0,
      grossUsdcCents,
    }
  })

  return rows.sort((a, b) => b.grossUsdcCents - a.grossUsdcCents)
}
