"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type {
  BidStrategy,
  Campaign,
  CampaignStatus,
  Pacing,
  PricingModel,
  Vertical,
} from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TextField, SelectField, SegmentedField, DatePickerField } from "./form-fields"
import { updateCampaign } from "@/services/campaigns"
import { centsToUsd } from "@/lib/money"
import { HourglassStartIcon, CircleCheckIcon } from "@/icons"

const VERTICALS: { value: Vertical; label: string }[] = [
  { value: "TOKEN_LAUNCH", label: "Token launch" },
  { value: "NFT_DROP", label: "NFT drop" },
  { value: "DEFI", label: "DeFi" },
  { value: "DAPP_GROWTH", label: "Dapp growth" },
  { value: "OTHER", label: "Other" },
]

const PRICING_MODELS: { value: PricingModel; label: string; desc: string }[] = [
  { value: "CPM", label: "CPM", desc: "Pay per 1,000 impressions" },
  { value: "CPC", label: "CPC", desc: "Pay per click" },
  { value: "CPA", label: "CPA", desc: "Pay per on-chain conversion" },
]

const BID_STRATEGIES: { value: BidStrategy; label: string; desc: string }[] = [
  { value: "MANUAL", label: "Manual", desc: "Fixed bid you control" },
  { value: "AUTO", label: "Auto", desc: "Engine adjusts within budget" },
  { value: "MAX_CONVERSIONS", label: "Max conversions", desc: "Spend for max conversions" },
  { value: "TARGET_CPA", label: "Target CPA", desc: "Hit a target cost-per-action" },
]

const PACINGS: { value: Pacing; label: string; desc: string }[] = [
  { value: "STANDARD", label: "Standard", desc: "Smooth spend across the day" },
  { value: "EVEN", label: "Even", desc: "Strictly equal hourly spend" },
  { value: "ACCELERATED", label: "Accelerated", desc: "Spend ASAP" },
]

interface FormState {
  name: string
  description: string
  vertical: Vertical
  status: CampaignStatus
  pricingModel: PricingModel
  bidStrategy: BidStrategy
  pacing: Pacing
  budgetUsd: string
  dailyCapUsd: string
  bidUsd: string
  frequencyCapPerWallet: string
  frequencyCapHours: string
  startDate: string
  endDate: string
  brandSafetyKeywords: string
}

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function fromCampaign(c: Campaign): FormState {
  return {
    name: c.name,
    description: c.description ?? "",
    vertical: c.vertical,
    status: c.status,
    pricingModel: c.pricingModel,
    bidStrategy: c.bidStrategy,
    pacing: c.pacing,
    budgetUsd: (c.budgetUsdCents / 100).toFixed(2),
    dailyCapUsd: c.dailyCapUsdCents != null ? (c.dailyCapUsdCents / 100).toFixed(2) : "",
    bidUsd: (c.bidUsdCents / 100).toFixed(2),
    frequencyCapPerWallet: c.frequencyCapPerWallet?.toString() ?? "",
    frequencyCapHours: c.frequencyCapHours?.toString() ?? "",
    startDate: toIso(c.startDate),
    endDate: c.endDate ? toIso(c.endDate) : "",
    brandSafetyKeywords: c.brandSafetyKeywords.join(", "),
  }
}

interface Props {
  campaign: Campaign
  reservedUsdcCents: number
}

export function CampaignEditForm({ campaign, reservedUsdcCents }: Props): React.JSX.Element {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => fromCampaign(campaign))
  const [saving, setSaving] = useState(false)

  const patch = (p: Partial<FormState>): void => setForm((s) => ({ ...s, ...p }))

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setSaving(true)
    try {
      const keywords = form.brandSafetyKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
      await updateCampaign(campaign.id, {
        name: form.name,
        description: form.description || undefined,
        vertical: form.vertical,
        status: form.status,
        pricingModel: form.pricingModel,
        bidStrategy: form.bidStrategy,
        pacing: form.pacing,
        budgetUsd: parseFloat(form.budgetUsd),
        dailyCapUsd: form.dailyCapUsd ? parseFloat(form.dailyCapUsd) : undefined,
        bidUsd: parseFloat(form.bidUsd),
        frequencyCapPerWallet: form.frequencyCapPerWallet
          ? parseInt(form.frequencyCapPerWallet, 10)
          : undefined,
        frequencyCapHours: form.frequencyCapHours
          ? parseInt(form.frequencyCapHours, 10)
          : undefined,
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        brandSafetyKeywords: keywords,
      })
      toast.success("Campaign updated", { description: "Your changes have been saved." })
      router.push(`/dashboard/campaigns/${campaign.id}`)
      router.refresh()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save changes"
      toast.error("Save failed", { description: msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardContent className="p-4 space-y-3">
          <Section title="Basics">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label="Campaign name"
                value={form.name}
                onChange={(v) => patch({ name: v })}
                required
              />
              <SelectField
                label="Vertical"
                value={form.vertical}
                onChange={(v) => patch({ vertical: v as Vertical })}
                options={VERTICALS}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Description
                </label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  className="text-xs"
                  placeholder="Optional context for your team"
                />
              </div>
            </div>
          </Section>

          <Section title="Budget & bidding">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Total budget"
                value={form.budgetUsd}
                onChange={(v) => patch({ budgetUsd: v })}
                type="number"
                min={10}
                step="0.01"
                prefix="$"
                required
                hint={`Currently reserved: ${centsToUsd(reservedUsdcCents)}`}
              />
              <TextField
                label="Daily cap"
                value={form.dailyCapUsd}
                onChange={(v) => patch({ dailyCapUsd: v })}
                type="number"
                min={1}
                step="0.01"
                prefix="$"
                placeholder="Optional"
              />
              <TextField
                label="Bid"
                value={form.bidUsd}
                onChange={(v) => patch({ bidUsd: v })}
                type="number"
                min={0.1}
                step="0.01"
                prefix="$"
                suffix={form.pricingModel}
                required
              />
              <SegmentedField
                label="Pricing model"
                value={form.pricingModel}
                onChange={(v) => patch({ pricingModel: v as PricingModel })}
                options={PRICING_MODELS}
                span={2}
              />
              <SegmentedField
                label="Bid strategy"
                value={form.bidStrategy}
                onChange={(v) => patch({ bidStrategy: v as BidStrategy })}
                options={BID_STRATEGIES}
                span={2}
                columns={4}
              />
              <SegmentedField
                label="Pacing"
                value={form.pacing}
                onChange={(v) => patch({ pacing: v as Pacing })}
                options={PACINGS}
                span={2}
              />
            </div>
          </Section>

          <Section title="Schedule & frequency">
            <div className="grid grid-cols-2 gap-3">
              <DatePickerField
                label="Start date"
                value={form.startDate}
                onChange={(v) => patch({ startDate: v })}
              />
              <DatePickerField
                label="End date"
                value={form.endDate}
                onChange={(v) => patch({ endDate: v })}
                placeholder="Open-ended"
                hint="Leave blank to run indefinitely"
              />
              <TextField
                label="Frequency cap (per wallet)"
                value={form.frequencyCapPerWallet}
                onChange={(v) => patch({ frequencyCapPerWallet: v })}
                type="number"
                min={1}
                step="1"
                placeholder="Optional"
              />
              <TextField
                label="Frequency window (hours)"
                value={form.frequencyCapHours}
                onChange={(v) => patch({ frequencyCapHours: v })}
                type="number"
                min={1}
                step="1"
                placeholder="Optional"
              />
            </div>
          </Section>

          <Section title="Brand safety">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Excluded keywords
              </label>
              <Textarea
                rows={2}
                value={form.brandSafetyKeywords}
                onChange={(e) => patch({ brandSafetyKeywords: e.target.value })}
                placeholder="Comma-separated (e.g. gambling, casino, adult)"
                className="text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                Bids won&apos;t serve on pages matching these keywords.
              </p>
            </div>
          </Section>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 text-xs rounded-full px-4"
          type="button"
        >
          <a href={`/dashboard/campaigns/${campaign.id}`}>Cancel</a>
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={saving}
          className="h-8 gap-1 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
        >
          {saving ? <HourglassStartIcon className="size-3" /> : <CircleCheckIcon className="size-3" />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="space-y-2 border-b border-[rgba(55,50,47,0.07)] pb-3 last:border-0 last:pb-0">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}
