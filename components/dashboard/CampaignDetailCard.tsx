import Link from "next/link"
import type { CampaignDetail } from "@/lib/campaignDetail"
import type { CampaignStatus } from "@prisma/client"
import { centsToUsd, formatCompact } from "@/lib/money"
import { CircleOpenArrowRight } from "@/icons"

const STATUS_STYLE: Record<CampaignStatus, { dot: string; label: string; text: string }> = {
  ACTIVE: { dot: "bg-emerald-500", label: "Active", text: "text-emerald-700" },
  PAUSED: { dot: "bg-amber-500", label: "Paused", text: "text-amber-700" },
  DRAFT: { dot: "bg-[#0A0A0A]/45", label: "Draft", text: "text-[#0A0A0A]/65" },
  ENDED: { dot: "bg-[#0A0A0A]/30", label: "Ended", text: "text-[#0A0A0A]/55" },
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function readable(v: string): string {
  return v.replace(/_/g, " ").toLowerCase()
}

interface Props {
  detail: CampaignDetail
}

export function CampaignDetailCard({ detail }: Props): React.JSX.Element {
  const sev = STATUS_STYLE[detail.status]
  const pctSpent =
    detail.budgetUsdCents > 0
      ? Math.min(100, (detail.spentUsdCents / detail.budgetUsdCents) * 100)
      : 0
  const ctr = detail.impressions > 0 ? ((detail.clicks / detail.impressions) * 100).toFixed(2) : null

  return (
    <div className="border border-dashed border-[rgba(10,10,10,0.18)] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-[rgba(10,10,10,0.12)] px-3 py-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#1F40CD]">
            Campaign focus
          </span>
          <span aria-hidden className="text-[#0A0A0A]/20">·</span>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest bg-[#0A0A0A]/[0.04] ${sev.text}`}>
              <span className={`size-[5px] rounded-full ${sev.dot}`} aria-hidden />
              {sev.label}
            </span>
            <h2 className="text-[14px] font-medium tracking-[-0.01em] text-[#0A0A0A] truncate">
              {detail.name}
            </h2>
          </div>
        </div>
        <Link
          href={`/dashboard/campaigns/${detail.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-[rgba(10,10,10,0.18)] bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A] hover:border-[#1F40CD] hover:text-[#1F40CD] transition-colors"
        >
          Open campaign <CircleOpenArrowRight className="size-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 divide-x divide-y-0 divide-[rgba(10,10,10,0.08)] max-lg:divide-y max-lg:divide-x-0 max-lg:[&>*:nth-child(2)]:border-l max-lg:[&>*:nth-child(2)]:border-[rgba(10,10,10,0.08)] max-lg:[&>*:nth-child(4)]:border-l max-lg:[&>*:nth-child(4)]:border-[rgba(10,10,10,0.08)]">
        <Cell label="Objective" value={readable(detail.objective)} sub={readable(detail.vertical)} />
        <Cell label="Bid" value={centsToUsd(detail.bidUsdCents)} sub={`${detail.pricingModel} · ${readable(detail.pacing)}`} />
        <BudgetCell
          spent={detail.spentUsdCents}
          total={detail.budgetUsdCents}
          pct={pctSpent}
          dailyCap={detail.dailyCapUsdCents}
        />
        <Cell
          label="Runs"
          value={fmtDate(detail.startDate)}
          sub={detail.endDate ? `→ ${fmtDate(detail.endDate)}` : "Open-ended"}
        />
        <Cell
          label="Delivery"
          value={`${formatCompact(detail.impressions)} impr`}
          sub={ctr ? `${formatCompact(detail.clicks)} clicks · ${ctr}% CTR` : `${detail.adGroupsCount} ad groups · ${detail.creativesCount} ads`}
        />
      </div>
    </div>
  )
}

interface CellProps {
  label: string
  value: string
  sub?: string
}

function Cell({ label, value, sub }: CellProps): React.JSX.Element {
  return (
    <div className="px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-[14px] font-medium tabular-nums tracking-[-0.01em] text-[#0A0A0A] truncate capitalize">{value}</div>
      {sub && <div className="mt-0.5 text-[10px] text-muted-foreground tabular-nums capitalize truncate">{sub}</div>}
    </div>
  )
}

interface BudgetProps {
  spent: number
  total: number
  pct: number
  dailyCap: number | null
}

function BudgetCell({ spent, total, pct, dailyCap }: BudgetProps): React.JSX.Element {
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Budget</span>
        <span className="text-[10px] font-semibold tabular-nums text-[#1F40CD]">{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-1 text-[14px] font-medium tabular-nums tracking-[-0.01em] text-[#0A0A0A]">
        {centsToUsd(spent)}{" "}
        <span className="text-[10px] font-normal text-muted-foreground">/ {centsToUsd(total)}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden bg-[rgba(10,10,10,0.06)]">
        <div className="h-full bg-[#1F40CD]" style={{ width: `${pct}%` }} />
      </div>
      {dailyCap && (
        <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">
          Daily cap {centsToUsd(dailyCap)}
        </div>
      )}
    </div>
  )
}
