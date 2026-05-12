"use client"

import { useMemo } from "react"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
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
  tint: string
  valueClass: string
}

function Stat({ label, value, hint, tint, valueClass }: StatProps): React.JSX.Element {
  return (
    <div className={`rounded-md px-2 py-1.5 border border-[rgba(55,50,47,0.06)] ${tint}`}>
      <div className="text-[8px] uppercase tracking-widest opacity-70 leading-none">{label}</div>
      <div className={`text-[13px] font-semibold tabular-nums leading-tight mt-0.5 ${valueClass}`}>{value}</div>
      {hint && <div className="text-[9px] opacity-60 leading-none mt-0.5">{hint}</div>}
    </div>
  )
}

const CONFIDENCE_LABEL: Record<"low" | "medium" | "high", { label: string; tone: string }> = {
  low: { label: "Low confidence", tone: "text-amber-700 bg-amber-50 border-amber-200" },
  medium: { label: "Medium confidence", tone: "text-[#37322F] bg-[#F0ECE6] border-[rgba(55,50,47,0.18)]" },
  high: { label: "High confidence", tone: "text-emerald-700 bg-emerald-50 border-emerald-200" },
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
  const conf = CONFIDENCE_LABEL[f.confidence]
  const empty = f.impressions === 0

  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] bg-[#FFFFFF] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.1)] px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <GaugeIcon className="size-3 text-muted-foreground" />
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Weekly forecast</h3>
        </div>
        <span className={`rounded-full border px-1.5 py-px text-[8px] font-semibold uppercase tracking-widest leading-none ${conf.tone}`}>
          {conf.label}
        </span>
      </div>
      <CardContent className="p-2 space-y-2">
        {empty ? (
          <div className="rounded-md border border-dashed border-[rgba(55,50,47,0.2)] py-4 text-center text-[10px] text-muted-foreground/70">
            Set a budget and bid to see estimates.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-1.5">
              <Stat
                label="Impressions"
                value={fmtNum(f.impressions)}
                hint="Per week"
                tint="bg-[#EAF1FF] text-[#1E40AF]"
                valueClass="text-[#1E3A8A]"
              />
              <Stat
                label="Reach"
                value={fmtNum(f.reach)}
                hint="Unique wallets"
                tint="bg-[#F0E8FF] text-[#6D28D9]"
                valueClass="text-[#5B21B6]"
              />
              <Stat
                label="Clicks"
                value={fmtNum(f.clicks)}
                hint={`${f.ctrPct.toFixed(2)}% CTR`}
                tint="bg-[#FFF3E8] text-[#C2410C]"
                valueClass="text-[#9A3412]"
              />
              <Stat
                label="Conversions"
                value={fmtNum(f.conversions)}
                hint={f.cpa > 0 ? `~$${f.cpa.toFixed(2)} CPA` : ""}
                tint="bg-[#E8F5E9] text-[#15803D]"
                valueClass="text-[#166534]"
              />
            </div>
            <p className="text-[9px] text-muted-foreground/60 italic leading-tight">
              Vara averages — actuals vary by creative.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
