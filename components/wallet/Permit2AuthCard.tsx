"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SignatureIcon, CircleCheckIcon, TriangleWarningIcon, CircleXmarkIcon } from "@/icons"
import { usePermit2Status, useRevokePermit2 } from "@/hooks/usePermit2Status"
import { authDaysRemaining, authIsExpiringSoon, AUTH_CEILING_USDC, AUTH_DURATION_DAYS, PERMIT2_CHAIN } from "@/lib/permit2"
import { Permit2SetupDialog } from "./Permit2SetupDialog"

function usdc(raw: string): string {
  return (Number(raw) / 1_000_000).toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })
}

function StatusBadge({ status, daysLeft }: { status: string; daysLeft: number | undefined }): React.JSX.Element {
  if (status === "ACTIVE" && daysLeft !== undefined && daysLeft <= 7) {
    return <Badge className="h-5 px-2 text-[9px] uppercase tracking-widest bg-amber-100 text-amber-800 border-amber-200">Expiring soon</Badge>
  }
  if (status === "ACTIVE") {
    return <Badge className="h-5 px-2 text-[9px] uppercase tracking-widest bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
  }
  if (status === "EXPIRED") {
    return <Badge className="h-5 px-2 text-[9px] uppercase tracking-widest bg-orange-100 text-orange-800 border-orange-200">Expired</Badge>
  }
  if (status === "REVOKED") {
    return <Badge className="h-5 px-2 text-[9px] uppercase tracking-widest bg-red-100 text-red-800 border-red-200">Revoked</Badge>
  }
  return <Badge variant="outline" className="h-5 px-2 text-[9px] uppercase tracking-widest">Not set</Badge>
}

function ActiveView({ expiresAt, authorizedAmount, amountPulled, onRenew, onRevoke, revoking }: {
  expiresAt: string; authorizedAmount: string; amountPulled: string
  onRenew: () => void; onRevoke: () => void; revoking: boolean
}): React.JSX.Element {
  const days = authDaysRemaining(new Date(expiresAt))
  const expiring = authIsExpiringSoon(new Date(expiresAt))
  const usedPct = Math.min(100, Math.round(Number(amountPulled) / Number(authorizedAmount) * 100))

  return (
    <div className="space-y-3">
      {expiring && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-[11px] text-amber-800">
          <TriangleWarningIcon className="size-3.5 shrink-0 mt-0.5" />
          <span>Authorization expires in {days} day{days !== 1 ? "s" : ""}. Renew to keep auto-recharge active.</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 text-[11px]">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Used</p>
          <p className="mt-0.5 font-medium tabular-nums text-[#37322F]">{usdc(amountPulled)} <span className="text-muted-foreground font-normal">/ {usdc(authorizedAmount)} USDC</span></p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Expires</p>
          <p className="mt-0.5 font-medium text-[#37322F]">{days > 0 ? `${days} days` : "Today"}</p>
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(55,50,47,0.08)]">
        <div className="h-full rounded-full bg-[#1F40CD] transition-all" style={{ width: `${usedPct}%` }} />
      </div>
      <div className="flex gap-2">
        <Button onClick={onRenew} size="sm"
          className="h-7 text-[11px] bg-[#1F40CD] hover:bg-[#1A36B0] text-white px-3">
          Renew authorization
        </Button>
        <Button onClick={onRevoke} disabled={revoking} variant="outline" size="sm"
          className="h-7 text-[11px] border-[rgba(55,50,47,0.2)] px-3">
          {revoking ? "Revoking…" : "Revoke"}
        </Button>
      </div>
    </div>
  )
}

function EmptyView({ onSetup }: { onSetup: () => void }): React.JSX.Element {
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Sign once to let Vara automatically top up your ad balance from your wallet when
        it runs low — up to <strong>{AUTH_CEILING_USDC.toString()} USDC</strong> over {AUTH_DURATION_DAYS} days.
        No upfront deposit required.
      </p>
      <div className="flex gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><CircleCheckIcon className="size-3 text-emerald-600" /> No custody risk</span>
        <span className="flex items-center gap-1"><CircleCheckIcon className="size-3 text-emerald-600" /> Low gas (Polygon)</span>
        <span className="flex items-center gap-1"><CircleCheckIcon className="size-3 text-emerald-600" /> Revoke anytime</span>
      </div>
      <Button onClick={onSetup}
        className="h-8 text-xs bg-[#1F40CD] hover:bg-[#1A36B0] text-white">
        Set up authorization
      </Button>
    </div>
  )
}

export function Permit2AuthCard(): React.JSX.Element {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data, isLoading } = usePermit2Status()
  const { revoke, isPending: revoking } = useRevokePermit2()

  const status = data?.status ?? "none"
  const daysLeft = data?.expiresAt ? authDaysRemaining(new Date(data.expiresAt)) : undefined
  const isActive = status === "ACTIVE"
  const needsSetup = status === "none" || status === "EXPIRED" || status === "REVOKED"

  return (
    <>
      <Card className="py-0 gap-0 overflow-hidden border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] bg-[#FFFFFF] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <SignatureIcon className="size-4" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Spending authorization · {PERMIT2_CHAIN.name}
            </span>
          </div>
          {!isLoading && <StatusBadge status={status} daysLeft={daysLeft} />}
        </div>

        <CardContent className="p-4">
          {isLoading ? (
            <div className="h-16 animate-pulse rounded-md bg-[rgba(55,50,47,0.05)]" />
          ) : isActive && data?.expiresAt && data.authorizedAmount && data.amountPulled ? (
            <ActiveView
              expiresAt={data.expiresAt}
              authorizedAmount={data.authorizedAmount}
              amountPulled={data.amountPulled}
              onRenew={() => setDialogOpen(true)}
              onRevoke={revoke}
              revoking={revoking}
            />
          ) : needsSetup ? (
            <EmptyView onSetup={() => setDialogOpen(true)} />
          ) : (
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <CircleXmarkIcon className="size-4" />
              <span>Authorization {status.toLowerCase()}.</span>
              <button onClick={() => setDialogOpen(true)} className="underline text-[#37322F]">Re-authorize</button>
            </div>
          )}
        </CardContent>
      </Card>

      <Permit2SetupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
