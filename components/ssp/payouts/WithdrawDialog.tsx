"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { PublisherWallet, Chain } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  UsdcIcon,
  FileDownloadIcon,
  TriangleWarningIcon,
  CircleCheckIcon,
} from "@/icons"
import { CHAINS } from "@/lib/chains"
import { submitWithdrawal } from "@/services/sspPayouts"
import { WithdrawSchema } from "./types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  wallet: PublisherWallet
}

const NETWORK_FEE_USDC_CENTS = 50

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function WithdrawDialog({ open, onOpenChange, wallet }: Props): React.JSX.Element {
  const router = useRouter()
  const [amountUsdc, setAmountUsdc] = useState("")
  const [chain, setChain] = useState<Chain>(wallet.payoutChain)
  const [toAddress, setToAddress] = useState(wallet.payoutAddress ?? "")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const amountCents = Math.round(parseFloat(amountUsdc || "0") * 100)
  const exceedsBalance = amountCents > wallet.availableUsdcCents
  const netReceive = Math.max(0, amountCents - NETWORK_FEE_USDC_CENTS)
  const maxUsdc = (wallet.availableUsdcCents / 100).toFixed(2)

  const handleSubmit = async (): Promise<void> => {
    if (submitting) return
    setError(null)
    const parsed = WithdrawSchema.safeParse({
      amountUsdcCents: amountCents,
      chain,
      toAddress: toAddress.trim(),
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input")
      return
    }
    if (exceedsBalance) {
      setError("Amount exceeds available balance")
      return
    }
    setSubmitting(true)
    try {
      await submitWithdrawal(parsed.data)
      router.refresh()
      onOpenChange(false)
      setAmountUsdc("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-[rgba(55,50,47,0.12)] px-5 py-3.5 bg-[#FFFFFF]">
          <div className="flex items-center gap-1.5">
            <FileDownloadIcon className="size-4" />
            <DialogTitle className="text-[13px] font-medium tracking-tight text-[#37322F]">
              Withdraw to wallet
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Settles on-chain in USDC. Network fee {formatUsdc(NETWORK_FEE_USDC_CENTS)} USDC.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 p-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Amount (USDC)
              </label>
              <button
                type="button"
                onClick={() => setAmountUsdc(maxUsdc)}
                className="text-[10px] underline text-[#1E40AF] hover:no-underline"
              >
                Max {maxUsdc}
              </button>
            </div>
            <div className="relative">
              <UsdcIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <Input
                value={amountUsdc}
                onChange={e => setAmountUsdc(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
                className="h-9 pl-8 text-sm font-mono tabular-nums"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Settlement chain
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {CHAINS.slice(0, 8).map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChain(c.id)}
                  className={`rounded-md border px-2 py-1.5 text-[10px] font-medium transition-colors ${
                    chain === c.id
                      ? "border-[#37322F] bg-[#37322F] text-white"
                      : "border-[rgba(55,50,47,0.16)] bg-white text-[#37322F] hover:bg-[#FFFFFF]"
                  }`}
                  disabled={submitting}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Destination address
            </label>
            <Input
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
              placeholder="0x…"
              className="h-9 text-xs font-mono"
              disabled={submitting}
            />
          </div>

          {amountCents > 0 && !exceedsBalance && (
            <div className="rounded-md border border-dashed border-[rgba(55,50,47,0.16)] bg-[#FFFFFF] p-2.5 space-y-1 text-[11px]">
              <Row label="Amount" value={`${formatUsdc(amountCents)} USDC`} />
              <Row label="Network fee" value={`− ${formatUsdc(NETWORK_FEE_USDC_CENTS)} USDC`} />
              <div className="border-t border-[rgba(55,50,47,0.12)] pt-1 mt-1">
                <Row
                  label="You receive"
                  value={`${formatUsdc(netReceive)} USDC`}
                  emphasis
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-[#B91C1C]/30 bg-[#FEF2F2] p-2 text-[11px] text-[#991B1B]">
              <TriangleWarningIcon className="size-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-[rgba(55,50,47,0.12)] px-5 py-3 bg-[#FFFFFF] flex-row gap-2">
          <Badge
            variant="outline"
            className="h-5 px-2 text-[9px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)] text-muted-foreground"
          >
            On-chain settlement
          </Badge>
          <div className="ml-auto flex gap-2">
            <Button
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || amountCents <= 0 || exceedsBalance || !toAddress}
              className="h-7 text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white"
            >
              {submitting ? (
                "Submitting…"
              ) : (
                <>
                  <CircleCheckIcon className="size-3" />
                  Confirm withdrawal
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string
  value: string
  emphasis?: boolean
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${emphasis ? "font-medium text-[#37322F]" : "text-[#37322F]"}`}>
        {value}
      </span>
    </div>
  )
}
