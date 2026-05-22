"use client"

import type { Chain, DeviceType } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { TextField } from "./form-fields"
import { CHAINS } from "@/lib/chains"
import { chainBrand } from "@/lib/chainLogos"
import { GeoTargetingDialog } from "@/components/campaigns/GeoTargetingDialog"
import { WizardSection } from "./WizardSection"
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
          ? "bg-[#1F40CD] text-white border-[#1F40CD]"
          : "bg-white border-[rgba(10,10,10,0.16)] text-[#0A0A0A] hover:bg-[#ECEAE2] hover:border-[rgba(10,10,10,0.3)]"
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
  const logoCls = active ? "text-[#FFFFFF]" : chainBrand(chain).fg
  return <Pill label={label} active={active} onClick={onClick} icon={<Logo className={`size-3.5 ${logoCls}`} />} />
}

export function WizardStepTargeting({ state, update }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(10,10,10,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(10,10,10,0.08)]">
      <CardContent className="p-5 space-y-5">

        <WizardSection
          icon={BoxIcon}
          title="Chains"
          description="Wallets active on these chains will be eligible to see your ad."
        >
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
        </WizardSection>

        <WizardSection
          icon={AudiencesIcon}
          title="Geos"
          description="Region, country, or state — drill in for fine-grained targeting."
        >
          <GeoTargetingDialog
            value={state.geos}
            onChange={(geos) => update({ geos })}
          />
        </WizardSection>

        <WizardSection
          icon={HardDriveIcon}
          title="Devices"
          description="Desktop, mobile, or both."
        >
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
        </WizardSection>

        <WizardSection
          icon={HourglassStartIcon}
          title="Frequency cap"
          description="Limit how often a single wallet sees this campaign."
        >
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
        </WizardSection>

        <WizardSection
          icon={FileBanIcon}
          title="Brand safety"
          description="Keywords that disqualify a placement when matched."
        >
          <TextField
            label=""
            value={state.brandSafety}
            onChange={(v) => update({ brandSafety: v })}
            placeholder="rug, scam, hack, gambling, adult"
            hint="Comma-separated keywords"
            span={2}
          />
        </WizardSection>
      </CardContent>
    </Card>
  )
}
