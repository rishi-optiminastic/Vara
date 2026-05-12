"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { UsdcIcon, TriangleWarningIcon } from "@/icons"

interface WalletPayload {
  balanceUsdcCents: number
  reservedUsdcCents: number
}

interface Props {
  budgetUsd: string
  willActivate?: boolean
}

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function WalletAvailableHint({
  budgetUsd,
  willActivate = false,
}: Props): React.JSX.Element | null {
  const [wallet, setWallet] = useState<WalletPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const res = await fetch("/api/wallet", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { wallet: WalletPayload }
        if (!cancelled) setWallet(data.wallet)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading || !wallet) return null

  const availableCents = wallet.balanceUsdcCents - wallet.reservedUsdcCents
  const budgetCents = Math.round(parseFloat(budgetUsd || "0") * 100)
  const insufficient = willActivate && budgetCents > availableCents

  return (
    <div
      className={`mt-2 rounded-md border px-3 py-2 text-[11px] ${
        insufficient
          ? "border-[#C2410C]/25 bg-[#FFF3E8]"
          : "border-[rgba(55,50,47,0.12)] bg-[#FFFFFF]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] text-muted-foreground">
          <UsdcIcon className="size-3" />
          Wallet · available
        </span>
        <span className="font-medium tabular-nums text-[#37322F]">
          {formatUsdc(availableCents)} USDC
        </span>
      </div>
      {willActivate && budgetCents > 0 && (
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="uppercase tracking-widest text-[10px] text-muted-foreground">
            Will reserve on activate
          </span>
          <span
            className={`font-medium tabular-nums ${
              insufficient ? "text-[#9A3412]" : "text-[#37322F]/75"
            }`}
          >
            {formatUsdc(budgetCents)} USDC
          </span>
        </div>
      )}
      {insufficient && (
        <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-[#9A3412]">
          <span className="flex items-center gap-1.5">
            <TriangleWarningIcon className="size-3" />
            Top up your ad wallet to launch this campaign.
          </span>
          <Link
            href="/dashboard/settings?tab=wallet"
            className="underline underline-offset-2 hover:no-underline"
          >
            Add funds
          </Link>
        </div>
      )}
    </div>
  )
}
