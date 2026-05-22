"use client"

import { useState } from "react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeftIcon } from "@/icons"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { AdPreview } from "@/components/ads/components/AdPreview"
import type { CampaignStatus, CreativeFormat } from "@prisma/client"

export interface AdRow {
  id: string
  name: string
  format: CreativeFormat
  width: number
  height: number
  assetUrl: string
  walletConnectCta: boolean
  campaignId: string
  campaignName: string
  campaignStatus: CampaignStatus
  createdAt: string
}

interface Props {
  rows: AdRow[]
  hideFooter?: boolean
}

function fmtDate(iso: string): string {
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

export function AdsTable({ rows, hideFooter }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const allSelected = rows.length > 0 && selected.size === rows.length
  const someSelected = selected.size > 0 && !allSelected

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
                aria-label="Select all ads"
              />
            </th>
            <th className={`${HEADER_CELL} w-20`}>Preview</th>
            <th className={HEADER_CELL}><HeaderLabel label="Ad" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Campaign" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Format" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Size" align="right" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Wallet CTA" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Campaign status" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Created" /></th>
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
                  <Link href={`/dashboard/ads/${row.id}`} className="block w-16 shrink-0 group/preview">
                    <div className="transition-transform group-hover/preview:scale-[1.02]">
                      <AdPreview
                        format={row.format}
                        assetUrl={row.assetUrl}
                        name={row.name}
                        walletConnectCta={row.walletConnectCta}
                        compact
                      />
                    </div>
                  </Link>
                </td>
                <td className={`${BODY_CELL} min-w-44`}>
                  <Link
                    href={`/dashboard/ads/${row.id}`}
                    className="flex flex-col min-w-0 group leading-tight"
                  >
                    <span className="text-[9.5px] font-semibold uppercase tracking-widest text-[#0A0A0A]/45">
                      {row.format}
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
                <td className={BODY_CELL}>
                  <span className="inline-flex h-5 items-center rounded-full bg-[#ECEAE2] px-2 text-[10px] font-medium text-[#1F40CD] capitalize">
                    {row.format.toLowerCase()}
                  </span>
                </td>
                <td className={`${BODY_CELL} text-right tabular-nums text-[#0A0A0A]/75`}>
                  {row.width}×{row.height}
                </td>
                <td className={BODY_CELL}>
                  {row.walletConnectCta ? (
                    <span className="inline-flex h-5 items-center rounded-full border border-[rgba(10,10,10,0.12)] bg-white px-2 text-[10px] font-medium text-[#1F40CD]">
                      On
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#0A0A0A]/45">—</span>
                  )}
                </td>
                <td className={BODY_CELL}>
                  <StatusBadge status={row.campaignStatus} />
                </td>
                <td className={`${BODY_CELL} text-[#0A0A0A]/75 tabular-nums`}>
                  {fmtDate(row.createdAt)}
                </td>
              </tr>
            )
          })}
        </tbody>
        {!hideFooter && rows.length > 0 && (
          <tfoot>
            <tr className="bg-white">
              <td className={BODY_CELL} colSpan={2} />
              <td className={`${BODY_CELL} text-[11px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55`} colSpan={7}>
                Results from {rows.length} {rows.length === 1 ? "ad" : "ads"}
                {selected.size > 0 && (
                  <span className="ml-2 text-[#1F40CD] normal-case tracking-normal">
                    · {selected.size} selected
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td className="px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#0A0A0A]/45" colSpan={9}>
                Excludes deleted items
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
