import { centsToUsd, formatCompact } from "@/lib/money"
import type { TermStatus } from "@/lib/searchTerms"

interface KpisProps {
  totals: { impressions: number; clicks: number; spend: number; conversions: number }
}

export function Kpis({ totals }: KpisProps): React.JSX.Element {
  const ctr = totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : null
  const cpa = totals.conversions > 0 ? centsToUsd(Math.round(totals.spend / totals.conversions)) : null
  const items: { label: string; value: string; sub?: string }[] = [
    { label: "Impressions", value: formatCompact(totals.impressions) },
    { label: "Clicks", value: formatCompact(totals.clicks), ...(ctr ? { sub: `${ctr}% CTR` } : {}) },
    { label: "Spend", value: centsToUsd(totals.spend) },
    { label: "Conversions", value: formatCompact(totals.conversions), ...(cpa ? { sub: `${cpa} CPA` } : {}) },
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

const STATUS_STYLE: Record<TermStatus, string> = {
  added: "bg-[#1F40CD]/8 text-[#1F40CD]",
  suggested: "bg-[#0A0A0A]/[0.04] text-[#0A0A0A]",
  excluded: "bg-[#0A0A0A]/[0.04] text-[#0A0A0A]/55 line-through",
}

export function StatusPill({ status }: { status: TermStatus }): React.JSX.Element {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  )
}

export function Th({ children, align }: { children: React.ReactNode; align?: "right" }): React.JSX.Element {
  return <th className={`px-3 py-2 ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>
}

export function Td({ children, align, mono }: { children: React.ReactNode; align?: "right"; mono?: boolean }): React.JSX.Element {
  return <td className={`px-3 py-2 text-[#0A0A0A] ${align === "right" ? "text-right" : ""} ${mono ? "tabular-nums" : ""}`}>{children}</td>
}
