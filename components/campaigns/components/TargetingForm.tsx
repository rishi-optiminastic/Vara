"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Targeting, WalletSegment } from "@prisma/client"
import { Chain, DeviceType } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CHAINS, isValidContractAddress } from "@/lib/chains"
import { saveTargeting } from "@/services/campaigns"
import { Loader2 } from "lucide-react"

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
  const parseAddrs = (s: string): string[] =>
    s.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError("")
    const holdsList = parseAddrs(holds)
    const excludesList = parseAddrs(excludes)
    const bad = [...holdsList, ...excludesList].find((a) => !isValidContractAddress(a))
    if (bad) {
      setError(`Invalid contract address: ${bad}`)
      return
    }
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
          <Section title="Chains">
            <div className="flex flex-wrap gap-1.5">
              {CHAINS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setChains((prev) => toggle(prev, c.id))}
                  className={`h-6 rounded-full border px-2.5 text-[11px] transition-colors ${
                    chains.includes(c.id)
                      ? "bg-[#37322F] text-[#FAFAF8] border-[#37322F]"
                      : "bg-white border-[rgba(55,50,47,0.16)] text-[#37322F] hover:bg-[#F0ECE6]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Devices">
            <div className="flex gap-1.5">
              {DEVICES.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDevices((prev) => toggle(prev, d))}
                  className={`h-6 rounded-full border px-2.5 text-[11px] capitalize transition-colors ${
                    devices.includes(d)
                      ? "bg-[#37322F] text-[#FAFAF8] border-[#37322F]"
                      : "bg-white border-[rgba(55,50,47,0.16)] text-[#37322F] hover:bg-[#F0ECE6]"
                  }`}
                >
                  {d.toLowerCase()}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Wallet segments">
            <div className="space-y-1 max-h-56 overflow-y-auto rounded-md border bg-muted/20 p-2">
              {segments.length === 0 && (
                <p className="text-[11px] text-muted-foreground">No segments seeded yet.</p>
              )}
              {segments.map((s) => (
                <label key={s.id} className="flex items-start gap-2 rounded p-1 hover:bg-background cursor-pointer">
                  <Checkbox
                    checked={segmentIds.includes(s.id)}
                    onCheckedChange={() => setSegmentIds((prev) => toggle(prev, s.id))}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium">{s.name}</span>
                      {s.chain && (
                        <Badge variant="outline" className="h-3.5 px-1 text-[8px] uppercase">{s.chain}</Badge>
                      )}
                      <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                        ~{(s.estSize / 1000).toFixed(1)}k wallets
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">{s.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Min wallet age (days)" type="number" value={minAge} onChange={setMinAge} />
            <FieldInput label="Min portfolio (USD)" type="number" value={minPortfolio} onChange={setMinPortfolio} />
            <FieldInput label="Geos (ISO codes, comma-sep.)" value={geos} onChange={setGeos} placeholder="US, IN, GB" />
            <div />
            <div className="col-span-2">
              <Label className="text-[10px] uppercase tracking-wider">Holds any of (contracts)</Label>
              <Input value={holds} onChange={(e) => setHolds(e.target.value)} placeholder="0x… , So111…" className="h-8 text-xs mt-1" />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] uppercase tracking-wider">Excludes (contracts)</Label>
              <Input value={excludes} onChange={(e) => setExcludes(e.target.value)} placeholder="0x…" className="h-8 text-xs mt-1" />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
          )}

          <div className="flex justify-end pt-2 border-t border-[rgba(55,50,47,0.08)]">
            <Button type="submit" size="sm" disabled={saving} className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[0_0_0_2.5px_rgba(255,255,255,0.08)_inset]">
              {saving && <Loader2 className="size-3 animate-spin" />}
              Save targeting
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] uppercase tracking-wider">{title}</Label>
      {children}
    </div>
  )
}

interface FieldInputProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}

function FieldInput({ label, value, onChange, type = "text", placeholder }: FieldInputProps): React.JSX.Element {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-wider">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-xs mt-1"
      />
    </div>
  )
}
