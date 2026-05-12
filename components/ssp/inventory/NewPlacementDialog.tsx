"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { AdFormat, Chain } from "@prisma/client"
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
import { TriangleWarningIcon } from "@/icons"
import { createPlacement } from "@/services/ssp"
import {
  AD_FORMAT_LABELS,
  ALL_CHAINS,
  ALL_FORMATS,
  CHAIN_LABELS,
  CreatePlacementSchema,
} from "./types"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPlacementDialog({ open, onOpenChange }: Props): React.JSX.Element {
  const router = useRouter()
  const [name, setName] = useState("")
  const [format, setFormat] = useState<AdFormat>("BANNER")
  const [chains, setChains] = useState<Chain[]>(["BASE"])
  const [width, setWidth] = useState<string>("970")
  const [height, setHeight] = useState<string>("250")
  const [floorUsd, setFloorUsd] = useState<string>("0.50")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const reset = (): void => {
    setName("")
    setFormat("BANNER")
    setChains(["BASE"])
    setWidth("970")
    setHeight("250")
    setFloorUsd("0.50")
    setError(null)
  }

  const handleClose = (next: boolean): void => {
    if (!next) reset()
    onOpenChange(next)
  }

  const toggleChain = (c: Chain): void => {
    setChains((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  const handleSubmit = async (): Promise<void> => {
    if (submitting) return
    setError(null)

    const requiresSize = format === "BANNER"
    const parsed = CreatePlacementSchema.safeParse({
      name: name.trim(),
      format,
      chains,
      width: requiresSize && width ? Number(width) : undefined,
      height: requiresSize && height ? Number(height) : undefined,
      floorPriceUsdcCents: Math.round(Number(floorUsd || "0") * 100),
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input")
      return
    }

    setSubmitting(true)
    try {
      await createPlacement(parsed.data)
      router.refresh()
      handleClose(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create placement")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="border-b border-[rgba(55,50,47,0.12)] px-5 py-3.5 bg-[#FFFFFF]">
          <DialogTitle className="text-[13px] font-medium tracking-tight text-[#37322F]">
            New placement
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Configure where ads will be served. You can change status later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Slot name
            </label>
            <Input
              placeholder="homepage_top_970x250"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Letters, numbers, hyphens or underscores only. Used in your ad-tag.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Format
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {ALL_FORMATS.map((f) => {
                const active = format === f
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`h-8 rounded-md border text-[11px] font-medium transition-colors ${
                      active
                        ? "bg-[#37322F] text-white border-[#37322F]"
                        : "bg-white text-[#37322F] border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.32)]"
                    }`}
                  >
                    {AD_FORMAT_LABELS[f]}
                  </button>
                )
              })}
            </div>
          </div>

          {format === "BANNER" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Width (px)
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="h-8 text-xs tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Height (px)
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-8 text-xs tabular-nums"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Chains
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {ALL_CHAINS.map((c) => {
                const active = chains.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleChain(c)}
                    className={`h-8 rounded-md border text-[11px] font-medium transition-colors ${
                      active
                        ? "bg-[#37322F] text-white border-[#37322F]"
                        : "bg-white text-[#37322F] border-[rgba(55,50,47,0.12)] hover:border-[rgba(55,50,47,0.32)]"
                    }`}
                  >
                    {CHAIN_LABELS[c]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Floor price (USDC per 1k impressions)
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={floorUsd}
                onChange={(e) => setFloorUsd(e.target.value)}
                className="h-8 pl-5 text-xs tabular-nums"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Bids below this floor will not be shown. Set 0 to accept any bid.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-[#B91C1C]/30 bg-[#FEF2F2] p-2 text-[11px] text-[#991B1B]">
              <TriangleWarningIcon className="size-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-[rgba(55,50,47,0.12)] px-5 py-3 bg-[#FFFFFF]">
          <Button variant="ghost" className="h-7 text-xs" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="h-7 text-xs bg-[#37322F] hover:bg-[#37322F]/90 text-white"
          >
            {submitting ? "Creating…" : "Create placement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
