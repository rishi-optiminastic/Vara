"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BoxPlusIcon } from "@/icons"

interface Props {
  amountUsdcCents?: number
}

// Dev-only button next to the wallet pill. Calls the demo top-up route and
// refreshes the dashboard so the new balance shows. Hidden in production at
// render time AND the route itself refuses to run there.
export function DemoTopUpButton({ amountUsdcCents = 100_000_00 }: Props): React.JSX.Element | null {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  if (process.env.NODE_ENV === "production") return null

  const dollarsLabel = `+$${(amountUsdcCents / 100).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`

  const handleClick = async (): Promise<void> => {
    if (busy) return
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch("/api/wallet/demo-topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ amountUsdcCents }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setErr(body?.error ?? "Top-up failed")
        return
      }
      router.refresh()
    } catch {
      setErr("Network error")
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      title={err ?? `Demo: add ${dollarsLabel} USDC to your wallet ledger`}
      className={`group inline-flex items-center gap-1 h-7 rounded-full border border-dashed px-2.5 text-[10.5px] font-medium tabular-nums transition-colors disabled:opacity-60 ${
        err
          ? "border-red-300 text-red-600 bg-red-50/60"
          : "border-[#1F40CD]/40 text-[#1F40CD] bg-[#1F40CD]/[0.04] hover:bg-[#1F40CD]/[0.08] hover:border-[#1F40CD]"
      }`}
    >
      <BoxPlusIcon className="size-3" />
      {busy ? "Adding…" : err ? "Retry" : `Demo ${dollarsLabel}`}
    </button>
  )
}
