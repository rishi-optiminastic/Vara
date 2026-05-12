import Link from "next/link"
import { redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCompact } from "@/lib/money"

interface CompetitorRow {
  name: string
  impressionSharePct: number
  overlapRatePct: number
  avgPosition: number
  outranked: boolean
}

interface ChainRow {
  chain: string
  yourSharePct: number
  marketSize: number
  topRivalSharePct: number
  trend: "up" | "down" | "flat"
}

const COMPETITORS: CompetitorRow[] = [
  { name: "MetaBidder", impressionSharePct: 42.6, overlapRatePct: 71.0, avgPosition: 1.4, outranked: true },
  { name: "ChainReach DSP", impressionSharePct: 18.3, overlapRatePct: 55.2, avgPosition: 2.1, outranked: false },
  { name: "Wallet IQ", impressionSharePct: 12.8, overlapRatePct: 41.7, avgPosition: 2.5, outranked: false },
  { name: "DeFi Audience Co", impressionSharePct: 7.4, overlapRatePct: 28.3, avgPosition: 3.0, outranked: false },
  { name: "OnChainAds", impressionSharePct: 4.1, overlapRatePct: 12.6, avgPosition: 3.7, outranked: false },
]

const BY_CHAIN: ChainRow[] = [
  { chain: "Ethereum", yourSharePct: 24.5, marketSize: 4_120_000, topRivalSharePct: 38.2, trend: "up" },
  { chain: "Base", yourSharePct: 41.7, marketSize: 1_870_000, topRivalSharePct: 22.4, trend: "up" },
  { chain: "Polygon", yourSharePct: 18.0, marketSize: 2_240_000, topRivalSharePct: 41.0, trend: "down" },
  { chain: "Arbitrum", yourSharePct: 28.9, marketSize: 1_510_000, topRivalSharePct: 25.6, trend: "flat" },
  { chain: "Optimism", yourSharePct: 12.3, marketSize: 980_000, topRivalSharePct: 49.8, trend: "down" },
]

const YOUR_SHARE_PCT = 23.4
const WIN_RATE_PCT = 38.6
const AVG_POSITION = 1.9
const OUTBID_RATE_PCT = 11.2

export default async function AuctionInsightsPage(): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div>
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            <span className="font-instrument-serif italic font-normal text-[26px]">Auction insights</span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            How your bids stack up vs. other DSPs · Last 30 days
          </p>
        </div>
        <Badge variant="outline" className="h-5 px-2 text-[10px] uppercase tracking-widest bg-[#FFF3E8] border-[rgba(194,65,12,0.2)] text-[#C2410C]">
          Sample data
        </Badge>
      </div>

      <div className="grid gap-2.5 grid-cols-2 md:grid-cols-4">
        <Kpi label="Your impression share" value={`${YOUR_SHARE_PCT}%`} sub="of eligible impressions" />
        <Kpi label="Win rate" value={`${WIN_RATE_PCT}%`} sub="bids won when entering auction" />
        <Kpi label="Avg auction position" value={AVG_POSITION.toFixed(1)} sub="lower is better" />
        <Kpi label="Outbid rate" value={`${OUTBID_RATE_PCT}%`} sub="lost to higher bidder" />
      </div>

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Competitor landscape
          </h3>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[rgba(55,50,47,0.07)] text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Th>DSP</Th>
                  <Th align="right">Impression share</Th>
                  <Th align="right">Overlap rate</Th>
                  <Th align="right">Avg position</Th>
                  <Th align="right">Position vs you</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(55,50,47,0.05)]">
                {COMPETITORS.map((c) => (
                  <tr key={c.name} className="hover:bg-[rgba(55,50,47,0.02)]">
                    <Td>{c.name}</Td>
                    <Td align="right" mono>
                      <ShareBar pct={c.impressionSharePct} />
                    </Td>
                    <Td align="right" mono>{c.overlapRatePct.toFixed(1)}%</Td>
                    <Td align="right" mono>{c.avgPosition.toFixed(1)}</Td>
                    <Td align="right">
                      <Badge
                        variant="outline"
                        className={`h-4 px-1.5 text-[9px] uppercase tracking-wider ${c.outranked ? "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]" : "bg-[#F0F7E8] text-[#3F6212] border-[rgba(101,163,13,0.2)]"}`}
                      >
                        {c.outranked ? "Above you" : "Below you"}
                      </Badge>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Share by chain
          </h3>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[rgba(55,50,47,0.07)] text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Th>Chain</Th>
                  <Th align="right">Your share</Th>
                  <Th align="right">Market size</Th>
                  <Th align="right">Top rival</Th>
                  <Th align="right">Trend</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(55,50,47,0.05)]">
                {BY_CHAIN.map((r) => (
                  <tr key={r.chain} className="hover:bg-[rgba(55,50,47,0.02)]">
                    <Td>{r.chain}</Td>
                    <Td align="right" mono>
                      <ShareBar pct={r.yourSharePct} />
                    </Td>
                    <Td align="right" mono>{formatCompact(r.marketSize)} impr/day</Td>
                    <Td align="right" mono>{r.topRivalSharePct.toFixed(1)}%</Td>
                    <Td align="right">
                      <TrendPill trend={r.trend} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-[10px] text-muted-foreground italic px-1">
        Auction data is anonymized and aggregated across the Vara exchange. Replace with live data once the RTB exchange is wired to write per-auction telemetry.
        {" "}
        <Link href="/dashboard/recommendations" className="underline underline-offset-2 hover:text-[#37322F]">View tuning suggestions →</Link>
      </p>
    </div>
  )
}

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-[rgba(55,50,47,0.12)] bg-white p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1.5 text-[20px] font-medium text-[#37322F] tabular-nums leading-none">{value}</div>
      {sub && <div className="mt-1 text-[10px] text-muted-foreground">{sub}</div>}
    </div>
  )
}

function ShareBar({ pct }: { pct: number }): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 justify-end">
      <span className="tabular-nums">{pct.toFixed(1)}%</span>
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[rgba(55,50,47,0.08)]">
        <div className="h-full bg-[#37322F]" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}

function TrendPill({ trend }: { trend: "up" | "down" | "flat" }): React.JSX.Element {
  const map = {
    up: { label: "↑ growing", cls: "bg-[#F0F7E8] text-[#3F6212] border-[rgba(101,163,13,0.2)]" },
    down: { label: "↓ shrinking", cls: "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]" },
    flat: { label: "→ flat", cls: "bg-[rgba(55,50,47,0.06)] text-[#37322F] border-[rgba(55,50,47,0.16)]" },
  }
  const t = map[trend]
  return <Badge variant="outline" className={`h-4 px-1.5 text-[9px] uppercase tracking-wider ${t.cls}`}>{t.label}</Badge>
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }): React.JSX.Element {
  return <th className={`px-3 py-2 font-medium ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>
}

function Td({ children, align, mono }: { children: React.ReactNode; align?: "right"; mono?: boolean }): React.JSX.Element {
  return <td className={`px-3 py-2 text-[#37322F] ${align === "right" ? "text-right" : ""} ${mono ? "tabular-nums" : ""}`}>{children}</td>
}
