"use client"

import { useMemo } from "react"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { forecast } from "@/lib/campaignSmart"
import { geoCount } from "@/lib/campaignWizard"
import { GaugeIcon } from "@/icons"

interface Props {
  state: WizardState
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

interface StatProps {
  label: string
  value: string
  hint?: string
  border: string
}

function Stat({ label, value, hint, border }: StatProps): React.JSX.Element {
  return (
    <div className={`bg-white px-2.5 py-2 ${border}`}>
      <div className="text-[8px] uppercase tracking-widest text-muted-foreground leading-none">{label}</div>
      <div className="text-[14px] font-medium tabular-nums leading-tight mt-1 text-[#0A0A0A]">{value}</div>
      {hint && <div className="text-[9px] text-muted-foreground/70 leading-none mt-1">{hint}</div>}
    </div>
  )
}

const CONFIDENCE_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
}

export function ForecastPanel({ state }: Props): React.JSX.Element {
  const f = useMemo(
    () =>
      forecast({
        budgetUsd: Number(state.budgetUsd) || 0,
        bidUsd: Number(state.bidUsd) || 0,
        pricingModel: state.pricingModel,
        chainsCount: state.chains.length,
        geosCount: geoCount(state.geos),
        deviceCount: state.deviceTypes.length,
        freqCap: Number(state.freqCap) || 0,
      }),
    [state],
  )
  const empty = f.impressions === 0

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between border-b border-dashed border-[rgba(10,10,10,0.12)] px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <GaugeIcon className="size-3 text-[#1F40CD]" />
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#1F40CD]">Weekly forecast</h3>
        </div>
        <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
          {CONFIDENCE_LABEL[f.confidence]}
        </span>
      </div>
      <div className="p-2 space-y-2">
        {empty ? (
          <div className="border border-dashed border-[rgba(10,10,10,0.18)] py-4 text-center text-[10px] text-muted-foreground/80">
            Set a budget and bid to see estimates.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 border border-dashed border-[rgba(10,10,10,0.12)]">
              <Stat label="Impressions" value={fmtNum(f.impressions)} hint="Per week" border="" />
              <Stat label="Reach" value={fmtNum(f.reach)} hint="Unique wallets" border="border-l border-dashed border-[rgba(10,10,10,0.12)]" />
              <Stat label="Clicks" value={fmtNum(f.clicks)} hint={`${f.ctrPct.toFixed(2)}% CTR`} border="border-t border-dashed border-[rgba(10,10,10,0.12)]" />
              <Stat label="Conversions" value={fmtNum(f.conversions)} hint={f.cpa > 0 ? `~$${f.cpa.toFixed(2)} CPA` : ""} border="border-l border-t border-dashed border-[rgba(10,10,10,0.12)]" />
            </div>
            <p className="text-[9px] text-muted-foreground/70 italic leading-tight px-1">
              Vara averages — actuals vary by creative.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
