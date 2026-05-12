import Link from "next/link"
import { centsToUsd, formatCompact } from "@/lib/money"
import { ChainBadge } from "@/components/ChainBadge"
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

const TH = "h-9 text-[10px] uppercase tracking-[0.14em] text-[#37322F]/55 font-medium"
const THR = `${TH} text-right`
const TD_NUM = "py-3 text-[12px] tabular-nums text-right text-[#37322F]/85"

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
        <TableRow className="h-9 hover:bg-transparent border-b border-[#37322F]/15">
          <TableHead className={TH}>CAMPAIGN</TableHead>
          <TableHead className={TH}>VERTICAL</TableHead>
          <TableHead className={TH}>CHAINS</TableHead>
          <TableHead className={TH}>STATUS</TableHead>
          <TableHead className={THR}>BUDGET</TableHead>
          <TableHead className={THR}>BID (CPM)</TableHead>
          <TableHead className={THR}>IMPR.</TableHead>
          <TableHead className={THR}>CLICKS</TableHead>
          <TableHead className={THR}>CTR</TableHead>
          <TableHead className={THR}>SPEND</TableHead>
          <TableHead className={THR}>CREATIVES</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((c) => (
          <TableRow
            key={c.id}
            className="border-b border-dashed border-[#37322F]/20 hover:bg-[#1f40cd]/4 transition-colors"
          >
            <TableCell className="py-3 text-[13px] font-medium">
              <Link
                href={`/dashboard/campaigns/${c.id}`}
                className="flex items-center gap-2 text-[#1f40cd] hover:underline underline-offset-4"
              >
                <StatusDot status={c.status} />
                <span className="truncate max-w-[220px]">{c.name}</span>
              </Link>
            </TableCell>
            <TableCell className="py-3">
              <span className="inline-flex h-5 items-center px-1.5 border border-[#37322F]/20 text-[10px] tracking-[0.14em] text-[#37322F]/75 uppercase">
                {c.vertical.replace("_", " ")}
              </span>
            </TableCell>
            <TableCell className="py-3 text-xs text-muted-foreground">
              {c.chains.length === 0 ? (
                <span className="text-[#37322F]/35">—</span>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {c.chains.slice(0, 3).map((ch) => (
                    <ChainBadge key={ch} chain={ch} size="sm" showName={false} />
                  ))}
                  {c.chains.length > 3 && (
                    <span className="text-[10px] text-[#1f40cd] self-center">+{c.chains.length - 3}</span>
                  )}
                </div>
              )}
            </TableCell>
            <TableCell className="py-3"><StatusBadge status={c.status} /></TableCell>
            <TableCell className={TD_NUM}>{centsToUsd(c.budgetUsdCents)}</TableCell>
            <TableCell className={TD_NUM}>{centsToUsd(c.bidUsdCents)}</TableCell>
            <TableCell className={TD_NUM}>
              {c.impressions > 0 ? formatCompact(c.impressions) : <span className="text-[#37322F]/35">—</span>}
            </TableCell>
            <TableCell className={TD_NUM}>
              {c.clicks > 0 ? formatCompact(c.clicks) : <span className="text-[#37322F]/35">—</span>}
            </TableCell>
            <TableCell className={TD_NUM}>{ctr(c.impressions, c.clicks)}</TableCell>
            <TableCell className={TD_NUM}>
              {c.spendUsdCents > 0 ? centsToUsd(c.spendUsdCents) : <span className="text-[#37322F]/35">—</span>}
            </TableCell>
            <TableCell className={TD_NUM}>{c.creativesCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      {rows.length > 1 && (
        <TableFooter className="bg-[#1f40cd]/4">
          <TableRow className="border-t border-[#37322F]/15 hover:bg-transparent">
            <TableCell className="py-3 text-[10px] uppercase tracking-[0.14em] text-[#1f40cd] font-medium" colSpan={4}>
              TOTAL · {rows.length} {rows.length === 1 ? "CAMPAIGN" : "CAMPAIGNS"}
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
