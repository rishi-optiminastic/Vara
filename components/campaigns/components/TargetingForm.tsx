"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Targeting, WalletSegment } from "@prisma/client"
import { Chain, DeviceType } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CHAINS, isValidContractAddress } from "@/lib/chains"
import { saveTargeting } from "@/services/campaigns"
import { Loader2 } from "lucide-react"
import {
  BoxIcon,
  HardDriveIcon,
  AudiencesIcon,
  HourglassStartIcon,
  WalletIcon,
  FingerprintIcon,
  FileBanIcon,
  MonitorIcon,
  PhoneIcon,
} from "@/icons"
import { chainBrand } from "@/lib/chainLogos"
import { Pill, FieldInput, SegmentList } from "./TargetingFormFields"
import { WizardSection } from "./WizardSection"
import { GeoTargetingDialog } from "@/components/campaigns/GeoTargetingDialog"
import { decodeGeos, encodeGeos, type GeoSelection } from "@/lib/geo/encoding"

interface Props {
  campaignId: string
  initial: Targeting | null
  segments: WalletSegment[]
}

const DEVICES: DeviceType[] = ["DESKTOP", "MOBILE"]

export function TargetingForm({ campaignId, initial, segments }: Props): React.JSX.Element {
  const router = useRouter()
  const [chains, setChains] = useState<Chain[]>(initial?.chains ?? [])
  const [devices, setDevices] = useState<DeviceType[]>(initial?.deviceTypes ?? [])
  const [segmentIds, setSegmentIds] = useState<string[]>(initial?.segmentIds ?? [])
  const [minAge, setMinAge] = useState<string>(String(initial?.minWalletAgeDays ?? ""))
  const [minPortfolio, setMinPortfolio] = useState<string>(
    initial?.minPortfolioUsdCents ? String(initial.minPortfolioUsdCents / 100) : "",
  )
  const [holds, setHolds] = useState<string>((initial?.holdsAnyContract ?? []).join(", "))
  const [excludes, setExcludes] = useState<string>((initial?.excludesContracts ?? []).join(", "))
  const [geos, setGeos] = useState<GeoSelection>(decodeGeos(initial?.geos ?? []))
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const toggle = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  const parseAddrs = (s: string): string[] => s.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError("")
    const holdsList = parseAddrs(holds)
    const excludesList = parseAddrs(excludes)
    const bad = [...holdsList, ...excludesList].find((a) => !isValidContractAddress(a))
    if (bad) { setError(`Invalid contract address: ${bad}`); return }
    setSaving(true)
    try {
      await saveTargeting(campaignId, {
        chains,
        deviceTypes: devices,
        segmentIds,
        geos: encodeGeos(geos),
        minWalletAgeDays: minAge ? Number(minAge) : undefined,
        minPortfolioUsd: minPortfolio ? Number(minPortfolio) : undefined,
        holdsAnyContract: holdsList,
        excludesContracts: excludesList,
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-[rgba(10,10,10,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(10,10,10,0.08)]">
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <WizardSection
              icon={BoxIcon}
              title="Chains"
              description="Wallets active on these chains will be eligible."
            >
              <div className="flex flex-wrap gap-1.5">
                {CHAINS.map((c) => {
                  const active = chains.includes(c.id)
                  const Logo = chainBrand(c.id).Logo
                  const logoCls = active ? "text-[#FFFFFF]" : chainBrand(c.id).fg
                  return (
                    <Pill
                      key={c.id}
                      label={c.name}
                      active={active}
                      onClick={() => setChains((p) => toggle(p, c.id))}
                      icon={<Logo className={`size-3.5 ${logoCls}`} />}
                    />
                  )
                })}
              </div>
            </WizardSection>

            <WizardSection
              icon={HardDriveIcon}
              title="Devices"
              description="Desktop, mobile, or both."
            >
              <div className="flex gap-1.5">
                {DEVICES.map((d) => {
                  const Icon = d === "DESKTOP" ? MonitorIcon : PhoneIcon
                  return (
                    <Pill
                      key={d}
                      label={d.charAt(0) + d.slice(1).toLowerCase()}
                      active={devices.includes(d)}
                      onClick={() => setDevices((p) => toggle(p, d))}
                      icon={<Icon className="size-3.5" />}
                    />
                  )
                })}
              </div>
            </WizardSection>
          </div>

          <WizardSection
            icon={AudiencesIcon}
            title="Geos"
            description="Region, country, or state — drill in for fine-grained targeting."
          >
            <GeoTargetingDialog value={geos} onChange={setGeos} />
          </WizardSection>

          <WizardSection
            icon={AudiencesIcon}
            title="Wallet segments"
            description="Pre-built audience segments to layer on top of chain + geo."
          >
            <SegmentList
              segments={segments}
              selected={segmentIds}
              onToggle={(id) => setSegmentIds((p) => toggle(p, id))}
            />
          </WizardSection>

          <div className="grid gap-5 lg:grid-cols-2">
            <WizardSection
              icon={HourglassStartIcon}
              title="Min wallet age"
              description="Filter wallets newer than this threshold."
            >
              <FieldInput label="" type="number" value={minAge} onChange={setMinAge} placeholder="0" suffix="days" />
            </WizardSection>

            <WizardSection
              icon={WalletIcon}
              title="Min portfolio"
              description="Only target wallets above this on-chain value."
            >
              <FieldInput label="" type="number" value={minPortfolio} onChange={setMinPortfolio} placeholder="0" prefix="$" />
            </WizardSection>
          </div>

          <WizardSection
            icon={FingerprintIcon}
            title="Holds any of"
            description="Targets wallets currently holding any of these contracts."
          >
            <Input
              value={holds}
              onChange={(e) => setHolds(e.target.value)}
              placeholder="0x… , So111…"
              className="h-8 text-xs font-mono"
            />
          </WizardSection>

          <WizardSection
            icon={FileBanIcon}
            title="Excludes"
            description="Wallets holding any of these contracts will not see the ad."
          >
            <Input
              value={excludes}
              onChange={(e) => setExcludes(e.target.value)}
              placeholder="0x…"
              className="h-8 text-xs font-mono"
            />
          </WizardSection>

          {error && (
            <div className="rounded-md border border-[rgba(10,10,10,0.12)] bg-[#ECEAE2] px-3 py-2 text-xs text-[#1F40CD]">{error}</div>
          )}

          <div className="flex justify-end pt-2 border-t border-[rgba(10,10,10,0.08)]">
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#1F40CD] text-white hover:bg-[#1A36B0] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(10,10,10,0.18)]"
            >
              {saving && <Loader2 className="size-3 animate-spin" />}
              Save targeting
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
