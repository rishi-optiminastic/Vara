import Link from "next/link"
import type { PublisherStatement } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileCheckIcon, CircleOpenArrowRight } from "@/icons"
import { STATEMENT_STATUS_LABELS, STATEMENT_STATUS_TINT } from "./types"

interface Props {
  statements: PublisherStatement[]
}

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function rangeLabel(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  const sameYear = new Date(start).getUTCFullYear() === new Date(end).getUTCFullYear()
  const startStr = new Date(start).toLocaleDateString("en-US", opts)
  const endStr = new Date(end).toLocaleDateString("en-US", {
    ...opts,
    year: sameYear ? undefined : "numeric",
  })
  return `${startStr} – ${endStr}`
}

export function StatementsTable({ statements }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-4 py-2.5 bg-[#FAFAF8]">
        <FileCheckIcon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Statements
        </h3>
      </div>
      {statements.length === 0 ? (
        <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">
          No statements yet. Statements are generated monthly from cleared earnings.
        </div>
      ) : (
        <ul className="divide-y divide-[rgba(55,50,47,0.06)]">
          {statements.map(s => (
            <li key={s.id} className="group hover:bg-[#FAFAF8]/60 transition-colors">
              <Link
                href={`/ssp/dashboard/payouts/${s.id}`}
                className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] items-center gap-4 px-4 py-2.5"
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium text-[#37322F]">
                    {rangeLabel(s.periodStart, s.periodEnd)}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="tabular-nums">{s.impressions.toLocaleString()} impr.</span>
                    <span>·</span>
                    <span className="tabular-nums">{s.clicks.toLocaleString()} clicks</span>
                  </div>
                </div>
                <Cell label="Gross" value={formatUsdc(s.grossUsdcCents)} />
                <Cell label="Fee" value={`− ${formatUsdc(s.feeUsdcCents)}`} muted />
                <Cell label="Net" value={`+ ${formatUsdc(s.netUsdcCents)}`} positive />
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`h-4 px-1.5 text-[9px] uppercase tracking-widest ${STATEMENT_STATUS_TINT[s.status]}`}
                  >
                    {STATEMENT_STATUS_LABELS[s.status]}
                  </Badge>
                  <CircleOpenArrowRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function Cell({
  label,
  value,
  muted,
  positive,
}: {
  label: string
  value: string
  muted?: boolean
  positive?: boolean
}): React.JSX.Element {
  const color = positive ? "text-[#15803D]" : muted ? "text-muted-foreground" : "text-[#37322F]"
  return (
    <div className="hidden md:flex flex-col items-end leading-none">
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground/80">{label}</span>
      <span className={`mt-1 text-[11px] font-medium tabular-nums ${color}`}>{value}</span>
    </div>
  )
}
