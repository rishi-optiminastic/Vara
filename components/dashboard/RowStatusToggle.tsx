"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import type { CampaignStatus } from "@prisma/client"

interface Props {
  endpoint: string
  status: CampaignStatus
}

// Shared toggle for any list row that flips ACTIVE ↔ PAUSED via POST to a
// per-resource endpoint (e.g. /api/campaigns/:id/toggle-status,
// /api/ad-groups/:id/toggle-status). Optimistic UI + router.refresh on
// success; reverts the visible state on a non-2xx response. DRAFT / ENDED
// render disabled — those transitions need a deliberate flow.
export function RowStatusToggle({ endpoint, status }: Props): React.JSX.Element {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [pending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useState<CampaignStatus>(status)

  const toggleable = optimistic === "ACTIVE" || optimistic === "PAUSED"
  const checked = optimistic === "ACTIVE"

  const handleChange = async (next: boolean): Promise<void> => {
    if (!toggleable || busy) return
    const prev = optimistic
    const target: CampaignStatus = next ? "ACTIVE" : "PAUSED"
    setOptimistic(target)
    setBusy(true)
    try {
      const res = await fetch(endpoint, { method: "POST", credentials: "same-origin" })
      if (!res.ok) {
        setOptimistic(prev)
        return
      }
      startTransition(() => router.refresh())
    } catch {
      setOptimistic(prev)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleChange}
      disabled={!toggleable || busy || pending}
      aria-label={`Status: ${optimistic.toLowerCase()}`}
      className="data-[state=checked]:bg-[#1F40CD] data-[state=unchecked]:bg-[#0A0A0A]/15"
    />
  )
}
