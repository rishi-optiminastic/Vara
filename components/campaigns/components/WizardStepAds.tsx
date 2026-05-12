"use client"

import { CircleXmarkIcon, BoxPlusIcon, ImageSparkleIcon, CircleOpenArrowRight } from "@/icons"
import type { CreativeFormat } from "@prisma/client"
import type { WizardState, AdDraftForm } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FORMAT_DIMS, FORMAT_LABELS } from "@/lib/creatives"

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

interface PreviewProps {
  ad: AdDraftForm
}

function CreativePreview({ ad }: PreviewProps): React.JSX.Element {
  const { width, height } = FORMAT_DIMS[ad.format]
  const ratio = width / height
  const valid = isValidUrl(ad.assetUrl)
  const isVideo = ad.format === "VIDEO"

  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-widest">Preview</Label>
      <div
        className="relative w-full overflow-hidden rounded-md border border-[rgba(55,50,47,0.12)] bg-[#F0ECE6]"
        style={{ aspectRatio: ratio }}
      >
        {valid ? (
          isVideo ? (
            <video
              src={ad.assetUrl}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.assetUrl}
              alt={ad.name}
              className="absolute inset-0 h-full w-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
            />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground/70">
            <ImageSparkleIcon className="size-5" />
            <span className="text-[10px]">Asset preview</span>
          </div>
        )}
        {ad.walletConnectCta && valid && (
          <div className="absolute bottom-1.5 right-1.5 rounded-full bg-[#37322F] px-2 py-0.5 text-[9px] font-semibold text-white shadow-sm">
            Connect Wallet
          </div>
        )}
        <div className="absolute top-1.5 left-1.5 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider text-[#37322F] shadow-sm">
          {width}×{height}
        </div>
      </div>
      {valid && ad.clickUrl && isValidUrl(ad.clickUrl) && (
        <a
          href={ad.clickUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-[#37322F] truncate"
        >
          <CircleOpenArrowRight className="size-2.5 shrink-0" />
          <span className="truncate">{ad.clickUrl}</span>
        </a>
      )}
    </div>
  )
}

export interface AdHandlers {
  addAd: () => void
  removeAd: (id: string) => void
  updateAd: (id: string, patch: Partial<Omit<AdDraftForm, "id">>) => void
}

interface Props {
  state: WizardState
  handlers: AdHandlers
}

const FORMATS = Object.entries(FORMAT_LABELS) as [CreativeFormat, string][]

interface CardProps {
  ad: AdDraftForm
  onUpdate: (patch: Partial<Omit<AdDraftForm, "id">>) => void
  onRemove: () => void
}

function AdCard({ ad, onUpdate, onRemove }: CardProps): React.JSX.Element {
  return (
    <div className="relative rounded-xl border border-[rgba(55,50,47,0.12)] bg-[#FFFFFF] p-4">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove ad"
        className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[rgba(55,50,47,0.08)] text-muted-foreground hover:bg-[rgba(55,50,47,0.16)] transition-colors z-10"
      >
        <CircleXmarkIcon className="size-3" />
      </button>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
        <div className="grid grid-cols-2 gap-3 pr-6 self-start">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-widest">Ad name</Label>
            <Input value={ad.name} onChange={(e) => onUpdate({ name: e.target.value })} placeholder="Ad 1" className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-widest">Format</Label>
            <Select value={ad.format} onValueChange={(v) => onUpdate({ format: v as CreativeFormat })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {FORMATS.map(([val, lbl]) => (
                  <SelectItem key={val} value={val} className="text-xs">{lbl}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-[10px] uppercase tracking-widest">Click URL</Label>
            <Input
              type="url"
              value={ad.clickUrl}
              onChange={(e) => onUpdate({ clickUrl: e.target.value })}
              placeholder="https://your-project.io/mint"
              className="h-8 text-xs"
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-[10px] uppercase tracking-widest">Creative asset URL</Label>
            <Input
              type="url"
              value={ad.assetUrl}
              onChange={(e) => onUpdate({ assetUrl: e.target.value })}
              placeholder="https://cdn.your-project.io/banner.png"
              className="h-8 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">Direct link to your image or video file.</p>
          </div>
          <div className="col-span-2 flex items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={ad.walletConnectCta}
              onClick={() => onUpdate({ walletConnectCta: !ad.walletConnectCta })}
              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${ad.walletConnectCta ? "bg-[#37322F]" : "bg-[rgba(55,50,47,0.2)]"}`}
            >
              <span className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${ad.walletConnectCta ? "translate-x-3" : "translate-x-0"}`} />
            </button>
            <Label className="text-xs cursor-pointer">Include Wallet Connect CTA overlay</Label>
          </div>
        </div>
        <CreativePreview ad={ad} />
      </div>
    </div>
  )
}

export function WizardStepAds({ state, handlers }: Props): React.JSX.Element {
  const { addAd, removeAd, updateAd } = handlers
  const canAdd = state.ads.length < 3

  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex size-4 items-center justify-center rounded-md bg-[#FFE8F0] text-[#BE185D]">
              <ImageSparkleIcon className="size-2.5" />
            </span>
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Creatives · up to 3</h3>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!canAdd}
            onClick={addAd}
            className="h-7 gap-1 text-[11px] rounded-full px-3 border-[rgba(55,50,47,0.2)] shrink-0"
          >
            <BoxPlusIcon className="size-3" /> Add ad
          </Button>
        </div>

        {state.ads.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[rgba(55,50,47,0.18)] bg-white/50 py-6 text-center">
            <div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-[#F0ECE6]">
              <ImageSparkleIcon className="size-3.5 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-[#37322F]">No ads yet</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Add up to 3 — or skip and add later.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onUpdate={(patch) => updateAd(ad.id, patch)}
                onRemove={() => removeAd(ad.id)}
              />
            ))}
            {!canAdd && (
              <p className="text-[10px] text-muted-foreground text-center">Maximum of 3 ads per campaign reached.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
