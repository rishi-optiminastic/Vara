"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Placement, PlacementStatus } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeftIcon } from "@/icons"
import { ChainBadge } from "@/components/ChainBadge"
import { centsToUsd } from "@/lib/money"
import { AD_FORMAT_LABELS } from "@/components/ssp/inventory/types"
import { deletePlacement, updatePlacementStatus } from "@/services/ssp"
import { PlacementStatusBadge } from "./PlacementStatusBadge"
import { PlacementToggle } from "./PlacementToggle"

interface Props {
  rows: Placement[]
  hideFooter?: boolean
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

function sizeLabel(p: Placement): string {
  if (p.format !== "BANNER") return "—"
  if (!p.width || !p.height) return "—"
  return `${p.width}×${p.height}`
}

function floorLabel(cents: number): string {
  if (cents === 0) return "—"
  return centsToUsd(cents)
}

export function PlacementsTable({ rows, hideFooter }: Props): React.JSX.Element {
  const router = useRouter()
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

  const handleStatus = async (id: string, status: PlacementStatus): Promise<void> => {
    await updatePlacementStatus(id, status)
    router.refresh()
  }

  const handleDelete = async (id: string, name: string): Promise<void> => {
    if (!confirm(`Delete placement "${name}"? This can't be undone.`)) return
    await deletePlacement(id)
    router.refresh()
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
                aria-label="Select all placements"
              />
            </th>
            <th className={`${HEADER_CELL} w-12`}>Off/On</th>
            <th className={HEADER_CELL}><HeaderLabel label="Placement" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Format" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Size" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Chains" /></th>
            <th className={HEADER_CELL}><HeaderLabel label="Status" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Floor" align="right" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="Impr." align="right" /></th>
            <th className={`${HEADER_CELL} text-right`}><HeaderLabel label="eCPM" align="right" /></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isSelected = selected.has(row.id)
            return (
              <tr
                key={row.id}
                className={`transition-colors ${
                  isSelected ? "bg-[#B45309]/5" : "bg-white hover:bg-[#0A0A0A]/2.5"
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
                  <PlacementToggle
                    placementId={row.id}
                    placementName={row.name}
                    status={row.status}
                    onStatus={handleStatus}
                    onDelete={handleDelete}
                  />
                </td>
                <td className={`${BODY_CELL} min-w-44`}>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9.5px] font-semibold uppercase tracking-widest text-[#0A0A0A]/45">
                      {AD_FORMAT_LABELS[row.format]}
                    </span>
                    <span className="text-[12.5px] font-medium text-[#B45309] truncate mt-0.5 font-mono">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className={`${BODY_CELL} text-[#0A0A0A]/75`}>
                  {AD_FORMAT_LABELS[row.format]}
                </td>
                <td className={`${BODY_CELL} tabular-nums text-[#0A0A0A]/75`}>
                  {sizeLabel(row)}
                </td>
                <td className={BODY_CELL}>
                  {row.chains.length === 0 ? (
                    <span className="text-[11px] text-[#0A0A0A]/45">—</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <ChainBadge chain={row.chains[0]!} size="sm" />
                      {row.chains.length > 1 && (
                        <span className="text-[10px] font-medium text-[#0A0A0A]/55 tabular-nums">
                          +{row.chains.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className={BODY_CELL}>
                  <PlacementStatusBadge status={row.status} />
                </td>
                <td className={`${BODY_CELL} text-right tabular-nums`}>{floorLabel(row.floorPriceUsdcCents)}</td>
                <td className={`${BODY_CELL} text-right tabular-nums text-[#0A0A0A]/45`}>—</td>
                <td className={`${BODY_CELL} text-right tabular-nums text-[#0A0A0A]/45`}>—</td>
              </tr>
            )
          })}
        </tbody>
        {!hideFooter && rows.length > 0 && (
          <tfoot>
            <tr>
              <td className="px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#0A0A0A]/45" colSpan={10}>
                Excludes deleted items
                {selected.size > 0 && (
                  <span className="ml-2 text-[#B45309] normal-case tracking-normal">
                    · {selected.size} selected
                  </span>
                )}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
