import Link from "next/link"
import { centsToUsd, formatCompact } from "@/lib/money"
import { chainName } from "@/lib/chains"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "./StatusBadge"
import { StatusDot } from "./StatusDot"
import type { CampaignStatus, Vertical, Chain } from "@prisma/client"

export interface CampaignRow {
  id: string
  name: string
  status: CampaignStatus
  vertical: Vertical
  budgetUsdCents: number
  bidUsdCents: number
  chains: Chain[]
  creativesCount: number
  impressions: number
  clicks: number
  spendUsdCents: number
}

interface Props {
  rows: CampaignRow[]
}

function ctr(impressions: number, clicks: number): string {
  if (impressions <= 0) return "—"
  return `${((clicks / impressions) * 100).toFixed(2)}%`
}

const TH = "h-7 text-[10px] uppercase tracking-wider text-muted-foreground font-medium"
const THR = `${TH} text-right`
const TD_NUM = "py-2 text-xs tabular-nums text-right"

export function CampaignsTable({ rows }: Props): React.JSX.Element {
  const totals = rows.reduce(
    (acc, r) => {
      acc.impressions += r.impressions
      acc.clicks += r.clicks
      acc.spend += r.spendUsdCents
      acc.budget += r.budgetUsdCents
      return acc
    },
    { impressions: 0, clicks: 0, spend: 0, budget: 0 },
  )

  return (
    <Table>
      <TableHeader>
        <TableRow className="h-7 hover:bg-transparent border-b border-[rgba(55,50,47,0.12)]">
          <TableHead className={TH}>Campaign</TableHead>
          <TableHead className={TH}>Vertical</TableHead>
          <TableHead className={TH}>Chains</TableHead>
          <TableHead className={TH}>Status</TableHead>
          <TableHead className={THR}>Budget</TableHead>
          <TableHead className={THR}>Bid (CPM)</TableHead>
          <TableHead className={THR}>Impr.</TableHead>
          <TableHead className={THR}>Clicks</TableHead>
          <TableHead className={THR}>CTR</TableHead>
          <TableHead className={THR}>Spend</TableHead>
          <TableHead className={THR}>Creatives</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((c) => (
          <TableRow
            key={c.id}
            className="h-9 border-b border-[rgba(55,50,47,0.06)] hover:bg-[#FAF8F5] transition-colors"
          >
            <TableCell className="py-2 text-xs font-medium">
              <Link
                href={`/dashboard/campaigns/${c.id}`}
                className="flex items-center gap-2 text-[#37322F] hover:underline underline-offset-2"
              >
                <StatusDot status={c.status} />
                <span className="truncate max-w-[220px]">{c.name}</span>
              </Link>
            </TableCell>
            <TableCell className="py-2">
              <Badge
                variant="outline"
                className="h-4 px-1.5 text-[9px] uppercase tracking-wider bg-white/60 border-[rgba(55,50,47,0.16)] text-[#37322F]"
              >
                {c.vertical.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell className="py-2 text-xs text-muted-foreground">
              {c.chains.length === 0 ? (
                <span className="text-[rgba(55,50,47,0.35)]">—</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {c.chains.slice(0, 3).map((ch) => (
                    <span
                      key={ch}
                      className="rounded-full bg-[#F0ECE6] px-1.5 py-0.5 text-[9px] font-medium text-[#37322F]"
                    >
                      {chainName(ch)}
                    </span>
                  ))}
                  {c.chains.length > 3 && (
                    <span className="text-[9px] text-muted-foreground">+{c.chains.length - 3}</span>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell className="py-2"><StatusBadge status={c.status} /></TableCell>
            <TableCell className={TD_NUM}>{centsToUsd(c.budgetUsdCents)}</TableCell>
            <TableCell className={TD_NUM}>{centsToUsd(c.bidUsdCents)}</TableCell>
            <TableCell className={TD_NUM}>
              {c.impressions > 0 ? formatCompact(c.impressions) : <span className="text-[rgba(55,50,47,0.35)]">—</span>}
            </TableCell>
            <TableCell className={TD_NUM}>
              {c.clicks > 0 ? formatCompact(c.clicks) : <span className="text-[rgba(55,50,47,0.35)]">—</span>}
            </TableCell>
            <TableCell className={TD_NUM}>{ctr(c.impressions, c.clicks)}</TableCell>
            <TableCell className={TD_NUM}>
              {c.spendUsdCents > 0 ? centsToUsd(c.spendUsdCents) : <span className="text-[rgba(55,50,47,0.35)]">—</span>}
            </TableCell>
            <TableCell className={TD_NUM}>{c.creativesCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {rows.length > 1 && (
        <TableFooter className="bg-[#FAF8F5]">
          <TableRow className="border-t border-[rgba(55,50,47,0.12)] hover:bg-transparent">
            <TableCell className="py-2 text-[10px] uppercase tracking-widest text-muted-foreground" colSpan={4}>
              Total · {rows.length} {rows.length === 1 ? "campaign" : "campaigns"}
            </TableCell>
            <TableCell className={TD_NUM}>{centsToUsd(totals.budget)}</TableCell>
            <TableCell className={TD_NUM}>—</TableCell>
            <TableCell className={TD_NUM}>{totals.impressions > 0 ? formatCompact(totals.impressions) : "—"}</TableCell>
            <TableCell className={TD_NUM}>{totals.clicks > 0 ? formatCompact(totals.clicks) : "—"}</TableCell>
            <TableCell className={TD_NUM}>{ctr(totals.impressions, totals.clicks)}</TableCell>
            <TableCell className={TD_NUM}>{totals.spend > 0 ? centsToUsd(totals.spend) : "—"}</TableCell>
            <TableCell className={TD_NUM}>—</TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  )
}
