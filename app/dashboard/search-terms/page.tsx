import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { centsToUsd, formatCompact } from "@/lib/money"
import { buildSearchTerms, type MatchType, type TermStatus } from "@/lib/searchTerms"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MATCH_STYLE: Record<MatchType, string> = {
  "wallet behavior": "bg-[#F0E8FF] text-[#6D28D9] border-[rgba(109,40,217,0.2)]",
  contract: "bg-[#E8F4F7] text-[#0E7490] border-[rgba(14,116,144,0.2)]",
  chain: "bg-[#EAF1FF] text-[#1E40AF] border-[rgba(30,64,175,0.2)]",
  geo: "bg-[#FFF7E0] text-[#A16207] border-[rgba(161,98,7,0.2)]",
}

const STATUS_STYLE: Record<TermStatus, string> = {
  added: "bg-[#F0F7E8] text-[#3F6212] border-[rgba(101,163,13,0.2)]",
  suggested: "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]",
  excluded: "bg-[rgba(55,50,47,0.06)] text-[#37322F]/60 border-[rgba(55,50,47,0.16)]",
}

export default async function SearchTermsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const since = new Date()
  since.setDate(since.getDate() - 30)
  since.setHours(0, 0, 0, 0)

  const [campaigns, segments] = await Promise.all([
    prisma.campaign.findMany({
      where: { advertiserId: advertiser.id },
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
  ])

  const segmentsById = new Map(segments.map((s) => [s.id, s]))
  const rows = buildSearchTerms(campaigns, segmentsById)

  const totals = rows.reduce(
    (acc, r) => ({
      impressions: acc.impressions + r.impressions,
      clicks: acc.clicks + r.clicks,
      spend: acc.spend + r.spendUsdCents,
      conversions: acc.conversions + r.conversions,
    }),
    { impressions: 0, clicks: 0, spend: 0, conversions: 0 },
  )
  const counts = rows.reduce<Record<TermStatus, number>>(
    (acc, r) => ({ ...acc, [r.status]: acc[r.status] + 1 }),
    { added: 0, suggested: 0, excluded: 0 },
  )

  if (rows.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">Search terms</span>
        </h1>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Wallet signals & on-chain queries that triggered your ads · Last 30 days · {counts.added} added · {counts.suggested} suggested · {counts.excluded} excluded
        </p>
      </div>

      <div className="grid gap-2.5 grid-cols-2 md:grid-cols-4">
        <Kpi label="Impressions" value={formatCompact(totals.impressions)} />
        <Kpi
          label="Clicks"
          value={formatCompact(totals.clicks)}
          sub={totals.impressions > 0 ? `${((totals.clicks / totals.impressions) * 100).toFixed(2)}% CTR` : undefined}
        />
        <Kpi label="Spend" value={`$${centsToUsd(totals.spend)}`} />
        <Kpi
          label="Conversions"
          value={formatCompact(totals.conversions)}
          sub={totals.conversions > 0 ? `$${centsToUsd(Math.round(totals.spend / totals.conversions))} CPA` : undefined}
        />
      </div>

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">All terms</h3>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[rgba(55,50,47,0.07)] text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Th>Term</Th>
                  <Th>Match type</Th>
                  <Th align="right">Impr.</Th>
                  <Th align="right">Clicks</Th>
                  <Th align="right">CTR</Th>
                  <Th align="right">Spend</Th>
                  <Th align="right">Conv.</Th>
                  <Th align="right">CPA</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(55,50,47,0.05)]">
                {rows.map((t) => {
                  const ctr = t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0
                  const cpa = t.conversions > 0 ? t.spendUsdCents / t.conversions : 0
                  return (
                    <tr key={`${t.matchType}:${t.term}`} className="hover:bg-[rgba(55,50,47,0.02)]">
                      <Td><span className="font-medium">{t.term}</span></Td>
                      <Td>
                        <Badge variant="outline" className={`h-4 px-1.5 text-[9px] uppercase tracking-wider ${MATCH_STYLE[t.matchType]}`}>
                          {t.matchType}
                        </Badge>
                      </Td>
                      <Td align="right" mono>{t.impressions === 0 ? "—" : formatCompact(t.impressions)}</Td>
                      <Td align="right" mono>{t.clicks === 0 ? "—" : formatCompact(t.clicks)}</Td>
                      <Td align="right" mono>{t.impressions === 0 ? "—" : `${ctr.toFixed(2)}%`}</Td>
                      <Td align="right" mono>{t.spendUsdCents === 0 ? "—" : `$${centsToUsd(t.spendUsdCents)}`}</Td>
                      <Td align="right" mono>{t.conversions === 0 ? "—" : formatCompact(t.conversions)}</Td>
                      <Td align="right" mono>{cpa > 0 ? `$${centsToUsd(Math.round(cpa))}` : "—"}</Td>
                      <Td>
                        <Badge variant="outline" className={`h-4 px-1.5 text-[9px] uppercase tracking-wider ${STATUS_STYLE[t.status]}`}>
                          {t.status}
                        </Badge>
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-[10px] text-muted-foreground italic px-1">
        Delivery is split evenly across each campaign's targeting facets (chains, segments, geos, contracts). Once the indexer ingests per-impression wallet signals, this view will switch to per-event attribution.
        {" "}
        <Link href="/dashboard/segments" className="underline underline-offset-2 hover:text-[#37322F]">View audience segments →</Link>
      </p>
    </div>
  )
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string | undefined }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-[rgba(55,50,47,0.12)] bg-white p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-[20px] font-medium text-[#37322F] tabular-nums leading-none">{value}</div>
      {sub && <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">{sub}</div>}
    </div>
  )
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }): React.JSX.Element {
  return <th className={`px-3 py-2 font-medium ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>
}

function Td({ children, align, mono }: { children: React.ReactNode; align?: "right"; mono?: boolean }): React.JSX.Element {
  return <td className={`px-3 py-2 text-[#37322F] ${align === "right" ? "text-right" : ""} ${mono ? "tabular-nums" : ""}`}>{children}</td>
}

function EmptyState(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">Search terms</span>
        </h1>
      </div>
      <Card className="border-[rgba(55,50,47,0.12)]">
        <CardContent className="py-16 text-center">
          <p className="text-sm font-medium text-[#37322F]">No targeting facets yet</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Add chains, audience segments or contract holdings to a campaign and they'll appear here as triggered terms.
          </p>
          <Link href="/dashboard/campaigns/new" className="mt-4 inline-block text-[11px] font-medium text-[#37322F] underline underline-offset-2">
            Create a campaign →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
