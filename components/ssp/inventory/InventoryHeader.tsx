"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BoxPlusIcon } from "@/icons"
import { NewPlacementDialog } from "./NewPlacementDialog"

export function InventoryHeader(): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520]"
      >
        <BoxPlusIcon className="size-3" />
        New placement
      </Button>
      <NewPlacementDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
