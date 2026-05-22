"use client"

import type { BidStrategy, Pacing, PricingModel } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TextField, SelectField, DatePickerField } from "./form-fields"
import { RecommendedBadge } from "./RecommendedBadge"
import { WizardSection } from "./WizardSection"
import { recommendationsFor } from "@/lib/campaignSmart"
import { SpendIcon, GaugeIcon, CalendarCheckIcon } from "@/icons"

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

const BID_STRATEGY_LABELS: Record<BidStrategy, string> = {
  MANUAL: "Manual",
  AUTO: "Auto",
  MAX_CONVERSIONS: "Max conversions",
  TARGET_CPA: "Target CPA",
}

const PACING_LABELS: Record<Pacing, string> = {
  STANDARD: "Standard",
  EVEN: "Even",
  ACCELERATED: "Accelerated",
}

interface RecRowProps {
  matches: boolean
  recLabel: string
  onApply: () => void
}

function RecRow({ matches, recLabel, onApply }: RecRowProps): React.JSX.Element {
  if (matches) {
    return (
      <div className="flex items-center gap-1.5 text-[10px] col-span-2 rounded-md border border-[rgba(10,10,10,0.12)] bg-[#ECEAE2] px-2 py-1.5 text-[#1F40CD]">
        <RecommendedBadge label="Optimized" tone="subtle" />
        <span className="opacity-80">Matches recommended setup.</span>
      </div>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-2 col-span-2 rounded-md border border-[rgba(10,10,10,0.12)] bg-[#ECEAE2] px-2 py-1.5">
      <RecommendedBadge label="Tip" tone="default" />
      <span className="text-[10px] text-[#1F40CD]">
        Try <span className="font-semibold">{recLabel}</span>
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onApply}
        className="h-6 text-[10px] rounded-full px-2.5 ml-auto border-[rgba(10,10,10,0.12)] bg-white text-[#1F40CD] hover:bg-[#ECEAE2]"
      >
        Apply
      </Button>
    </div>
  )
}

export function WizardStepBudget({ state, update }: Props): React.JSX.Element {
  const recs = recommendationsFor(state.objective)
  const biddingMatches =
    state.pricingModel === recs.pricingModel &&
    state.bidStrategy === recs.bidStrategy &&
    state.pacing === recs.pacing

  const recLabel = `${recs.pricingModel} · ${BID_STRATEGY_LABELS[recs.bidStrategy]} · ${PACING_LABELS[recs.pacing]}`

  const applyRecs = (): void =>
    update({
      pricingModel: recs.pricingModel,
      bidStrategy: recs.bidStrategy,
      pacing: recs.pacing,
    })

  return (
    <Card className="py-0 gap-0 border-[rgba(10,10,10,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(10,10,10,0.08)]">
      <CardContent className="p-5 space-y-5">
        <WizardSection
          icon={SpendIcon}
          title="Budget"
          description="Total spend and an optional daily cap."
        >
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
        </WizardSection>

        <WizardSection
          icon={GaugeIcon}
          title="Bidding"
          description="How you pay for delivery and how the engine spends your budget."
          {...(biddingMatches ? { badge: <RecommendedBadge label="Optimized" tone="subtle" /> } : {})}
        >
          <div className="grid grid-cols-2 gap-3">
            <RecRow matches={biddingMatches} recLabel={recLabel} onApply={applyRecs} />
            <SelectField
              label="Pricing model"
              value={state.pricingModel}
              onChange={(v) => update({ pricingModel: v as PricingModel })}
              options={PRICING_MODELS}
              hint={state.pricingModel === recs.pricingModel ? "Matches recommendation" : `Recommended: ${recs.pricingModel}`}
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
              hint={state.bidStrategy === recs.bidStrategy ? "Matches recommendation" : `Recommended: ${BID_STRATEGY_LABELS[recs.bidStrategy]}`}
            />
            <SelectField
              label="Pacing"
              value={state.pacing}
              onChange={(v) => update({ pacing: v as Pacing })}
              options={PACING_OPTIONS}
              hint={state.pacing === recs.pacing ? "Matches recommendation" : `Recommended: ${PACING_LABELS[recs.pacing]}`}
            />
          </div>
        </WizardSection>

        <WizardSection
          icon={CalendarCheckIcon}
          title="Schedule"
          description="When the campaign starts and (optionally) ends."
        >
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
        </WizardSection>
      </CardContent>
    </Card>
  )
}
