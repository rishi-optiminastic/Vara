import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd, formatCompact } from "@/lib/money"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { InsightsKpis } from "@/components/insights/InsightsKpis"
import { InsightsTrendChart, type TrendPoint } from "@/components/insights/InsightsTrendChart"
import type { CampaignStatus, Vertical } from "@prisma/client"

interface MetricSum {
  spendUsdCents: number
  impressions: number
  clicks: number
  walletConnects: number
  onChainConvs: number
}

const ZERO: MetricSum = {
  spendUsdCents: 0,
  impressions: 0,
  clicks: 0,
  walletConnects: 0,
  onChainConvs: 0,
}

export default async function InsightsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const since = new Date()
  since.setDate(since.getDate() - 30)
  since.setHours(0, 0, 0, 0)

  const campaignIds = (
    await prisma.campaign.findMany({
      where: { advertiserId: advertiser.id },
      select: { id: true },
    })
  ).map((c) => c.id)

  if (campaignIds.length === 0) {
    return <EmptyState />
  }

  const [metrics, perCampaign, campaigns] = await Promise.all([
    prisma.metricDaily.findMany({
      where: { campaignId: { in: campaignIds }, date: { gte: since } },
      orderBy: { date: "asc" },
    }),
    prisma.metricDaily.groupBy({
      by: ["campaignId"],
      where: { campaignId: { in: campaignIds }, date: { gte: since } },
      _sum: { spendUsdCents: true, impressions: true, clicks: true, onChainConvs: true },
    }),
    prisma.campaign.findMany({
      where: { id: { in: campaignIds } },
      select: { id: true, name: true, status: true, vertical: true },
    }),
  ])

  const totals = metrics.reduce<MetricSum>(
    (acc, m) => ({
      spendUsdCents: acc.spendUsdCents + m.spendUsdCents,
      impressions: acc.impressions + m.impressions,
      clicks: acc.clicks + m.clicks,
      walletConnects: acc.walletConnects + m.walletConnects,
      onChainConvs: acc.onChainConvs + m.onChainConvs,
    }),
    ZERO,
  )

  const series = bucketByDay(metrics)
  const verticalSpend = bucketByVertical(perCampaign, campaigns)
  const topCampaigns = topByspend(perCampaign, campaigns).slice(0, 5)

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">Insights</span>
        </h1>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Portfolio performance · Last 30 days · {campaignIds.length} {campaignIds.length === 1 ? "campaign" : "campaigns"}
        </p>
      </div>

      <InsightsKpis {...totals} />

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Spend trend
          </h3>
        </div>
        <CardContent className="p-3.5">
          <InsightsTrendChart series={series} />
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Top campaigns by spend</h3>
          </div>
          <CardContent className="p-0">
            {topCampaigns.length === 0 ? (
              <p className="px-3.5 py-6 text-center text-[11px] text-muted-foreground">No spend yet</p>
            ) : (
              <div className="divide-y divide-[rgba(55,50,47,0.07)]">
                {topCampaigns.map((c) => (
                  <Link
                    key={c.id}
                    href={`/dashboard/campaigns/${c.id}`}
                    className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-[rgba(55,50,47,0.02)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#37322F] truncate">{c.name}</div>
                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground tabular-nums">
                        <StatusBadge status={c.status} />
                        <span>{formatCompact(c.impressions)} impr</span>
                        <span>·</span>
                        <span>{formatCompact(c.clicks)} clicks</span>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-[#37322F] tabular-nums shrink-0">
                      ${centsToUsd(c.spend)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Spend by vertical</h3>
          </div>
          <CardContent className="p-3.5">
            {verticalSpend.length === 0 ? (
              <p className="py-6 text-center text-[11px] text-muted-foreground">No spend yet</p>
            ) : (
              <div className="space-y-2.5">
                {verticalSpend.map((v) => (
                  <div key={v.vertical}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#37322F] capitalize">{v.vertical.replace(/_/g, " ").toLowerCase()}</span>
                      <span className="font-medium text-[#37322F] tabular-nums">${centsToUsd(v.spend)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[rgba(55,50,47,0.06)]">
                      <div className="h-full bg-[#37322F]" style={{ width: `${v.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function bucketByDay(metrics: { date: Date; spendUsdCents: number; impressions: number }[]): TrendPoint[] {
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

function bucketByVertical(
  perCampaign: { campaignId: string; _sum: { spendUsdCents: number | null } }[],
  campaigns: { id: string; vertical: Vertical }[],
): { vertical: Vertical; spend: number; pct: number }[] {
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

function topByspend(
  perCampaign: { campaignId: string; _sum: { spendUsdCents: number | null; impressions: number | null; clicks: number | null } }[],
  campaigns: { id: string; name: string; status: CampaignStatus }[],
): { id: string; name: string; status: CampaignStatus; spend: number; impressions: number; clicks: number }[] {
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

function EmptyState(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">Insights</span>
        </h1>
      </div>
      <Card className="border-[rgba(55,50,47,0.12)]">
        <CardContent className="py-16 text-center">
          <p className="text-sm font-medium text-[#37322F]">Nothing to analyze yet</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Create a campaign and run some delivery — performance insights will appear here.
          </p>
          <Link href="/dashboard/campaigns/new" className="mt-4 inline-block text-[11px] font-medium text-[#37322F] underline underline-offset-2">
            Create your first campaign →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
