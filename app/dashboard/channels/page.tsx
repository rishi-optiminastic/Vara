import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { centsToUsd, formatCompact } from "@/lib/money"
import { fetchChannelPerformance } from "@/lib/channelPerformance"
import { DashedGridShell } from "@/components/dashboard/DashedGridShell"

const CATEGORY_LABEL: Record<string, string> = {
  DEFI: "DeFi",
  NFT: "NFT",
  GAMING: "Gaming",
  DAO: "DAO",
  WALLET: "Wallet",
  NEWS: "News",
  RESEARCH: "Research",
  SOCIAL: "Social",
  OTHER: "Other",
}

export default async function ChannelsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")

  const since = new Date()
  since.setDate(since.getDate() - 30)
  since.setHours(0, 0, 0, 0)

  const rows = await fetchChannelPerformance(since)

  const totals = rows.reduce(
    (acc, r) => ({
      impressions: acc.impressions + r.impressions,
      clicks: acc.clicks + r.clicks,
      spend: acc.spend + r.grossUsdcCents,
      placements: acc.placements + r.placementCount,
    }),
    { impressions: 0, clicks: 0, spend: 0, placements: 0 },
  )

  if (rows.length === 0) {
    return (
      <DashedGridShell>
        <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">Channel performance</h1>
        <div className="bg-white py-16 text-center">
          <p className="text-[13px] font-medium text-[#0A0A0A]">No publisher inventory yet</p>
          <p className="mt-1 text-[11px] text-muted-foreground max-w-md mx-auto">
            Publishers will appear here once they register their sites via the SSP and your campaigns start serving on them.
          </p>
        </div>
      </DashedGridShell>
    )
  }

  return (
    <DashedGridShell>
      <div className="flex items-end justify-between gap-2 flex-wrap">
        <div className="shrink-0 flex items-baseline gap-2">
          <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">Channel performance</h1>
          <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
            {rows.length} {rows.length === 1 ? "publisher" : "publishers"}
            <span className="mx-1.5 text-[#0A0A0A]/30">·</span>Last 30 days
          </span>
        </div>
      </div>

      <Kpis totals={totals} />

      <div className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-dashed border-[rgba(10,10,10,0.12)] text-[9.5px] font-semibold uppercase tracking-widest text-muted-foreground">
                <Th>Publisher</Th>
                <Th>Category</Th>
                <Th align="right">Placements</Th>
                <Th align="right">Impr.</Th>
                <Th align="right">Clicks</Th>
                <Th align="right">CTR</Th>
                <Th align="right">Spend</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dashed divide-[rgba(10,10,10,0.08)]">
              {rows.map((r) => (
                <tr key={r.publisherId} className="hover:bg-[#0A0A0A]/2 transition-colors">
                  <Td>
                    <div className="font-medium text-[#0A0A0A]">{r.siteName}</div>
                    {r.primaryUrl && (
                      <div className="text-[10px] text-muted-foreground truncate max-w-[260px]">{r.primaryUrl}</div>
                    )}
                  </Td>
                  <Td>
                    <span className="text-[9.5px] font-semibold uppercase tracking-widest text-[#1F40CD]">
                      {CATEGORY_LABEL[r.category] ?? r.category}
                    </span>
                  </Td>
                  <Td align="right" mono>{r.placementCount}</Td>
                  <Td align="right" mono>{r.impressions === 0 ? "—" : formatCompact(r.impressions)}</Td>
                  <Td align="right" mono>{r.clicks === 0 ? "—" : formatCompact(r.clicks)}</Td>
                  <Td align="right" mono>{r.impressions === 0 ? "—" : `${r.ctrPct.toFixed(2)}%`}</Td>
                  <Td align="right" mono>{r.grossUsdcCents === 0 ? "—" : centsToUsd(r.grossUsdcCents)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground italic px-1">
        Spend reflects gross paid to publishers via the SSP ledger. Per-campaign attribution lands when the auction join is wired up.{" "}
        <Link href="/dashboard/analytics" className="underline underline-offset-2 hover:text-[#0A0A0A]">View portfolio insights →</Link>
      </p>
    </DashedGridShell>
  )
}

interface KpisProps {
  totals: { impressions: number; clicks: number; spend: number; placements: number }
}

function Kpis({ totals }: KpisProps): React.JSX.Element {
  const ctr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : null
  const items: { label: string; value: string; sub?: string }[] = [
    { label: "Publishers reached", value: formatCompact(totals.placements > 0 ? totals.placements : 0), sub: `${totals.placements} placements` },
    { label: "Impressions", value: formatCompact(totals.impressions) },
    { label: "Clicks", value: formatCompact(totals.clicks), ...(ctr ? { sub: `${ctr}% CTR` } : {}) },
    { label: "Spend", value: centsToUsd(totals.spend), sub: "Gross to publishers" },
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
