"use client"

import { useState, useTransition } from "react"
import type { PlacementStatus } from "@prisma/client"
import { PlayIcon, PauseIcon, TrashIcon } from "@/icons"
import { Button } from "@/components/ui/button"

interface Props {
  placementId: string
  placementName: string
  status: PlacementStatus
  onStatus: (id: string, next: PlacementStatus) => Promise<void>
  onDelete: (id: string, name: string) => Promise<void>
}

// Small inline action group (play/pause + delete) for table rows. Kept out of
// PlacementsTable.tsx so the table stays under 250 lines.
export function PlacementToggle({
  placementId,
  placementName,
  status,
  onStatus,
  onDelete,
}: Props): React.JSX.Element {
  const [pending, startTransition] = useTransition()
  const [busy, setBusy] = useState(false)

  const handleToggle = (): void => {
    if (busy) return
    setBusy(true)
    const next: PlacementStatus = status === "LIVE" ? "PAUSED" : "LIVE"
    startTransition(async () => {
      await onStatus(placementId, next)
      setBusy(false)
    })
  }

  const handleDelete = (): void => {
    if (busy) return
    setBusy(true)
    startTransition(async () => {
      await onDelete(placementId, placementName)
      setBusy(false)
    })
  }

  const isLive = status === "LIVE"
  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-[#B45309]/10"
        onClick={handleToggle}
        disabled={pending || busy}
        title={isLive ? "Pause" : "Resume"}
      >
        {isLive ? (
          <PauseIcon className="size-3 text-[#0A0A0A]" />
        ) : (
          <PlayIcon className="size-3 text-[#0A0A0A]" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-[#FEE2E2] hover:text-[#B91C1C]"
        onClick={handleDelete}
        disabled={pending || busy}
        title="Delete"
      >
        <TrashIcon className="size-3" />
      </Button>
    </div>
  )
}
