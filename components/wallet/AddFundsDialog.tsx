"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  UsdcIcon,
  WalletIcon,
  BankIcon,
  CardIcon,
  OnChainIcon,
  CircleOpenArrowRight,
} from "@/icons"
import { FUNDING_METHODS, type FundingMethod, type FundingMethodId } from "./types"
import { CryptoDepositConnect } from "./CryptoDepositConnect"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  depositAddress: string | null
}

const ICONS_BY_ID: Record<FundingMethodId, React.ElementType> = {
  crypto: WalletIcon,
  bank: BankIcon,
  card: CardIcon,
  exchange: OnChainIcon,
}

const TINTS_BY_ID: Record<FundingMethodId, string> = {
  crypto: "bg-[#EAF1FF] text-[#1E40AF]",
  bank: "bg-[#E8F5E9] text-[#15803D]",
  card: "bg-[#FFF3E8] text-[#C2410C]",
  exchange: "bg-[#F3E8FF] text-[#6B21A8]",
}

export function AddFundsDialog({ open, onOpenChange, depositAddress }: Props): React.JSX.Element {
  const [selected, setSelected] = useState<FundingMethodId | null>(null)
  const router = useRouter()

  const handleClose = (next: boolean): void => {
    if (!next) setSelected(null)
    onOpenChange(next)
  }

  const method = selected ? FUNDING_METHODS.find((m) => m.id === selected) : null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-[rgba(55,50,47,0.12)] px-5 py-3.5 bg-[#FFFFFF]">
          <div className="flex items-center gap-1.5">
            <UsdcIcon className="size-4" />
            <DialogTitle className="text-[13px] font-medium tracking-tight text-[#37322F]">
              {method ? method.name : "Add funds to your ad wallet"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-[11px] text-muted-foreground">
            {method
              ? `${method.estimatedTime} · ${method.feeLabel}`
              : "Pick how you'd like to top up. All deposits arrive as USDC."}
          </DialogDescription>
        </DialogHeader>

        {!method && (
          <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
            {FUNDING_METHODS.map((m) => (
              <MethodTile key={m.id} method={m} onSelect={() => setSelected(m.id)} />
            ))}
          </div>
        )}

        {method?.id === "crypto" && (
          <CryptoDepositConnect
            depositAddress={depositAddress}
            onSuccess={() => {
              router.refresh()
              handleClose(false)
            }}
          />
        )}

        {method && method.id !== "crypto" && (
          <div className="px-5 py-6 text-center">
            <p className="text-[12px] text-muted-foreground leading-relaxed">{method.description}</p>
          </div>
        )}

        <DialogFooter className="border-t border-[rgba(55,50,47,0.12)] px-5 py-3 bg-[#FFFFFF]">
          {method ? (
            <Button variant="ghost" className="h-7 text-xs" onClick={() => setSelected(null)}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" className="h-7 text-xs" onClick={() => handleClose(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MethodTile({
  method,
  onSelect,
}: {
  method: FundingMethod
  onSelect: () => void
}): React.JSX.Element {
  const Icon = ICONS_BY_ID[method.id]
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col gap-2 rounded-md border border-[rgba(55,50,47,0.12)] bg-white px-3 py-2.5 text-left transition-colors hover:border-[rgba(55,50,47,0.32)] hover:bg-[#FFFFFF]"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-7 w-7 items-center justify-center rounded-md ${TINTS_BY_ID[method.id]}`}>
          <Icon className="size-3.5" />
        </div>
        <div className="flex items-center gap-1">
          {!method.enabled && (
            <Badge
              variant="outline"
              className="h-3.5 px-1 text-[9px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)] text-muted-foreground"
            >
              Soon
            </Badge>
          )}
          <CircleOpenArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
      <div className="text-[12px] font-medium text-[#37322F] leading-tight">{method.name}</div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <Badge
          variant="outline"
          className="h-3.5 px-1 text-[9px] uppercase tracking-widest bg-white/60 border-[rgba(55,50,47,0.16)]"
        >
          {method.estimatedTime}
        </Badge>
        <span className="truncate">{method.feeLabel}</span>
      </div>
    </button>
  )
}

