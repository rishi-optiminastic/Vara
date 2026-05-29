"use client"

import type { Chain } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { chainName } from "@/lib/chains"
import {
  CampaignsIcon,
  SpendIcon,
  GaugeIcon,
  ImageSparkleIcon,
  CalendarCheckIcon,
} from "@/icons"
import { SetupScoreRing } from "./SetupScoreRing"
import { ForecastPanel } from "./ForecastPanel"

interface Props {
  state: WizardState
  step: number
  score: number
  savedLabel: string
}

interface RowProps {
  label: string
  value: string
  muted?: boolean
}

function Row({ label, value, muted }: RowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">{label}</span>
      <span className={`text-[11px] text-right tabular-nums truncate ${muted ? "text-muted-foreground/70 italic" : "text-[#0A0A0A] font-medium"}`}>
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
    <div className={`bg-white transition-opacity ${!active && !done ? "opacity-60" : ""}`}>
      <div className="relative flex items-center justify-between border-b border-dashed border-[rgba(10,10,10,0.12)] px-3 py-1.5">
        {active && (
          <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-[#1F40CD]" />
        )}
        <div className="flex items-center gap-1.5">
          <Icon className={`size-3 ${active ? "text-[#1F40CD]" : "text-muted-foreground"}`} />
          <h3 className={`text-[10px] font-semibold uppercase tracking-widest ${active ? "text-[#1F40CD]" : "text-muted-foreground"}`}>
            {title}
          </h3>
        </div>
        {active ? (
          <span className="text-[8px] uppercase tracking-widest font-semibold text-[#1F40CD]">Now</span>
        ) : done ? (
          <span className="text-[10px] text-muted-foreground leading-none">✓</span>
        ) : null}
      </div>
      <div className="px-3 py-1.5">{children}</div>
    </div>
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

export function WizardSummary({ state, step, score, savedLabel }: Props): React.JSX.Element {
  const chainList = state.chains.map((c) => chainName(c as Chain))
  const geoCount = state.geos.regions.length + state.geos.countries.length + state.geos.states.length

  return (
    <div className="sticky top-3 flex flex-col gap-2.5">
      <div className="flex items-center gap-2 border border-dashed border-[rgba(10,10,10,0.18)] bg-white px-3 py-2">
        <SetupScoreRing score={score} />
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A]">Setup</div>
          {savedLabel && (
            <div className="text-[9px] text-muted-foreground/80 leading-tight mt-0.5 truncate">{savedLabel}</div>
          )}
        </div>
      </div>

      <ForecastPanel state={state} />

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
