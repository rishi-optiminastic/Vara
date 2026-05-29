import type { CampaignStatus, Vertical } from "@prisma/client"
import type { TrendPoint } from "@/components/insights/InsightsTrendChart"

export function bucketByDay(
  metrics: { date: Date; spendUsdCents: number; impressions: number }[],
): TrendPoint[] {
  const map = new Map<string, TrendPoint>()
  for (const m of metrics) {
    const key = m.date.toISOString().split("T")[0]!
    const existing = map.get(key)
    if (existing) {
      existing.spendUsdCents += m.spendUsdCents
      existing.impressions += m.impressions
    } else {
      map.set(key, { date: key, spendUsdCents: m.spendUsdCents, impressions: m.impressions })
    }
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export interface VerticalSpendRow {
  vertical: Vertical
  spend: number
  pct: number
}

export function bucketByVertical(
  perCampaign: { campaignId: string; _sum: { spendUsdCents: number | null } }[],
  campaigns: { id: string; vertical: Vertical }[],
): VerticalSpendRow[] {
  const byVert = new Map<Vertical, number>()
  let total = 0
  for (const row of perCampaign) {
    const c = campaigns.find((x) => x.id === row.campaignId)
    if (!c) continue
    const spend = row._sum.spendUsdCents ?? 0
    byVert.set(c.vertical, (byVert.get(c.vertical) ?? 0) + spend)
    total += spend
  }
  if (total === 0) return []
  return Array.from(byVert.entries())
    .map(([vertical, spend]) => ({ vertical, spend, pct: (spend / total) * 100 }))
    .sort((a, b) => b.spend - a.spend)
}

export interface TopCampaignRow {
  id: string
  name: string
  status: CampaignStatus
  spend: number
  impressions: number
  clicks: number
}

export function topBySpend(
  perCampaign: {
    campaignId: string
    _sum: { spendUsdCents: number | null; impressions: number | null; clicks: number | null }
  }[],
  campaigns: { id: string; name: string; status: CampaignStatus }[],
): TopCampaignRow[] {
  return perCampaign
    .map((row) => {
      const c = campaigns.find((x) => x.id === row.campaignId)
      if (!c) return null
      return {
        id: c.id,
        name: c.name,
        status: c.status,
        spend: row._sum.spendUsdCents ?? 0,
        impressions: row._sum.impressions ?? 0,
        clicks: row._sum.clicks ?? 0,
      }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null && x.spend > 0)
    .sort((a, b) => b.spend - a.spend)
}
