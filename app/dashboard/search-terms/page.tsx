import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd, formatCompact } from "@/lib/money"
import { buildSearchTerms, type MatchType, type TermStatus } from "@/lib/searchTerms"
import { fetchAdvertiserDailySeries } from "@/lib/dashboardMetrics"
import { parseUniversalFilters, fetchFilterScope, campaignWhere } from "@/lib/universalFilter"
import { fetchCampaignDetail } from "@/lib/campaignDetail"
import { DashedGridShell } from "@/components/dashboard/DashedGridShell"
import { DailyTrendChart } from "@/components/dashboard/DailyTrendChart"
import { UniversalFilterBar } from "@/components/dashboard/UniversalFilterBar"
import { CampaignDetailCard } from "@/components/dashboard/CampaignDetailCard"
import { Kpis, StatusPill, Th, Td } from "./parts"

const VALID_STATUS = new Set<TermStatus>(["added", "suggested", "excluded"])

const FILTERS: { value: "all" | TermStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "added", label: "Added" },
  { value: "suggested", label: "Suggested" },
  { value: "excluded", label: "Excluded" },
]

const MATCH_LABEL: Record<MatchType, string> = {
  "wallet behavior": "wallet",
  contract: "contract",
  chain: "chain",
  geo: "geo",
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function SearchTermsPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const params = await searchParams
  const termStatusParam = params["termStatus"]
  const activeFilter: "all" | TermStatus = VALID_STATUS.has(termStatusParam as TermStatus)
    ? (termStatusParam as TermStatus)
    : "all"

  const universalFilters = parseUniversalFilters(params)

  const since = new Date()
  since.setDate(since.getDate() - 30)
  since.setHours(0, 0, 0, 0)

  const [campaigns, segments, dailySeries, scope, campaignDetail] = await Promise.all([
    prisma.campaign.findMany({
      where: campaignWhere(universalFilters, advertiser.id),
      select: {
        id: true,
        status: true,
        targeting: true,
        metrics: {
          where: { date: { gte: since } },
          select: { impressions: true, clicks: true, spendUsdCents: true, onChainConvs: true },
        },
      },
    }),
    prisma.walletSegment.findMany(),
    fetchAdvertiserDailySeries(advertiser.id, since),
    fetchFilterScope(advertiser.id, universalFilters.campaignId),
    universalFilters.campaignId
      ? fetchCampaignDetail(advertiser.id, universalFilters.campaignId, since)
      : Promise.resolve(null),
  ])

  const segmentsById = new Map(segments.map((s) => [s.id, s]))
  const allRows = buildSearchTerms(campaigns, segmentsById)
  const counts = allRows.reduce<Record<TermStatus, number>>(
    (acc, r) => ({ ...acc, [r.status]: acc[r.status] + 1 }),
    { added: 0, suggested: 0, excluded: 0 },
  )
  const rows = activeFilter === "all" ? allRows : allRows.filter((r) => r.status === activeFilter)

  const totals = rows.reduce(
    (acc, r) => ({
      impressions: acc.impressions + r.impressions,
      clicks: acc.clicks + r.clicks,
      spend: acc.spend + r.spendUsdCents,
      conversions: acc.conversions + r.conversions,
    }),
    { impressions: 0, clicks: 0, spend: 0, conversions: 0 },
  )

  if (allRows.length === 0) {
    return <EmptyState />
  }

  return (
    <DashedGridShell>
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <div className="shrink-0 flex items-baseline gap-2">
          <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">
            Search terms
          </h1>
            <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
              {allRows.length} total
              <span className="mx-1.5 text-[#0A0A0A]/30">·</span>Last 30 days
            </span>
          </div>
        </div>

        <UniversalFilterBar
          campaigns={scope.campaigns}
          adGroups={scope.adGroups}
          selectedStatuses={universalFilters.statuses}
          selectedCampaignId={universalFilters.campaignId}
          selectedAdGroupId={universalFilters.adGroupId}
        />

        {campaignDetail && <CampaignDetailCard detail={campaignDetail} />}

        <DailyTrendChart series={dailySeries} initial="clicks" emptyLabel="No traffic in the last 30 days" />

        <Kpis totals={totals} />

        <div className="flex items-stretch border-y border-dashed border-[rgba(10,10,10,0.12)] bg-white">
          {FILTERS.map((f, i) => {
            const active = f.value === activeFilter
            const count = f.value === "all" ? allRows.length : counts[f.value]
            const href = f.value === "all" ? "/dashboard/search-terms" : `/dashboard/search-terms?termStatus=${f.value}`
            return (
              <Link
                key={f.value}
                href={href}
                className={`relative flex-1 px-3 py-2 text-left transition-colors ${
                  i > 0 ? "border-l border-dashed border-[rgba(10,10,10,0.12)]" : ""
                } ${active ? "text-[#0A0A0A]" : "text-muted-foreground hover:bg-[#0A0A0A]/2"}`}
              >
                {active && (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-[#1F40CD]" />
                )}
                <div className={`text-[10px] font-semibold uppercase tracking-widest ${active ? "text-[#1F40CD]" : ""}`}>
                  {f.label}
                </div>
                <div className="mt-0.5 text-[14px] font-medium tabular-nums text-[#0A0A0A]">{count}</div>
              </Link>
            )
          })}
        </div>

        {rows.length === 0 ? (
          <div className="bg-white py-12 text-center">
            <p className="text-[12px] font-medium text-[#0A0A0A]">No terms in this filter</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Try another status filter.</p>
          </div>
        ) : (
          <div className="bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-dashed border-[rgba(10,10,10,0.12)] text-[9.5px] font-semibold uppercase tracking-widest text-muted-foreground">
                    <Th>Term</Th>
                    <Th>Match</Th>
                    <Th align="right">Impr.</Th>
                    <Th align="right">Clicks</Th>
                    <Th align="right">CTR</Th>
                    <Th align="right">Spend</Th>
                    <Th align="right">Conv.</Th>
                    <Th align="right">CPA</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-[rgba(10,10,10,0.08)]">
                  {rows.map((t) => {
                    const ctr = t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0
                    const cpa = t.conversions > 0 ? t.spendUsdCents / t.conversions : 0
                    return (
                      <tr key={`${t.matchType}:${t.term}`} className="hover:bg-[#0A0A0A]/2 transition-colors">
                        <Td><span className="font-medium text-[#0A0A0A]">{t.term}</span></Td>
                        <Td><span className="text-[9.5px] font-semibold uppercase tracking-widest text-[#1F40CD]">{MATCH_LABEL[t.matchType]}</span></Td>
                        <Td align="right" mono>{t.impressions === 0 ? "—" : formatCompact(t.impressions)}</Td>
                        <Td align="right" mono>{t.clicks === 0 ? "—" : formatCompact(t.clicks)}</Td>
                        <Td align="right" mono>{t.impressions === 0 ? "—" : `${ctr.toFixed(2)}%`}</Td>
                        <Td align="right" mono>{t.spendUsdCents === 0 ? "—" : centsToUsd(t.spendUsdCents)}</Td>
                        <Td align="right" mono>{t.conversions === 0 ? "—" : formatCompact(t.conversions)}</Td>
                        <Td align="right" mono>{cpa > 0 ? centsToUsd(Math.round(cpa)) : "—"}</Td>
                        <Td><StatusPill status={t.status} /></Td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      <p className="text-[10px] text-muted-foreground italic px-1">
        Delivery is split evenly across each campaign's targeting facets (chains, segments, geos, contracts). Once the indexer ingests per-impression wallet signals, this view will switch to per-event attribution.{" "}
        <Link href="/dashboard/segments" className="underline underline-offset-2 hover:text-[#0A0A0A]">View audience segments →</Link>
      </p>
    </DashedGridShell>
  )
}

function EmptyState(): React.JSX.Element {
  return (
    <DashedGridShell>
      <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">Search terms</h1>
      <div className="bg-white py-16 text-center">
        <p className="text-[13px] font-medium text-[#0A0A0A]">No targeting facets yet</p>
        <p className="mt-1 text-[11px] text-muted-foreground max-w-sm mx-auto">
          Add chains, audience segments or contract holdings to a campaign and they'll appear here as triggered terms.
        </p>
        <Link
          href="/dashboard/campaigns/new"
          className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-widest text-[#1F40CD] hover:underline underline-offset-2"
        >
          Create a campaign →
        </Link>
      </div>
    </DashedGridShell>
  )
}
