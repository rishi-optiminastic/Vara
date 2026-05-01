"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { deleteCreative } from "@/services/creatives"
import { TrashIcon, HourglassStartIcon } from "@/icons"
import { toast } from "sonner"

interface Props {
  id: string
}

export function AdActions({ id }: Props): React.JSX.Element {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const handleDelete = async (): Promise<void> => {
    if (!confirm("Delete this ad? This cannot be undone.")) return
    setBusy(true)
    try {
      await deleteCreative(id)
      toast("Ad deleted")
      router.push("/dashboard/ads")
      router.refresh()
    } catch {
      toast.error("Something went wrong", { description: "Could not delete the ad." })
      setBusy(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8 gap-1 text-xs rounded-full px-3 text-[#C2410C] hover:text-[#9A2E07] hover:bg-[#C2410C]/8"
      disabled={busy}
      onClick={handleDelete}
    >
      {busy ? <HourglassStartIcon className="size-3" /> : <TrashIcon className="size-3" />}
      Delete
    </Button>
  )
}
