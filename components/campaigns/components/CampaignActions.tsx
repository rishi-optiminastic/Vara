"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CampaignStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { updateCampaign, deleteCampaign } from "@/services/campaigns"
import { Loader2, Play, Pause, Trash2 } from "lucide-react"

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
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return
    setBusy(true)
    try {
      await deleteCampaign(id)
      router.push("/dashboard/campaigns")
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  const isActive = status === "ACTIVE"
  const isPaused = status === "PAUSED" || status === "DRAFT"

  return (
    <div className="flex items-center gap-1.5">
      {isPaused && (
        <Button size="sm" className="h-8 gap-1 text-xs rounded-full px-3.5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[0_0_0_2.5px_rgba(255,255,255,0.08)_inset]" disabled={busy} onClick={() => setStatus("ACTIVE")}>
          {busy ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3" />}
          Activate
        </Button>
      )}
      {isActive && (
        <Button size="sm" variant="outline" className="h-8 gap-1 text-xs rounded-full px-3.5 bg-white border-[rgba(55,50,47,0.16)]" disabled={busy} onClick={() => setStatus("PAUSED")}>
          {busy ? <Loader2 className="size-3 animate-spin" /> : <Pause className="size-3" />}
          Pause
        </Button>
      )}
      <Button size="sm" variant="ghost" className="h-8 gap-1 text-xs rounded-full px-3 text-[#C2410C] hover:text-[#9A2E07] hover:bg-[#C2410C]/8" disabled={busy} onClick={handleDelete}>
        <Trash2 className="size-3" />
        Delete
      </Button>
    </div>
  )
}
