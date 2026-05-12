"use client"

import type { BidStrategy, Chain, DeviceType, PricingModel } from "@prisma/client"
import type { AdGroupFormState } from "@/hooks/useAdGroupForm"
import { Card, CardContent } from "@/components/ui/card"
import { TextField, SegmentedField, DatePickerField } from "@/components/campaigns/components/form-fields"
import { CHAINS } from "@/lib/chains"

interface Props {
  state: AdGroupFormState
  update: (patch: Partial<AdGroupFormState>) => void
}

const PRICING_MODELS = [
  { value: "CPM" as PricingModel, label: "CPM", desc: "Pay per 1,000 impressions" },
  { value: "CPC" as PricingModel, label: "CPC", desc: "Pay per click" },
  { value: "CPA" as PricingModel, label: "CPA", desc: "Pay per on-chain conversion" },
]

const BID_STRATEGIES = [
  { value: "MANUAL" as BidStrategy, label: "Manual", desc: "Fixed bid you control" },
  { value: "AUTO" as BidStrategy, label: "Auto", desc: "Engine adjusts within budget" },
  { value: "MAX_CONVERSIONS" as BidStrategy, label: "Max conversions", desc: "Maximise conversion volume" },
]

const DEVICES: { value: DeviceType; label: string }[] = [
  { value: "DESKTOP", label: "Desktop" },
  { value: "MOBILE", label: "Mobile" },
]

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7 rounded-full border px-3 text-[11px] font-medium transition-colors ${
        active
          ? "bg-[#37322F] text-[#FAFAF8] border-[#37322F]"
          : "bg-white border-[rgba(55,50,47,0.16)] text-[#37322F] hover:bg-[#F0ECE6] hover:border-[rgba(55,50,47,0.3)]"
      }`}
    >
      {label}
    </button>
  )
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="space-y-1.5 border-b border-[rgba(55,50,47,0.07)] pb-3 last:border-0 last:pb-0">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</div>
        {desc && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export function AdGroupStepSettings({ state, update }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">
        <Section title="Bidding" desc="Set your bid and strategy for this ad group.">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Bid"
              value={state.bidUsd}
              onChange={(v) => update({ bidUsd: v })}
              type="number"
              min={0.1}
              step="0.01"
              required
              prefix="$"
              suffix={state.pricingModel}
              hint="Min $0.10"
            />
            <TextField
              label="Daily cap"
              value={state.dailyCapUsd}
              onChange={(v) => update({ dailyCapUsd: v })}
              type="number"
              min={1}
              step="0.01"
              placeholder="Optional"
              prefix="$"
            />
            <SegmentedField
              label="Pricing model"
              value={state.pricingModel}
              onChange={(v) => update({ pricingModel: v as PricingModel })}
              options={PRICING_MODELS}
              span={2}
            />
            <SegmentedField
              label="Bid strategy"
              value={state.bidStrategy}
              onChange={(v) => update({ bidStrategy: v as BidStrategy })}
              options={BID_STRATEGIES}
              span={2}
            />
          </div>
        </Section>

        <Section title="Schedule" desc="Optional. Inherits campaign dates if left blank.">
          <div className="grid grid-cols-2 gap-3">
            <DatePickerField label="Start date" value={state.startDate} onChange={(v) => update({ startDate: v })} placeholder="Inherit from campaign" />
            <DatePickerField label="End date" value={state.endDate} onChange={(v) => update({ endDate: v })} placeholder="Inherit from campaign" />
          </div>
        </Section>

        <Section title="Chains" desc="Target wallets on specific blockchains. Empty = all chains.">
          <div className="flex flex-wrap gap-1.5">
            {CHAINS.map((c) => (
              <Pill
                key={c.id}
                label={c.name}
                active={state.chains.includes(c.id as Chain)}
                onClick={() => update({ chains: toggle(state.chains, c.id as Chain) })}
              />
            ))}
          </div>
        </Section>

        <Section title="Geo + Devices" desc="ISO country codes, comma-separated. Empty = worldwide.">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Geos" value={state.geos} onChange={(v) => update({ geos: v })} placeholder="US, GB, DE" hint="2-letter country codes" />
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Devices</div>
              <div className="flex gap-2">
                {DEVICES.map((d) => (
                  <Pill
                    key={d.value}
                    label={d.label}
                    active={state.deviceTypes.includes(d.value)}
                    onClick={() => update({ deviceTypes: toggle(state.deviceTypes, d.value) })}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>
      </CardContent>
    </Card>
  )
}
