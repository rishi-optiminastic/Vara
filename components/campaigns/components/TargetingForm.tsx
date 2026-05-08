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
import { Section, Pill, FieldInput, SegmentList } from "./TargetingFormFields"

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
  const [geos, setGeos] = useState<string>((initial?.geos ?? []).join(", "))
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
        geos: parseAddrs(geos).map((g) => g.toUpperCase()).filter((g) => g.length === 2),
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
    <Card className="border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Section icon={BoxIcon} tint="bg-[#EAF1FF] text-[#1E40AF]" title="Chains" hint={chains.length ? `${chains.length} selected` : "Any"}>
              <div className="flex flex-wrap gap-1.5">
                {CHAINS.map((c) => {
                  const active = chains.includes(c.id)
                  const Logo = chainBrand(c.id).Logo
                  const logoCls = active ? "text-[#FAFAF8]" : chainBrand(c.id).fg
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
            </Section>

            <Section icon={HardDriveIcon} tint="bg-[#F0E8FF] text-[#6D28D9]" title="Devices" hint={devices.length ? `${devices.length} selected` : "Any"}>
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
            </Section>
          </div>

          <Section
            icon={AudiencesIcon}
            tint="bg-[#FFE8F0] text-[#BE185D]"
            title="Wallet segments"
            hint={segmentIds.length ? `${segmentIds.length} selected` : undefined}
          >
            <SegmentList
              segments={segments}
              selected={segmentIds}
              onToggle={(id) => setSegmentIds((p) => toggle(p, id))}
            />
          </Section>

          <div className="grid gap-3 lg:grid-cols-2">
            <Section icon={HourglassStartIcon} tint="bg-[#FFF3E8] text-[#C2410C]" title="Min wallet age">
              <FieldInput label="" type="number" value={minAge} onChange={setMinAge} placeholder="0" suffix="days" />
            </Section>

            <Section icon={WalletIcon} tint="bg-[#E8F5E9] text-[#15803D]" title="Min portfolio">
              <FieldInput label="" type="number" value={minPortfolio} onChange={setMinPortfolio} placeholder="0" prefix="$" />
            </Section>
          </div>

          <Section icon={AudiencesIcon} tint="bg-[#FFF7E0] text-[#A16207]" title="Geos" hint="ISO codes, comma-sep">
            <FieldInput label="" value={geos} onChange={setGeos} placeholder="US, IN, GB" />
          </Section>

          <Section icon={FingerprintIcon} tint="bg-[#F0E8FF] text-[#6D28D9]" title="Holds any of" hint="Contract addresses">
            <Input
              value={holds}
              onChange={(e) => setHolds(e.target.value)}
              placeholder="0x… , So111…"
              className="h-8 text-xs font-mono"
            />
          </Section>

          <Section icon={FileBanIcon} tint="bg-[#FFE8E8] text-[#B91C1C]" title="Excludes" hint="Contract addresses">
            <Input
              value={excludes}
              onChange={(e) => setExcludes(e.target.value)}
              placeholder="0x…"
              className="h-8 text-xs font-mono"
            />
          </Section>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
          )}

          <div className="flex justify-end pt-2 border-t border-[rgba(55,50,47,0.08)]">
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
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
