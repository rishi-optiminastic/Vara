"use client"

import type { Chain } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { chainName } from "@/lib/chains"
import {
  CampaignsIcon,
  SpendIcon,
  GaugeIcon,
  ImageSparkleIcon,
  CalendarCheckIcon,
} from "@/icons"

interface Props {
  state: WizardState
  step: number
}

interface RowProps {
  label: string
  value: string
  muted?: boolean
}

function Row({ label, value, muted }: RowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">{label}</span>
      <span className={`text-[11px] text-right tabular-nums truncate ${muted ? "text-muted-foreground/70 italic" : "text-[#37322F] font-medium"}`}>
        {value}
      </span>
    </div>
  )
}

interface SectionProps {
  icon: React.ElementType
  title: string
  active: boolean
  done: boolean
  children: React.ReactNode
}

function Section({ icon: Icon, title, active, done, children }: SectionProps): React.JSX.Element {
  return (
    <Card className={`py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)] overflow-hidden transition-all ${
      active ? "ring-1 ring-[#37322F]/20" : !done ? "opacity-70" : ""
    }`}>
      <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.1)] bg-[#FAFAF8] px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3 text-muted-foreground" />
          <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{title}</h3>
        </div>
        {active ? (
          <span className="text-[8px] uppercase tracking-widest font-semibold text-[#37322F]">Now</span>
        ) : done ? (
          <span className="text-[10px] text-emerald-700 leading-none">✓</span>
        ) : null}
      </div>
      <CardContent className="px-3 py-2 space-y-1">{children}</CardContent>
    </Card>
  )
}

function fmtMoney(v: string): string {
  const n = Number(v)
  if (!v || Number.isNaN(n)) return "—"
  return `$${n.toLocaleString()}`
}

function readable(v: string): string {
  return v.replace(/_/g, " ").toLowerCase()
}

export function WizardSummary({ state, step }: Props): React.JSX.Element {
  const chainList = state.chains.map((c) => chainName(c as Chain))
  const geoCount = state.geos
    .split(/[\s,]+/)
    .map((g) => g.trim().toUpperCase())
    .filter((g) => g.length === 2).length

  return (
    <div className="sticky top-3 space-y-2">
      <div className="flex items-center gap-1.5 px-1">
        <SquareWandSparkleBadge />
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#37322F]">Live summary</div>
          <div className="text-[9px] text-muted-foreground/80 leading-none mt-0.5">Updates as you fill the form</div>
        </div>
      </div>

      <Section icon={CampaignsIcon} title="Campaign" active={step === 1} done={step > 1}>
        <Row label="Name" value={state.name || "Untitled"} muted={!state.name} />
        <Row label="Objective" value={readable(state.objective)} />
        <Row label="Vertical" value={readable(state.vertical)} />
      </Section>

      <Section icon={SpendIcon} title="Budget" active={step === 2} done={step > 2}>
        <Row label="Total" value={fmtMoney(state.budgetUsd)} muted={!state.budgetUsd} />
        <Row label={`Bid · ${state.pricingModel}`} value={fmtMoney(state.bidUsd)} muted={!state.bidUsd} />
        {state.dailyCapUsd && <Row label="Daily cap" value={fmtMoney(state.dailyCapUsd)} />}
      </Section>

      <Section icon={CalendarCheckIcon} title="Schedule" active={step === 2} done={step > 2}>
        <Row
          label="Runs"
          value={state.endDate ? `${state.startDate} → ${state.endDate}` : `${state.startDate || "—"} · open`}
          muted={!state.startDate}
        />
        <Row label="Pacing" value={readable(state.pacing)} />
      </Section>

      <Section icon={GaugeIcon} title="Ad Group" active={step === 3} done={step > 3}>
        <Row label="Chains" value={chainList.length ? `${chainList.length} selected` : "All"} muted={chainList.length === 0} />
        <Row label="Geos" value={geoCount ? `${geoCount} countries` : "Worldwide"} muted={geoCount === 0} />
        <Row label="Devices" value={state.deviceTypes.length ? `${state.deviceTypes.length} type(s)` : "All"} muted={state.deviceTypes.length === 0} />
        <Row label="Frequency" value={state.freqCap ? `${state.freqCap}/${state.freqHours}h` : "—"} muted={!state.freqCap} />
      </Section>

      <Section icon={ImageSparkleIcon} title="Creatives" active={step === 4} done={step > 4}>
        {state.ads.length === 0 ? (
          <Row label="Ads" value="None — add later" muted />
        ) : (
          state.ads.map((ad) => <Row key={ad.id} label={ad.name} value={ad.format} />)
        )}
      </Section>
    </div>
  )
}

function SquareWandSparkleBadge(): React.JSX.Element {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#F0ECE6] text-[#37322F]">
      <span className="text-[10px]">✦</span>
    </div>
  )
}
