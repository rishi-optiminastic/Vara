"use client"

import type { BidStrategy, Pacing, PricingModel } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { TextField, SelectField, DatePickerField } from "./form-fields"

interface Props {
  state: WizardState
  update: (patch: Partial<WizardState>) => void
}

const PRICING_MODELS: { value: PricingModel; label: string; desc: string }[] = [
  { value: "CPM", label: "CPM", desc: "Pay per 1,000 impressions" },
  { value: "CPC", label: "CPC", desc: "Pay per click" },
  { value: "CPA", label: "CPA", desc: "Pay per on-chain conversion" },
]

const BID_STRATEGIES: { value: BidStrategy; label: string; desc: string }[] = [
  { value: "MANUAL", label: "Manual", desc: "Fixed bid you set" },
  { value: "AUTO", label: "Auto", desc: "Engine adjusts within budget" },
  { value: "MAX_CONVERSIONS", label: "Max conversions", desc: "Spend budget for max conversions" },
  { value: "TARGET_CPA", label: "Target CPA", desc: "Hit a target cost-per-acquisition" },
]

const PACING_OPTIONS: { value: Pacing; label: string; desc: string }[] = [
  { value: "STANDARD", label: "Standard", desc: "Smooth spend across the day" },
  { value: "EVEN", label: "Even", desc: "Strictly equal hourly spend" },
  { value: "ACCELERATED", label: "Accelerated", desc: "Spend ASAP — exhaust daily cap fast" },
]

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="space-y-2 border-b border-[rgba(55,50,47,0.07)] pb-3 last:border-0 last:pb-0">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
        {desc && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export function WizardStepBudget({ state, update }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">
        <Section title="Budget" desc="Total spend limit and optional daily cap.">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Total budget"
              value={state.budgetUsd}
              onChange={(v) => update({ budgetUsd: v })}
              type="number"
              min={10}
              step="0.01"
              required
              prefix="$"
              hint="Minimum $10"
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
              hint="Leave blank for no daily limit"
            />
          </div>
        </Section>

        <Section title="Bidding" desc="How you pay and how the engine optimizes spend.">
          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Pricing model"
              value={state.pricingModel}
              onChange={(v) => update({ pricingModel: v as PricingModel })}
              options={PRICING_MODELS}
            />
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
            <SelectField
              label="Bid strategy"
              value={state.bidStrategy}
              onChange={(v) => update({ bidStrategy: v as BidStrategy })}
              options={BID_STRATEGIES}
            />
            <SelectField
              label="Pacing"
              value={state.pacing}
              onChange={(v) => update({ pacing: v as Pacing })}
              options={PACING_OPTIONS}
            />
          </div>
        </Section>

        <Section title="Schedule" desc="When the campaign runs. Leave end date blank for open-ended.">
          <div className="grid grid-cols-2 gap-3">
            <DatePickerField
              label="Start date"
              value={state.startDate}
              onChange={(v) => update({ startDate: v })}
            />
            <DatePickerField
              label="End date"
              value={state.endDate}
              onChange={(v) => update({ endDate: v })}
              placeholder="Open-ended"
              hint="Leave blank to run indefinitely"
            />
          </div>
        </Section>
      </CardContent>
    </Card>
  )
}
