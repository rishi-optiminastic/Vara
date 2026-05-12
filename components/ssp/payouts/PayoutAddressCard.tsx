"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Chain, PublisherWallet } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { WalletIcon, CircleCheckIcon, TriangleWarningIcon } from "@/icons"
import { CHAINS } from "@/lib/chains"
import { updatePayoutAddress } from "@/services/sspPayouts"
import { PayoutAddressSchema } from "./types"

interface Props {
  wallet: PublisherWallet
}

export function PayoutAddressCard({ wallet }: Props): React.JSX.Element {
  const router = useRouter()
  const [editing, setEditing] = useState(!wallet.payoutAddress)
  const [address, setAddress] = useState(wallet.payoutAddress ?? "")
  const [chain, setChain] = useState<Chain>(wallet.payoutChain)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSave = async (): Promise<void> => {
    setError(null)
    const parsed = PayoutAddressSchema.safeParse({
      payoutAddress: address.trim(),
      payoutChain: chain,
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid address")
      return
    }
    setSubmitting(true)
    try {
      await updatePayoutAddress(parsed.data)
      setSaved(true)
      setEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card
      id="payout-address"
      className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]"
    >
      <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] bg-[#FFFFFF] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <WalletIcon className="size-3.5" />
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Default payout address
          </span>
        </div>
        {wallet.payoutAddress && !editing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px] hover:bg-[#F0ECE6]"
            onClick={() => setEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        {editing ? (
          <>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Wallet address
              </label>
              <Input
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="0x…"
                className="h-8 text-xs font-mono"
                disabled={submitting}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Default settlement chain
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
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-[#B91C1C]/30 bg-[#FEF2F2] p-2 text-[11px] text-[#991B1B]">
                <TriangleWarningIcon className="size-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex justify-end gap-2">
              {wallet.payoutAddress && (
                <Button
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => {
                    setEditing(false)
                    setAddress(wallet.payoutAddress ?? "")
                    setChain(wallet.payoutChain)
                    setError(null)
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={submitting || !address.trim()}
                className="h-7 text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white"
              >
                {submitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-mono text-[12px] text-[#37322F] break-all">
                {wallet.payoutAddress}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Badge
                  variant="outline"
                  className="h-3.5 px-1 text-[9px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)]"
                >
                  {CHAINS.find(c => c.id === wallet.payoutChain)?.name ?? wallet.payoutChain}
                </Badge>
                {saved && (
                  <span className="flex items-center gap-1 text-[#15803D]">
                    <CircleCheckIcon className="size-2.5" /> saved
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
