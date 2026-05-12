"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Placement, PlacementStatus } from "@prisma/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AssetsIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
} from "@/icons"
import { deletePlacement, updatePlacementStatus } from "@/services/ssp"
import { AD_FORMAT_LABELS, CHAIN_LABELS } from "./types"

interface Props {
  placements: Placement[]
}

const STATUS_TINT: Record<PlacementStatus, string> = {
  LIVE: "bg-[#E8F5E9] text-[#15803D] border-[#15803D]/20",
  PAUSED: "bg-[#FFF3E8] text-[#C2410C] border-[#C2410C]/20",
  DRAFT: "bg-[#F0ECE6] text-muted-foreground border-[rgba(55,50,47,0.12)]",
}

function formatFloor(cents: number): string {
  if (cents === 0) return "—"
  return `$${(cents / 100).toFixed(2)}`
}

function sizeLabel(p: Placement): string | null {
  if (p.format !== "BANNER") return null
  if (!p.width || !p.height) return null
  return `${p.width}×${p.height}`
}

export function InventoryTable({ placements }: Props): React.JSX.Element {
  if (placements.length === 0) {
    return <EmptyState />
  }

  return (
    <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-4 py-2.5 bg-[#FFFFFF]">
        <AssetsIcon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Placements
        </h3>
        <Badge
          variant="outline"
          className="ml-1 h-4 px-1.5 text-[9px] tabular-nums bg-white/60 border-[rgba(55,50,47,0.16)]"
        >
          {placements.length}
        </Badge>
      </div>
      <ul className="divide-y divide-[rgba(55,50,47,0.08)]">
        {placements.map((p) => (
          <PlacementRow key={p.id} placement={p} />
        ))}
      </ul>
    </Card>
  )
}

function PlacementRow({ placement }: { placement: Placement }): React.JSX.Element {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const size = sizeLabel(placement)

  const toggleStatus = async (): Promise<void> => {
    setError(null)
    const next: PlacementStatus = placement.status === "LIVE" ? "PAUSED" : "LIVE"
    try {
      await updatePlacementStatus(placement.id, next)
      startTransition(() => router.refresh())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!confirm(`Delete placement "${placement.name}"? This can't be undone.`)) return
    setError(null)
    try {
      await deletePlacement(placement.id)
      startTransition(() => router.refresh())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  return (
    <li className="px-4 py-2.5 hover:bg-[#F7F5F3]/60 transition-colors">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12px] font-mono font-medium text-[#37322F] truncate">
              {placement.name}
            </span>
            <Badge
              variant="outline"
              className={`h-4 px-1.5 text-[9px] uppercase tracking-widest font-medium shrink-0 ${STATUS_TINT[placement.status]}`}
            >
              {placement.status}
            </Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="text-[#37322F]/60">{AD_FORMAT_LABELS[placement.format]}</span>
            {size && (
              <>
                <span>·</span>
                <span className="font-mono">{size}</span>
              </>
            )}
            <span>·</span>
            <span>floor {formatFloor(placement.floorPriceUsdcCents)}</span>
            <span>·</span>
            <div className="flex flex-wrap gap-1">
              {placement.chains.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-[#F0ECE6] px-1.5 py-0.5 text-[9px] font-medium text-[#37322F]"
                >
                  {CHAIN_LABELS[c]}
                </span>
              ))}
            </div>
          </div>
          {error && <p className="mt-1 text-[10px] text-[#B91C1C]">{error}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#F0ECE6]"
            onClick={toggleStatus}
            disabled={pending}
            title={placement.status === "LIVE" ? "Pause" : "Resume"}
          >
            {placement.status === "LIVE" ? (
              <PauseIcon className="size-3.5 text-[#37322F]" />
            ) : (
              <PlayIcon className="size-3.5 text-[#37322F]" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-[#FEE2E2] hover:text-[#B91C1C]"
            onClick={handleDelete}
            disabled={pending}
            title="Delete"
          >
            <TrashIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </li>
  )
}

function EmptyState(): React.JSX.Element {
  return (
    <Card className="border-dashed border-[rgba(55,50,47,0.18)] bg-white/50">
      <div className="px-6 py-10 text-center">
        <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-full bg-[#F0ECE6]">
          <AssetsIcon className="size-4 text-muted-foreground" />
        </div>
        <p className="text-xs font-medium text-[#37322F]">No placements yet</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Create your first placement to start serving ads on your inventory.
        </p>
      </div>
    </Card>
  )
}
