"use client"

import { useState } from "react"
import type { Wallet } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UsdcIcon, FileDownloadIcon } from "@/icons"
import { AddFundsDialog } from "./AddFundsDialog"

interface Props {
  wallet: Wallet
  depositAddress: string | null
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

export function WalletBalanceCard({ wallet, depositAddress }: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const availableCents = wallet.balanceUsdcCents - wallet.reservedUsdcCents

  return (
    <>
      <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] bg-[#FFFFFF] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <UsdcIcon className="size-4" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Ad wallet · USDC · Sepolia testnet
            </span>
          </div>
          {depositAddress && (
            <Badge
              variant="outline"
              className="h-5 px-2 text-[10px] tabular-nums bg-white/60 border-[rgba(55,50,47,0.16)] text-[#37322F]"
              title={depositAddress}
            >
              {shortAddress(depositAddress)}
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <UsdcIcon className="size-7" />
                <div className="text-[36px] font-medium tracking-tight tabular-nums leading-none text-[#37322F]">
                  {formatUsdc(availableCents)}
                </div>
                <span className="text-[14px] text-muted-foreground tracking-tight self-end pb-1">
                  USDC
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Available for ad spend
                {wallet.reservedUsdcCents > 0 && (
                  <>
                    {" · "}
                    <span className="text-[#37322F]/75">
                      {formatUsdc(wallet.reservedUsdcCents)} reserved
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled
                className="h-8 text-xs border-[rgba(55,50,47,0.2)] bg-white"
              >
                <FileDownloadIcon className="size-3" />
                Withdraw
              </Button>
              <Button
                onClick={() => setOpen(true)}
                className="h-8 text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white"
              >
                Add funds
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-dashed border-[rgba(55,50,47,0.12)] pt-3 sm:grid-cols-4">
            <Stat label="Balance" value={formatUsdc(wallet.balanceUsdcCents)} />
            <Stat label="Reserved" value={formatUsdc(wallet.reservedUsdcCents)} />
            <Stat label="Total deposited" value={formatUsdc(wallet.totalDepositedUsdcCents)} />
            <Stat label="Total spent" value={formatUsdc(wallet.totalSpentUsdcCents)} />
          </div>
        </CardContent>
      </Card>

      <AddFundsDialog open={open} onOpenChange={setOpen} depositAddress={depositAddress} />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs font-medium text-[#37322F] tabular-nums">{value} USDC</div>
    </div>
  )
}
