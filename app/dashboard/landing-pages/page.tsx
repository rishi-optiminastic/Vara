import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd, formatCompact } from "@/lib/money"
import { fetchLandingPagePerformance } from "@/lib/landingPages"
import { fetchAdvertiserDailySeries } from "@/lib/dashboardMetrics"
import { parseUniversalFilters, fetchFilterScope } from "@/lib/universalFilter"
import { fetchCampaignDetail } from "@/lib/campaignDetail"
import { DashedGridShell } from "@/components/dashboard/DashedGridShell"
import { DailyTrendChart } from "@/components/dashboard/DailyTrendChart"
import { UniversalFilterBar } from "@/components/dashboard/UniversalFilterBar"
import { CampaignDetailCard } from "@/components/dashboard/CampaignDetailCard"

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function LandingPagesPage({ searchParams }: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const params = await searchParams
  const filters = parseUniversalFilters(params)

  const since = new Date()
  since.setDate(since.getDate() - 30)
  since.setHours(0, 0, 0, 0)

  const [rows, dailySeries, scope, campaignDetail] = await Promise.all([
    fetchLandingPagePerformance(advertiser.id, since, filters),
    fetchAdvertiserDailySeries(advertiser.id, since),
    fetchFilterScope(advertiser.id, filters.campaignId),
    filters.campaignId
      ? fetchCampaignDetail(advertiser.id, filters.campaignId, since)
      : Promise.resolve(null),
  ])

  const totals = rows.reduce(
    (acc, r) => ({
      urls: acc.urls + 1,
      clicks: acc.clicks + r.clicks,
      spend: acc.spend + r.spendUsdcCents,
      conversions: acc.conversions + r.walletConnects + r.onChainConvs,
    }),
    { urls: 0, clicks: 0, spend: 0, conversions: 0 },
  )

  if (rows.length === 0) {
    return (
      <DashedGridShell>
        <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">Landing pages</h1>
        <div className="bg-white py-16 text-center">
          <p className="text-[13px] font-medium text-[#0A0A0A]">No destination URLs yet</p>
          <p className="mt-1 text-[11px] text-muted-foreground max-w-md mx-auto">
            Once you add ads with click URLs, this view will rank your landing pages by spend, CTR, and conversion rate.
          </p>
          <Link
            href="/dashboard/ads/new"
            className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-widest text-[#1F40CD] hover:underline underline-offset-2"
          >
            Create your first ad →
          </Link>
        </div>
      </DashedGridShell>
    )
  }

  return (
    <DashedGridShell>
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <div className="shrink-0 flex items-baseline gap-2">
          <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">Landing pages</h1>
          <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
            {rows.length} {rows.length === 1 ? "URL" : "URLs"}
            <span className="mx-1.5 text-[#0A0A0A]/30">·</span>Last 30 days
          </span>
        </div>
      </div>

      <UniversalFilterBar
        campaigns={scope.campaigns}
        adGroups={scope.adGroups}
        selectedStatuses={filters.statuses}
        selectedCampaignId={filters.campaignId}
        selectedAdGroupId={filters.adGroupId}
      />

      {campaignDetail && <CampaignDetailCard detail={campaignDetail} />}

      <DailyTrendChart series={dailySeries} initial="spend" emptyLabel="No delivery in the last 30 days" />

      <Kpis totals={totals} />

      <div className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-dashed border-[rgba(10,10,10,0.12)] text-[9.5px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Th>URL</Th>
                <Th>Campaigns</Th>
                <Th align="right">Ads</Th>
                <Th align="right">Impr.</Th>
                <Th align="right">Clicks</Th>
                <Th align="right">CTR</Th>
                <Th align="right">Spend</Th>
                <Th align="right">CVR</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-[rgba(10,10,10,0.08)]">
              {rows.map((r) => (
                <tr key={r.url} className="hover:bg-[#0A0A0A]/2 transition-colors">
                  <Td>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-baseline gap-1"
                    >
                      <span className="font-medium text-[#0A0A0A] group-hover:text-[#1F40CD] group-hover:underline underline-offset-2">{r.host}</span>
                      <span className="text-muted-foreground truncate max-w-[260px]">{r.path}</span>
                      <span aria-hidden className="text-[#0A0A0A]/30 text-[10px]">↗</span>
                    </a>
                  </Td>
                  <Td>
                    <span className="text-[10px] text-muted-foreground truncate max-w-[180px] inline-block">
                      {r.campaigns.length === 1 ? r.campaigns[0] : `${r.campaigns.length} campaigns`}
                    </span>
                  </Td>
                  <Td align="right" mono>{r.adCount}</Td>
                  <Td align="right" mono>{r.impressions === 0 ? "—" : formatCompact(r.impressions)}</Td>
                  <Td align="right" mono>{r.clicks === 0 ? "—" : formatCompact(r.clicks)}</Td>
                  <Td align="right" mono>{r.impressions === 0 ? "—" : `${r.ctrPct.toFixed(2)}%`}</Td>
                  <Td align="right" mono>{r.spendUsdcCents === 0 ? "—" : centsToUsd(r.spendUsdcCents)}</Td>
                  <Td align="right" mono>{r.clicks === 0 ? "—" : `${r.cvrPct.toFixed(2)}%`}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground italic px-1">
        Conversion rate combines wallet connects and on-chain conversions. To improve a low-CVR page, test alternate copy, faster load times, or wallet-connect prompts above the fold.
      </p>
    </DashedGridShell>
  )
}

interface KpisProps {
  totals: { urls: number; clicks: number; spend: number; conversions: number }
}

function Kpis({ totals }: KpisProps): React.JSX.Element {
  const avgCpc = totals.clicks > 0 ? centsToUsd(Math.round(totals.spend / totals.clicks)) : null
  const cvr = totals.clicks > 0 ? ((totals.conversions / totals.clicks) * 100).toFixed(2) : null
  const items: { label: string; value: string; sub?: string }[] = [
    { label: "Destinations", value: String(totals.urls), sub: "Unique URLs" },
    { label: "Clicks", value: formatCompact(totals.clicks), ...(avgCpc ? { sub: `$${avgCpc} avg CPC` } : {}) },
    { label: "Spend", value: centsToUsd(totals.spend) },
    { label: "Conversions", value: formatCompact(totals.conversions), ...(cvr ? { sub: `${cvr}% CVR` } : {}) },
  ]
  return (
    <div className="bg-white grid grid-cols-2 lg:grid-cols-4 divide-x divide-y-0 divide-[rgba(10,10,10,0.08)] max-lg:divide-y max-lg:divide-x-0 max-lg:[&>*:nth-child(2)]:border-l max-lg:[&>*:nth-child(2)]:border-[rgba(10,10,10,0.08)]">
      {items.map((k) => (
        <div key={k.label} className="px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{k.label}</div>
          <div className="mt-1 text-[18px] font-medium text-[#0A0A0A] tabular-nums tracking-[-0.01em] leading-none">{k.value}</div>
          {k.sub && <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">{k.sub}</div>}
        </div>
      ))}
    </div>
  )
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }): React.JSX.Element {
  return <th className={`px-3 py-2 ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>
}

function Td({ children, align, mono }: { children: React.ReactNode; align?: "right"; mono?: boolean }): React.JSX.Element {
  return <td className={`px-3 py-2 text-[#0A0A0A] align-top ${align === "right" ? "text-right" : ""} ${mono ? "tabular-nums" : ""}`}>{children}</td>
}
