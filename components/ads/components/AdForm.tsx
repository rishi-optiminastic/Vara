"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Campaign } from "@prisma/client"
import type { CreativeFormat } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createCreative } from "@/services/creatives"
import { AdPreview } from "./AdPreview"
import { FORMAT_LABELS } from "@/lib/creatives"
import { HourglassStartIcon, SquareWandSparkleIcon } from "@/icons"
import { toast } from "sonner"

interface Props {
  campaigns: Pick<Campaign, "id" | "name">[]
  defaultCampaignId?: string
}

const FORMATS = Object.entries(FORMAT_LABELS) as [CreativeFormat, string][]

interface FormState {
  campaignId: string
  name: string
  format: CreativeFormat
  assetUrl: string
  clickUrl: string
  walletConnectCta: boolean
}

export function AdForm({ campaigns, defaultCampaignId = "" }: Props): React.JSX.Element {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<FormState>({
    campaignId: defaultCampaignId,
    name: "",
    format: "BANNER",
    assetUrl: "",
    clickUrl: "",
    walletConnectCta: false,
  })

  const update = (patch: Partial<FormState>): void => setState((s) => ({ ...s, ...patch }))

  const submit = async (): Promise<void> => {
    setError(null)
    if (!state.campaignId) { setError("Select a campaign"); return }
    if (!state.name.trim()) { setError("Ad name is required"); return }
    if (!state.assetUrl) { setError("Asset URL is required"); return }
    if (!state.clickUrl) { setError("Click URL is required"); return }
    setLoading(true)
    try {
      await createCreative({
        campaignId: state.campaignId,
        name: state.name,
        format: state.format,
        assetUrl: state.assetUrl,
        clickUrl: state.clickUrl,
        walletConnectCta: state.walletConnectCta,
      })
      toast.success("Ad created", { description: "Your ad is ready to serve." })
      router.push("/dashboard/ads")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ad")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] uppercase tracking-widest">Campaign</Label>
              <Select value={state.campaignId} onValueChange={(v) => update({ campaignId: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select campaign…" /></SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest">Ad name</Label>
              <Input value={state.name} onChange={(e) => update({ name: e.target.value })} placeholder="Hero banner" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] uppercase tracking-widest">Format</Label>
              <Select value={state.format} onValueChange={(v) => update({ format: v as CreativeFormat })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMATS.map(([val, lbl]) => (
                    <SelectItem key={val} value={val} className="text-xs">{lbl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] uppercase tracking-widest">Creative asset URL</Label>
              <Input type="url" value={state.assetUrl} onChange={(e) => update({ assetUrl: e.target.value })} placeholder="https://cdn.example.io/banner.png" className="h-8 text-xs" />
              <p className="text-[10px] text-muted-foreground">Direct link to image or video file.</p>
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-[10px] uppercase tracking-widest">Click URL</Label>
              <Input type="url" value={state.clickUrl} onChange={(e) => update({ clickUrl: e.target.value })} placeholder="https://your-project.io" className="h-8 text-xs" />
            </div>
            <div className="col-span-2 flex items-center gap-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={state.walletConnectCta}
                onClick={() => update({ walletConnectCta: !state.walletConnectCta })}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${state.walletConnectCta ? "bg-[#37322F]" : "bg-[rgba(55,50,47,0.2)]"}`}
              >
                <span className={`pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${state.walletConnectCta ? "translate-x-3" : "translate-x-0"}`} />
              </button>
              <Label className="text-xs cursor-pointer">Include Wallet Connect CTA overlay</Label>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest">Preview</Label>
            <AdPreview format={state.format} assetUrl={state.assetUrl} name={state.name} walletConnectCta={state.walletConnectCta} />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
      )}

      <div className="flex items-center justify-between border-t border-[rgba(55,50,47,0.08)] pt-2.5">
        <Button type="button" variant="ghost" size="sm" className="h-8 text-xs rounded-full px-4" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button size="sm" disabled={loading} className="h-8 gap-1.5 text-xs rounded-full px-5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]" onClick={submit}>
          {loading ? <HourglassStartIcon className="size-3" /> : <SquareWandSparkleIcon className="size-3" />}
          Save ad
        </Button>
      </div>
    </div>
  )
}
