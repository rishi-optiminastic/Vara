import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd, formatCompact } from "@/lib/money"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { InsightsKpis } from "@/components/insights/InsightsKpis"
import { InsightsTrendChart } from "@/components/insights/InsightsTrendChart"
import { bucketByDay, bucketByVertical, topBySpend } from "@/lib/insightsAggregation"
import { parseUniversalFilters, fetchFilterScope, campaignWhere } from "@/lib/universalFilter"
import { fetchCampaignDetail } from "@/lib/campaignDetail"
import { DashedGridShell } from "@/components/dashboard/DashedGridShell"
import { UniversalFilterBar } from "@/components/dashboard/UniversalFilterBar"
import { CampaignDetailCard } from "@/components/dashboard/CampaignDetailCard"

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

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

export default async function InsightsPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const params = await searchParams
  const filters = parseUniversalFilters(params)

  const since = new Date()
  since.setDate(since.getDate() - 30)
  since.setHours(0, 0, 0, 0)

  const filteredCampaigns = await prisma.campaign.findMany({
    where: campaignWhere(filters, advertiser.id),
    select: { id: true },
  })
  const campaignIds = filteredCampaigns.map((c) => c.id)

  const scope = await fetchFilterScope(advertiser.id, filters.campaignId)

  if (scope.campaigns.length === 0) {
    return <EmptyState />
  }

  const [metrics, perCampaign, campaigns, campaignDetail] = await Promise.all([
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
    filters.campaignId
      ? fetchCampaignDetail(advertiser.id, filters.campaignId, since)
      : Promise.resolve(null),
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
  const topCampaigns = topBySpend(perCampaign, campaigns).slice(0, 5)

  return (
    <Shell metaText={`Portfolio · Last 30 days · ${campaignIds.length} ${campaignIds.length === 1 ? "campaign" : "campaigns"}`}>
      <UniversalFilterBar
        campaigns={scope.campaigns}
        adGroups={scope.adGroups}
        selectedStatuses={filters.statuses}
        selectedCampaignId={filters.campaignId}
        selectedAdGroupId={filters.adGroupId}
      />

      {campaignDetail && <CampaignDetailCard detail={campaignDetail} />}

      <InsightsKpis {...totals} />

      <FlatSection title="Spend trend" meta="Last 30 days">
        <div className="px-2 pt-1 pb-1.5">
          <InsightsTrendChart series={series} />
        </div>
      </FlatSection>

      <div className="grid gap-2.5 lg:grid-cols-2">
        <FlatSection title="Top campaigns by spend" meta={`${topCampaigns.length} of ${campaignIds.length}`}>
          {topCampaigns.length === 0 ? (
            <p className="px-3 py-6 text-center text-[11px] text-muted-foreground">No spend yet</p>
          ) : (
            <div className="divide-y divide-dashed divide-[rgba(10,10,10,0.1)]">
              {topCampaigns.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/campaigns/${c.id}`}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#0A0A0A]/2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#0A0A0A] truncate">{c.name}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground tabular-nums">
                      <StatusBadge status={c.status} />
                      <span>{formatCompact(c.impressions)} impr</span>
                      <span className="text-[#0A0A0A]/20">·</span>
                      <span>{formatCompact(c.clicks)} clicks</span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-[#0A0A0A] tabular-nums shrink-0">
                    ${centsToUsd(c.spend)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </FlatSection>

        <FlatSection title="Spend by vertical">
          <div className="px-3 py-2.5">
            {verticalSpend.length === 0 ? (
              <p className="py-6 text-center text-[11px] text-muted-foreground">No spend yet</p>
            ) : (
              <div className="space-y-2.5">
                {verticalSpend.map((v) => (
                  <div key={v.vertical}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#0A0A0A] capitalize">{v.vertical.replace(/_/g, " ").toLowerCase()}</span>
                      <span className="font-medium text-[#0A0A0A] tabular-nums">${centsToUsd(v.spend)}</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden bg-[rgba(10,10,10,0.06)]">
                      <div className="h-full bg-[#1F40CD]" style={{ width: `${v.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FlatSection>
      </div>
    </Shell>
  )
}

interface ShellProps {
  metaText: string
  children: React.ReactNode
}

function Shell({ metaText, children }: ShellProps): React.JSX.Element {
  return (
    <DashedGridShell>
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <div className="shrink-0 flex items-baseline gap-2">
          <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">Insights</h1>
          <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
            {metaText}
          </span>
        </div>
      </div>
      {children}
    </DashedGridShell>
  )
}

interface FlatSectionProps {
  title: string
  meta?: string
  children: React.ReactNode
}

function FlatSection({ title, meta, children }: FlatSectionProps): React.JSX.Element {
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between border-b border-dashed border-[rgba(10,10,10,0.12)] px-3 py-1.5">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
        {meta && <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/70 tabular-nums">{meta}</span>}
      </div>
      {children}
    </div>
  )
}

function EmptyState(): React.JSX.Element {
  return (
    <Shell metaText="No campaigns · Last 30 days">
      <div className="bg-white py-16 text-center">
        <p className="text-[13px] font-medium text-[#0A0A0A]">Nothing to analyze yet</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Create a campaign and run some delivery — performance insights will appear here.
        </p>
        <Link href="/dashboard/campaigns/new" className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-widest text-[#1F40CD] hover:underline underline-offset-2">
          Create your first campaign →
        </Link>
      </div>
    </Shell>
  )
}
