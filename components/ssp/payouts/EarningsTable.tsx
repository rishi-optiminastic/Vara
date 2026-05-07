import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InsightsIcon } from "@/icons"
import type { EarningWithPlacement } from "@/lib/publisherWallet"
import { EARNING_STATUS_LABELS, EARNING_STATUS_TINT } from "./types"

interface Props {
  earnings: EarningWithPlacement[]
}

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function dateLabel(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function EarningsTable({ earnings }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-4 py-2.5 bg-[#FAFAF8]">
        <InsightsIcon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Daily earnings · last 25
        </h3>
      </div>
      {earnings.length === 0 ? (
        <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">
          No earnings yet. Earnings appear once your placements start serving impressions.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-[rgba(55,50,47,0.08)] text-left text-[9px] uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Placement</th>
                <th className="px-4 py-2 font-medium text-right">Impr.</th>
                <th className="px-4 py-2 font-medium text-right">Clicks</th>
                <th className="px-4 py-2 font-medium text-right">Gross</th>
                <th className="px-4 py-2 font-medium text-right">Fee</th>
                <th className="px-4 py-2 font-medium text-right">Net</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(55,50,47,0.06)]">
              {earnings.map(e => (
                <tr key={e.id} className="hover:bg-[#FAFAF8]/60">
                  <td className="px-4 py-2 text-[#37322F] tabular-nums">{dateLabel(e.date)}</td>
                  <td className="px-4 py-2 text-[#37322F] truncate max-w-[160px]">
                    <span className="font-mono">{e.placement?.name ?? "—"}</span>
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-[#37322F]">
                    {e.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-[#37322F]">
                    {e.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-[#37322F]">
                    {formatUsdc(e.grossUsdcCents)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
                    − {formatUsdc(e.feeUsdcCents)}
                  </td>
                  <td className="px-4 py-2 text-right tabular-nums font-medium text-[#15803D]">
                    + {formatUsdc(e.netUsdcCents)}
                  </td>
                  <td className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={`h-4 px-1.5 text-[9px] uppercase tracking-widest ${EARNING_STATUS_TINT[e.status]}`}
                    >
                      {EARNING_STATUS_LABELS[e.status]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
