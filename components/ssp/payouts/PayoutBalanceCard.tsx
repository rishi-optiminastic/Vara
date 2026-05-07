"use client"

import { useState } from "react"
import type { PublisherWallet } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UsdcIcon, FileDownloadIcon, WalletIcon } from "@/icons"
import { chainName } from "@/lib/chains"
import { WithdrawDialog } from "./WithdrawDialog"

interface Props {
  wallet: PublisherWallet
}

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function shortAddress(addr: string): string {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function PayoutBalanceCard({ wallet }: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const hasAddress = !!wallet.payoutAddress
  const canWithdraw = hasAddress && wallet.availableUsdcCents > 0

  return (
    <>
      <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] bg-[#FAFAF8] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <UsdcIcon className="size-4" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Publisher payout wallet · USDC · {chainName(wallet.payoutChain)} (
              {wallet.payoutNetwork === "MAINNET" ? "mainnet" : "testnet"})
            </span>
          </div>
          {wallet.payoutAddress ? (
            <Badge
              variant="outline"
              className="h-5 px-2 text-[10px] tabular-nums bg-white/60 border-[rgba(55,50,47,0.16)] text-[#37322F]"
              title={wallet.payoutAddress}
            >
              {shortAddress(wallet.payoutAddress)}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="h-5 px-2 text-[10px] uppercase tracking-widest bg-[#FFF3E8] border-[rgba(194,65,12,0.2)] text-[#C2410C]"
            >
              No address
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <UsdcIcon className="size-7" />
                <div className="text-[36px] font-medium tracking-tight tabular-nums leading-none text-[#37322F]">
                  {formatUsdc(wallet.availableUsdcCents)}
                </div>
                <span className="text-[14px] text-muted-foreground tracking-tight self-end pb-1">
                  USDC
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Available for withdrawal · {(wallet.revShareBps / 100).toFixed(0)}% revenue share
              </p>
            </div>
            <div className="flex gap-2">
              {!hasAddress && (
                <Button
                  asChild
                  variant="outline"
                  className="h-8 text-xs border-[rgba(55,50,47,0.2)] bg-white"
                >
                  <a href="#payout-address">
                    <WalletIcon className="size-3" />
                    Set payout address
                  </a>
                </Button>
              )}
              <Button
                onClick={() => setOpen(true)}
                disabled={!canWithdraw}
                className="h-8 text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDownloadIcon className="size-3" />
                Withdraw
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-dashed border-[rgba(55,50,47,0.12)] pt-3 sm:grid-cols-4">
            <Stat label="Pending (clearing)" value={formatUsdc(wallet.pendingUsdcCents)} />
            <Stat
              label="Lifetime earned"
              value={formatUsdc(wallet.lifetimeEarnedUsdcCents)}
            />
            <Stat
              label="Lifetime paid"
              value={formatUsdc(wallet.lifetimePaidUsdcCents)}
            />
            <Stat
              label="Platform fee"
              value={`${((10_000 - wallet.revShareBps) / 100).toFixed(0)}%`}
              suffix=""
            />
          </div>
        </CardContent>
      </Card>

      <WithdrawDialog open={open} onOpenChange={setOpen} wallet={wallet} />
    </>
  )
}

function Stat({
  label,
  value,
  suffix = "USDC",
}: {
  label: string
  value: string
  suffix?: string
}): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs font-medium text-[#37322F] tabular-nums">
        {value} {suffix}
      </div>
    </div>
  )
}
