"use client"

import { useState } from "react"
import Link from "next/link"
import { centsToUsd, formatCompact } from "@/lib/money"
import { ChainBadge } from "@/components/ChainBadge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeftIcon } from "@/icons"
import { StatusBadge } from "./StatusBadge"
import { RowStatusToggle } from "@/components/dashboard/RowStatusToggle"
import type { CampaignStatus, Vertical, Chain, Objective, PricingModel, BidStrategy, Pacing } from "@prisma/client"

export interface CampaignRow {
  id: string
  name: string
  description: string | null
  status: CampaignStatus
  vertical: Vertical
  objective: Objective
  pricingModel: PricingModel
  bidStrategy: BidStrategy
  pacing: Pacing
  budgetUsdCents: number
  dailyCapUsdCents: number | null
  bidUsdCents: number | null
  startDate: string
  endDate: string | null
  chains: Chain[]
  creativesCount: number
  impressions: number
  clicks: number
  spendUsdCents: number
}

interface Props {
  rows: CampaignRow[]
  hideFooter?: boolean
}

function ctr(impressions: number, clicks: number): string {
  if (impressions <= 0) return "—"
  return `${((clicks / impressions) * 100).toFixed(2)}%`
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
}

const HEADER_CELL =
  "px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0A0A0A]/55 align-middle"
const BODY_CELL = "px-2.5 py-1.5 text-[12px] text-[#0A0A0A] align-middle"

function HeaderLabel({ label, align }: { label: string; align?: "right" }): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center gap-1 ${align === "right" ? "justify-end w-full" : ""}`}
    >
      {label}
      <ChevronLeftIcon className="size-3 -rotate-90 text-[#0A0A0A]/35" />
    </span>
  )
}

export function CampaignsTable({ rows, hideFooter }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const allSelected = rows.length > 0 && selected.size === rows.length
  const someSelected = selected.size > 0 && !allSelected

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

  const toggleOne = (id: string): void => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = (): void => {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-left"
        style={{ borderCollapse: "separate", borderSpacing: "0 2px" }}
      >
        <thead className="bg-white">
          <tr>
            <th className={`${HEADER_CELL} w-8`}>
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleAll}
                aria-label="Select all campaigns"
              />
            </th>
            <th className={`${HEADER_CELL} w-12`}>Off/On</th>
            <th className={HEADER_CELL}><HeaderLabel label="Campaign" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Status" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Chains" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Starts" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Ends" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Budget" align="right" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Spend" align="right" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Impr." align="right" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="CTR" align="right" /></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isSelected = selected.has(row.id)
            return (
              <tr
                key={row.id}
                className={`transition-colors ${
                  isSelected ? "bg-[#1F40CD]/5" : "bg-white hover:bg-[#0A0A0A]/2.5"
                }`}
              >
                <td className={BODY_CELL}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleOne(row.id)}
                    aria-label={`Select ${row.name}`}
                  />
                </td>
                <td className={BODY_CELL}>
                  <RowStatusToggle
                    endpoint={`/api/campaigns/${row.id}/toggle-status`}
                    status={row.status}
                  />
                </td>
                <td className={`${BODY_CELL} min-w-44`}>
                  <Link
                    href={`/dashboard/campaigns/${row.id}`}
                    className="flex flex-col min-w-0 group leading-tight"
                  >
                    <span className="text-[9.5px] font-semibold uppercase tracking-widest text-[#0A0A0A]/45">
                      {row.vertical.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <span className="text-[12.5px] font-medium text-[#1F40CD] group-hover:underline underline-offset-4 truncate mt-0.5">
                      {row.name}
                    </span>
                  </Link>
                </td>
                <td className={BODY_CELL}>
                  <StatusBadge status={row.status} />
                </td>
                <td className={BODY_CELL}>
                  {row.chains.length === 0 ? (
                    <span className="text-[11px] text-[#0A0A0A]/45">—</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <ChainBadge chain={row.chains[0] as Chain} size="sm" />
                      {row.chains.length > 1 && (
                        <span className="text-[10px] font-medium text-[#0A0A0A]/55 tabular-nums">
                          +{row.chains.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className={`${BODY_CELL} text-[#0A0A0A]/75 tabular-nums`}>{fmtDate(row.startDate)}</td>
                <td className={`${BODY_CELL} text-[#0A0A0A]/75 tabular-nums`}>{fmtDate(row.endDate)}</td>
                <td className={`${BODY_CELL} text-right tabular-nums`}>{centsToUsd(row.budgetUsdCents)}</td>
                <td className={`${BODY_CELL} text-right tabular-nums`}>
                  {row.spendUsdCents > 0 ? centsToUsd(row.spendUsdCents) : <span className="text-[#0A0A0A]/45">—</span>}
                </td>
                <td className={`${BODY_CELL} text-right tabular-nums`}>
                  {row.impressions > 0 ? formatCompact(row.impressions) : <span className="text-[#0A0A0A]/45">—</span>}
                </td>
                <td className={`${BODY_CELL} text-right tabular-nums`}>
                  {ctr(row.impressions, row.clicks)}
                </td>
              </tr>
            )
          })}
        </tbody>
        {!hideFooter && rows.length > 0 && (
          <tfoot>
            <tr className="bg-white">
              <td className={BODY_CELL} colSpan={2} />
              <td className={`${BODY_CELL} text-[11px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55`} colSpan={5}>
                Results from {rows.length} {rows.length === 1 ? "campaign" : "campaigns"}
                {selected.size > 0 && (
                  <span className="ml-2 text-[#1F40CD] normal-case tracking-normal">
                    · {selected.size} selected
                  </span>
                )}
              </td>
              <td className={`${BODY_CELL} text-right tabular-nums font-medium`}>{centsToUsd(totals.budget)}</td>
              <td className={`${BODY_CELL} text-right tabular-nums font-medium`}>
                {totals.spend > 0 ? centsToUsd(totals.spend) : "—"}
              </td>
              <td className={`${BODY_CELL} text-right tabular-nums font-medium`}>
                {totals.impressions > 0 ? formatCompact(totals.impressions) : "—"}
              </td>
              <td className={`${BODY_CELL} text-right tabular-nums font-medium`}>
                {ctr(totals.impressions, totals.clicks)}
              </td>
            </tr>
            <tr>
              <td className="px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#0A0A0A]/45" colSpan={11}>
                Excludes deleted items · Last 30 days
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
