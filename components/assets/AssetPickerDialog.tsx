"use client"

import { useState } from "react"
import type { Asset } from "@prisma/client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AssetLibraryGrid } from "@/components/assets/AssetLibraryGrid"
import { AssetFileForm } from "@/components/assets/AssetFileForm"

interface Props {
  assetType: "IMAGE" | "VIDEO" | "LOGO"
  selectedId: string | null
  onPick: (asset: Asset) => void
  trigger: React.ReactNode
  title?: string
}

/// Dialog wrapper around the asset library grid + inline create form. The
/// FE composes ads by repeatedly opening this picker against different
/// asset roles (primary image, square image, logo, etc.).
export function AssetPickerDialog(props: Props): React.JSX.Element {
  const { assetType, selectedId, onPick, trigger, title } = props
  const [open, setOpen] = useState(false)
  // Tick local refresh whenever a new asset is created so the grid below
  // re-fetches. AssetLibraryGrid keys on `type`, so to force a refetch we
  // momentarily remount it. Cheap and avoids reaching for a global cache.
  const [tick, setTick] = useState(0)

  const handlePick = (a: Asset): void => {
    onPick(a)
    setOpen(false)
  }

  const handleCreated = (a: Asset): void => {
    setTick((n) => n + 1)
    handlePick(a)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg gap-3">
        <DialogHeader>
          <DialogTitle className="text-sm">
            {title ?? `Pick ${assetType.toLowerCase()}`}
          </DialogTitle>
        </DialogHeader>
        <div key={tick} className="max-h-[320px] overflow-y-auto pr-1">
          <AssetLibraryGrid type={assetType} selectedId={selectedId} onSelect={handlePick} />
        </div>
        <AssetFileForm assetType={assetType} onCreated={handleCreated} />
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="h-7 text-[11px]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
