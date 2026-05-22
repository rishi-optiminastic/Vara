"use client"

import { useState } from "react"
import Link from "next/link"
import { centsToUsd } from "@/lib/money"
import { ChainBadge } from "@/components/ChainBadge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeftIcon } from "@/icons"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { RowStatusToggle } from "@/components/dashboard/RowStatusToggle"
import type { CampaignStatus, Chain, PricingModel, BidStrategy } from "@prisma/client"

export interface AdGroupRow {
  id: string
  name: string
  status: CampaignStatus
  campaignId: string
  campaignName: string
  pricingModel: PricingModel
  bidStrategy: BidStrategy
  bidUsdCents: number
  dailyCapUsdCents: number | null
  startDate: string | null
  endDate: string | null
  chains: Chain[]
}

interface Props {
  rows: AdGroupRow[]
  hideFooter?: boolean
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
    <span className={`inline-flex items-center gap-1 ${align === "right" ? "justify-end w-full" : ""}`}>
      {label}
      <ChevronLeftIcon className="size-3 -rotate-90 text-[#0A0A0A]/35" />
    </span>
  )
}

export function AdGroupsTable({ rows, hideFooter }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const allSelected = rows.length > 0 && selected.size === rows.length
  const someSelected = selected.size > 0 && !allSelected

  const totals = rows.reduce(
    (acc, r) => {
      acc.bid += r.bidUsdCents
      return acc
    },
    { bid: 0 },
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
                aria-label="Select all ad groups"
              />
            </th>
            <th className={`${HEADER_CELL} w-12`}>Off/On</th>
            <th className={HEADER_CELL}><HeaderLabel label="Ad group" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Campaign" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Status" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Chains" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Bid" align="right" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Daily cap" align="right" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Starts" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Ends" /></th>
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
                    endpoint={`/api/ad-groups/${row.id}/toggle-status`}
                    status={row.status}
                  />
                </td>
                <td className={`${BODY_CELL} min-w-44`}>
                  <Link
                    href={`/dashboard/ad-groups/${row.id}`}
                    className="flex flex-col min-w-0 group leading-tight"
                  >
                    <span className="text-[9.5px] font-semibold uppercase tracking-widest text-[#0A0A0A]/45">
                      {row.pricingModel}
                    </span>
                    <span className="text-[12.5px] font-medium text-[#1F40CD] group-hover:underline underline-offset-4 truncate mt-0.5">
                      {row.name}
                    </span>
                  </Link>
                </td>
                <td className={BODY_CELL}>
                  <Link
                    href={`/dashboard/campaigns/${row.campaignId}`}
                    className="text-[11.5px] text-[#0A0A0A]/75 hover:text-[#1F40CD] hover:underline underline-offset-4 truncate"
                  >
                    {row.campaignName}
                  </Link>
                </td>
                <td className={BODY_CELL}><StatusBadge status={row.status} /></td>
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
                <td className={`${BODY_CELL} text-right tabular-nums`}>{centsToUsd(row.bidUsdCents)}</td>
                <td className={`${BODY_CELL} text-right tabular-nums`}>
                  {row.dailyCapUsdCents ? centsToUsd(row.dailyCapUsdCents) : <span className="text-[#0A0A0A]/45">—</span>}
                </td>
                <td className={`${BODY_CELL} text-[#0A0A0A]/75 tabular-nums`}>{fmtDate(row.startDate)}</td>
                <td className={`${BODY_CELL} text-[#0A0A0A]/75 tabular-nums`}>{fmtDate(row.endDate)}</td>
              </tr>
            )
          })}
        </tbody>
        {!hideFooter && rows.length > 0 && (
          <tfoot>
            <tr className="bg-white">
              <td className={BODY_CELL} colSpan={2} />
              <td className={`${BODY_CELL} text-[11px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55`} colSpan={4}>
                Results from {rows.length} {rows.length === 1 ? "ad group" : "ad groups"}
                {selected.size > 0 && (
                  <span className="ml-2 text-[#1F40CD] normal-case tracking-normal">
                    · {selected.size} selected
                  </span>
                )}
              </td>
              <td className={`${BODY_CELL} text-right tabular-nums font-medium`}>{centsToUsd(totals.bid)}</td>
              <td className={BODY_CELL} colSpan={3} />
            </tr>
            <tr>
              <td className="px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#0A0A0A]/45" colSpan={10}>
                Excludes deleted items
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
