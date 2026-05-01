"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CampaignStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { updateCampaign, deleteCampaign } from "@/services/campaigns"
import { PlayIcon, PauseIcon, TrashIcon, HourglassStartIcon } from "@/icons"
import { toast } from "sonner"

interface Props {
  id: string
  status: CampaignStatus
}

export function CampaignActions({ id, status }: Props): React.JSX.Element {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const setStatus = async (next: CampaignStatus): Promise<void> => {
    setBusy(true)
    try {
      await updateCampaign(id, { status: next })
      router.refresh()
      if (next === "ACTIVE") {
        toast.success("Campaign activated", { description: "Your campaign is now live and serving ads." })
      } else if (next === "PAUSED") {
        toast("Campaign paused", { description: "Your campaign has been paused and is no longer serving." })
      }
    } catch {
      toast.error("Something went wrong", { description: "Could not update the campaign. Please try again." })
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return
    setBusy(true)
    try {
      await deleteCampaign(id)
      toast("Campaign deleted", { description: "The campaign has been permanently removed." })
      router.push("/dashboard/campaigns")
      router.refresh()
    } catch {
      toast.error("Something went wrong", { description: "Could not delete the campaign. Please try again." })
      setBusy(false)
    }
  }

  const isActive = status === "ACTIVE"
  const isPaused = status === "PAUSED" || status === "DRAFT"

  return (
    <div className="flex items-center gap-1.5">
      {isPaused && (
        <Button size="sm" className="h-8 gap-1 text-xs rounded-full px-3.5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]" disabled={busy} onClick={() => setStatus("ACTIVE")}>
          {busy ? <HourglassStartIcon className="size-3" /> : <PlayIcon className="size-3" />}
          Activate
        </Button>
      )}
      {isActive && (
        <Button size="sm" variant="outline" className="h-8 gap-1 text-xs rounded-full px-3.5 bg-white border-[rgba(55,50,47,0.16)]" disabled={busy} onClick={() => setStatus("PAUSED")}>
          {busy ? <HourglassStartIcon className="size-3" /> : <PauseIcon className="size-3" />}
          Pause
        </Button>
      )}
      <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs rounded-full px-3 text-[#C2410C] hover:text-[#9A2E07] hover:bg-[#C2410C]/8" disabled={busy} onClick={handleDelete}>
        <TrashIcon className="size-3" />
        Delete
      </Button>
    </div>
  )
}
