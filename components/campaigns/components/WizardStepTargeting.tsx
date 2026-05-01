"use client"

import type { Chain, DeviceType } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { TextField } from "./form-fields"
import { CHAINS } from "@/lib/chains"

interface Props {
  state: WizardState
  update: (patch: Partial<WizardState>) => void
}

const DEVICES: { value: DeviceType; label: string }[] = [
  { value: "DESKTOP", label: "Desktop" },
  { value: "MOBILE", label: "Mobile" },
]

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

interface PillProps {
  label: string
  active: boolean
  onClick: () => void
}

function Pill({ label, active, onClick }: PillProps): React.JSX.Element {
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

export function WizardStepTargeting({ state, update }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">

        <Section title="Chains (tags)" desc="Target wallets active on specific blockchains.">
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
          {state.chains.length === 0 && (
            <p className="text-[10px] text-muted-foreground/60 italic mt-1">No chains selected — all chains targeted</p>
          )}
        </Section>

        <Section title="Geo targeting" desc="ISO 3166-1 alpha-2 country codes, comma-separated.">
          <TextField
            label=""
            value={state.geos}
            onChange={(v) => update({ geos: v })}
            placeholder="US, GB, IN, DE, SG"
            hint="Leave blank to target all countries worldwide"
          />
        </Section>

        <Section title="Devices">
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
          {state.deviceTypes.length === 0 && (
            <p className="text-[10px] text-muted-foreground/60 italic mt-1">No devices selected — all devices targeted</p>
          )}
        </Section>

        <Section title="Frequency cap" desc="Limit how many times a wallet sees your ad in a given window.">
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Max impressions"
              value={state.freqCap}
              onChange={(v) => update({ freqCap: v })}
              type="number"
              min={1}
              placeholder="e.g. 5"
              suffix="impr."
              hint="Per wallet"
            />
            <TextField
              label="Per window"
              value={state.freqHours}
              onChange={(v) => update({ freqHours: v })}
              type="number"
              min={1}
              suffix="hours"
              disabled={!state.freqCap}
              {...(!state.freqCap ? { hint: "Set max impressions first" } : {})}
            />
          </div>
        </Section>

        <Section title="Placement filters" desc="Exclude publisher placements matching these keywords.">
          <TextField
            label=""
            value={state.brandSafety}
            onChange={(v) => update({ brandSafety: v })}
            placeholder="rug, scam, hack, gambling, adult"
            hint="Comma-separated keywords. Ads won't appear on sites matching these terms."
            span={2}
          />
        </Section>
      </CardContent>
    </Card>
  )
}
