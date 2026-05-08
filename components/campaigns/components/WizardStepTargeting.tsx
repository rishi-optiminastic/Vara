"use client"

import type { Chain, DeviceType } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { TextField } from "./form-fields"
import { CHAINS } from "@/lib/chains"
import { chainBrand } from "@/lib/chainLogos"
import {
  BoxIcon,
  HardDriveIcon,
  HourglassStartIcon,
  FileBanIcon,
  AudiencesIcon,
  MonitorIcon,
  PhoneIcon,
} from "@/icons"

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
  icon?: React.ReactNode
}

function Pill({ label, active, onClick, icon }: PillProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7 inline-flex items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors ${
        active
          ? "bg-[#37322F] text-[#FAFAF8] border-[#37322F]"
          : "bg-white border-[rgba(55,50,47,0.16)] text-[#37322F] hover:bg-[#F0ECE6] hover:border-[rgba(55,50,47,0.3)]"
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

interface ChainPillProps {
  chain: Chain
  label: string
  active: boolean
  onClick: () => void
}

function ChainPill({ chain, label, active, onClick }: ChainPillProps): React.JSX.Element {
  const Logo = chainBrand(chain).Logo
  const logoCls = active ? "text-[#FAFAF8]" : chainBrand(chain).fg
  return <Pill label={label} active={active} onClick={onClick} icon={<Logo className={`size-3.5 ${logoCls}`} />} />
}

interface SectionProps {
  icon: React.ElementType
  tint: string
  title: string
  children: React.ReactNode
}

function Section({ icon: Icon, tint, title, children }: SectionProps): React.JSX.Element {
  return (
    <div className="space-y-1.5 border-b border-[rgba(55,50,47,0.07)] pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-1.5">
        <span className={`flex size-4 items-center justify-center rounded-md ${tint}`}>
          <Icon className="size-2.5" />
        </span>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</div>
      </div>
      {children}
    </div>
  )
}

export function WizardStepTargeting({ state, update }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">

        <Section icon={BoxIcon} tint="bg-[#EAF1FF] text-[#1E40AF]" title="Chains">
          <div className="flex flex-wrap gap-1.5">
            {CHAINS.map((c) => (
              <ChainPill
                key={c.id}
                chain={c.id as Chain}
                label={c.name}
                active={state.chains.includes(c.id as Chain)}
                onClick={() => update({ chains: toggle(state.chains, c.id as Chain) })}
              />
            ))}
          </div>
          {state.chains.length === 0 && (
            <p className="text-[10px] text-muted-foreground/60 italic mt-1">All chains targeted</p>
          )}
        </Section>

        <Section icon={AudiencesIcon} tint="bg-[#FFE8F0] text-[#BE185D]" title="Geos">
          <TextField
            label=""
            value={state.geos}
            onChange={(v) => update({ geos: v })}
            placeholder="US, GB, IN, DE, SG"
            hint="ISO codes — blank = worldwide"
          />
        </Section>

        <Section icon={HardDriveIcon} tint="bg-[#F0E8FF] text-[#6D28D9]" title="Devices">
          <div className="flex gap-2">
            {DEVICES.map((d) => {
              const Icon = d.value === "DESKTOP" ? MonitorIcon : PhoneIcon
              const active = state.deviceTypes.includes(d.value)
              return (
                <Pill
                  key={d.value}
                  label={d.label}
                  active={active}
                  onClick={() => update({ deviceTypes: toggle(state.deviceTypes, d.value) })}
                  icon={<Icon className="size-3.5" />}
                />
              )
            })}
          </div>
          {state.deviceTypes.length === 0 && (
            <p className="text-[10px] text-muted-foreground/60 italic mt-1">All devices targeted</p>
          )}
        </Section>

        <Section icon={HourglassStartIcon} tint="bg-[#FFF3E8] text-[#C2410C]" title="Frequency cap">
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
              {...(!state.freqCap ? { hint: "Set impressions first" } : {})}
            />
          </div>
        </Section>

        <Section icon={FileBanIcon} tint="bg-[#FFE8E8] text-[#B91C1C]" title="Brand safety">
          <TextField
            label=""
            value={state.brandSafety}
            onChange={(v) => update({ brandSafety: v })}
            placeholder="rug, scam, hack, gambling, adult"
            hint="Comma-separated keywords"
            span={2}
          />
        </Section>
      </CardContent>
    </Card>
  )
}
