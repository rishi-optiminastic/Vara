"use client"

import type { WalletSegment } from "@prisma/client"
import { Chain, DeviceType } from "@prisma/client"
import { CHAINS } from "@/lib/chains"
import { chainBrand } from "@/lib/chainLogos"
import {
  BoxIcon,
  AudiencesIcon,
  FingerprintIcon,
  FileBanIcon,
  MonitorIcon,
  PhoneIcon,
} from "@/icons"
import {
  Section,
  Pill,
  FieldInput,
  SegmentList,
  AddressTokenInput,
} from "./TargetingFormFields"

const DEVICES: DeviceType[] = ["DESKTOP", "MOBILE"]

interface SubLabelProps {
  text: string
  hint?: string
  icon?: React.ElementType
}

export function SubLabel({ text, hint, icon: Icon }: SubLabelProps): React.JSX.Element {
  return (
    <div className="flex items-baseline gap-2">
      {Icon && (
        <span className="text-muted-foreground/70">
          <Icon className="size-3" />
        </span>
      )}
      <span className="text-[10px] font-medium uppercase tracking-widest text-[#37322F]/75">
        {text}
      </span>
      {hint && <span className="text-[10px] text-muted-foreground/65">· {hint}</span>}
    </div>
  )
}

interface WhereProps {
  chains: Chain[]
  devices: DeviceType[]
  geos: string
  onToggleChain: (c: Chain) => void
  onToggleDevice: (d: DeviceType) => void
  onChangeGeos: (v: string) => void
}

export function TargetingWhere({
  chains,
  devices,
  geos,
  onToggleChain,
  onToggleDevice,
  onChangeGeos,
}: WhereProps): React.JSX.Element {
  return (
    <Section
      icon={BoxIcon}
      tint="bg-[#EAF1FF] text-[#1E40AF]"
      title="Where"
      description="Chains, geographies, and device types"
    >
      <div className="space-y-3">
        <SubLabel text="Chains" hint={chains.length ? `${chains.length} selected` : "Any"} />
        <div className="flex flex-wrap gap-1.5">
          {CHAINS.map((c) => {
            const Logo = chainBrand(c.id).Logo
            return (
              <Pill
                key={c.id}
                label={c.name}
                active={chains.includes(c.id)}
                onClick={() => onToggleChain(c.id)}
                icon={<Logo className="size-3.5" />}
              />
            )
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <div>
            <SubLabel text="Devices" hint={devices.length ? `${devices.length} selected` : "Any"} />
            <div className="mt-1.5 flex gap-1.5">
              {DEVICES.map((d) => {
                const Icon = d === "DESKTOP" ? MonitorIcon : PhoneIcon
                return (
                  <Pill
                    key={d}
                    label={d.charAt(0) + d.slice(1).toLowerCase()}
                    active={devices.includes(d)}
                    onClick={() => onToggleDevice(d)}
                    icon={<Icon className="size-3.5" />}
                  />
                )
              })}
            </div>
          </div>
          <div>
            <SubLabel text="Geos" hint="ISO 2-letter, comma-sep" />
            <div className="mt-1.5">
              <FieldInput label="" value={geos} onChange={onChangeGeos} placeholder="US, IN, GB" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface WhoProps {
  segments: WalletSegment[]
  selectedSegmentIds: string[]
  minAge: string
  minPortfolio: string
  onToggleSegment: (id: string) => void
  onChangeMinAge: (v: string) => void
  onChangeMinPortfolio: (v: string) => void
}

export function TargetingWho({
  segments,
  selectedSegmentIds,
  minAge,
  minPortfolio,
  onToggleSegment,
  onChangeMinAge,
  onChangeMinPortfolio,
}: WhoProps): React.JSX.Element {
  return (
    <Section
      icon={AudiencesIcon}
      tint="bg-[#FFE8F0] text-[#BE185D]"
      title="Who"
      description="Wallet segments and signals"
    >
      <div className="space-y-3">
        <SubLabel
          text="Wallet segments"
          hint={selectedSegmentIds.length ? `${selectedSegmentIds.length} selected` : undefined}
        />
        <SegmentList
          segments={segments}
          selected={selectedSegmentIds}
          onToggle={onToggleSegment}
        />
        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <div>
            <SubLabel text="Min wallet age" hint="Days" />
            <div className="mt-1.5">
              <FieldInput
                label=""
                type="number"
                value={minAge}
                onChange={onChangeMinAge}
                placeholder="0"
                suffix="days"
              />
            </div>
          </div>
          <div>
            <SubLabel text="Min portfolio" hint="USD" />
            <div className="mt-1.5">
              <FieldInput
                label=""
                type="number"
                value={minPortfolio}
                onChange={onChangeMinPortfolio}
                placeholder="0"
                prefix="$"
              />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

interface WhatProps {
  holds: string
  excludes: string
  onChangeHolds: (v: string) => void
  onChangeExcludes: (v: string) => void
}

export function TargetingWhat({
  holds,
  excludes,
  onChangeHolds,
  onChangeExcludes,
}: WhatProps): React.JSX.Element {
  return (
    <Section
      icon={FingerprintIcon}
      tint="bg-[#F0E8FF] text-[#6D28D9]"
      title="What"
      description="Contract holdings and exclusions"
    >
      <div className="space-y-3">
        <div>
          <SubLabel text="Holds any of" hint="Contract addresses, comma-sep" />
          <div className="mt-1.5">
            <AddressTokenInput
              value={holds}
              onChange={onChangeHolds}
              placeholder="0x… , So111…"
            />
          </div>
        </div>
        <div>
          <SubLabel
            text="Excludes"
            hint="Wallets holding these will not see the ad"
            icon={FileBanIcon}
          />
          <div className="mt-1.5">
            <AddressTokenInput
              value={excludes}
              onChange={onChangeExcludes}
              placeholder="0x…"
              tone="danger"
            />
          </div>
        </div>
      </div>
    </Section>
  )
}
