"use client"

import dynamic from "next/dynamic"
import { useMemo, useState, useCallback } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RegionList, CountryList, StateList } from "./GeoPickerLists"
import { GeoChips } from "./GeoChips"
import { getRegion } from "@/lib/geo/regions"
import { getCountry } from "@/lib/geo/countries"
import { selectionCount, type GeoSelection } from "@/lib/geo/encoding"

const GeoMap = dynamic(() => import("./GeoMap").then((m) => m.GeoMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center rounded-md border border-[rgba(55,50,47,0.12)] bg-[#F0ECE6] text-[11px] text-muted-foreground">
      Loading map…
    </div>
  ),
})

interface Props {
  value: GeoSelection
  onChange: (next: GeoSelection) => void
}

type Tab = "regions" | "countries" | "states"

function toggleIn(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]
}

export function GeoTargetingDialog({ value, onChange }: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<GeoSelection>(value)
  const [tab, setTab] = useState<Tab>("countries")
  const [drillCountry, setDrillCountry] = useState<string>("")
  const [focus, setFocus] = useState<{ center: [number, number]; zoom: number } | null>(null)

  const reset = useCallback((): void => {
    setDraft(value)
    setTab("countries")
    setDrillCountry("")
    setFocus(null)
  }, [value])

  const apply = (): void => {
    onChange(draft)
    setOpen(false)
  }

  const onToggleRegion = (code: string): void => {
    const r = getRegion(code)
    if (r) setFocus({ center: r.center, zoom: r.zoom })
    setDraft((s) => ({ ...s, regions: toggleIn(s.regions, code) }))
  }
  const onToggleCountry = (code: string): void => {
    const c = getCountry(code)
    if (c) setFocus({ center: c.center, zoom: 3.5 })
    setDraft((s) => ({ ...s, countries: toggleIn(s.countries, code) }))
  }
  const onToggleState = (code: string): void =>
    setDraft((s) => ({ ...s, states: toggleIn(s.states, code) }))
  const onDrillCountry = (code: string): void => {
    setDrillCountry(code)
    setTab("states")
    const c = getCountry(code)
    if (c) setFocus({ center: c.center, zoom: 4 })
  }
  const clearAll = (): void => setDraft({ regions: [], countries: [], states: [] })

  const summary = useMemo(() => selectionCount(draft), [draft])

  return (
    <Dialog open={open} onOpenChange={(o) => { if (o) reset(); setOpen(o) }}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="w-full text-left rounded-md border border-dashed border-[rgba(55,50,47,0.24)] bg-white hover:bg-[#FAFAF8] hover:border-[#37322F] transition-colors px-3 py-2.5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <GeoChips selection={value} size="sm" emptyLabel="Click to add regions, countries, or states" />
            </div>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-[#37322F]">
              {selectionCount(value) > 0 ? "Edit" : "Add"}
            </span>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="!max-w-[1080px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b border-[rgba(55,50,47,0.1)]">
          <DialogTitle className="text-[13px] font-semibold text-[#37322F]">
            Geo targeting
          </DialogTitle>
          <p className="text-[11px] text-muted-foreground">
            Pick regions, individual countries, or drill into states. Click directly on the map to toggle a country.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-[300px_1fr] h-[560px]">
          <div className="border-r border-[rgba(55,50,47,0.1)] flex flex-col min-h-0 p-3">
            <Tabs current={tab} onChange={setTab} hasStates={!!drillCountry} />
            <div className="mt-3 flex-1 min-h-0">
              {tab === "regions" && (
                <RegionList selection={draft} onToggleRegion={onToggleRegion} />
              )}
              {tab === "countries" && (
                <CountryList
                  selection={draft}
                  onToggleCountry={onToggleCountry}
                  onDrillCountry={onDrillCountry}
                />
              )}
              {tab === "states" && drillCountry && (
                <StateList
                  selection={draft}
                  country={drillCountry}
                  onToggleState={onToggleState}
                  onBack={() => setTab("countries")}
                />
              )}
              {tab === "states" && !drillCountry && (
                <p className="text-[11px] text-muted-foreground italic px-2 py-3 text-center">
                  Open a country from the Countries tab to pick its states.
                </p>
              )}
            </div>
          </div>
          <div className="p-3">
            <GeoMap selection={draft} onToggleCountry={onToggleCountry} focus={focus} />
          </div>
        </div>

        <DialogFooter className="px-4 py-3 border-t border-[rgba(55,50,47,0.1)] flex !flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
              {summary === 0 ? "Worldwide" : `${summary} selected`}
            </span>
            {summary > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] text-muted-foreground hover:text-[#37322F] underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={apply}>
              Apply
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Tabs({ current, onChange, hasStates }: { current: Tab; onChange: (t: Tab) => void; hasStates: boolean }): React.JSX.Element {
  const tabs: { id: Tab; label: string; disabled?: boolean }[] = [
    { id: "regions", label: "Regions" },
    { id: "countries", label: "Countries" },
    { id: "states", label: "States", disabled: !hasStates },
  ]
  return (
    <div className="flex gap-1 border-b border-[rgba(55,50,47,0.08)]">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          disabled={t.disabled}
          onClick={() => onChange(t.id)}
          className={`px-2.5 py-1.5 text-[11px] font-medium border-b-2 -mb-px transition-colors ${
            current === t.id
              ? "border-[#37322F] text-[#37322F]"
              : t.disabled
                ? "border-transparent text-muted-foreground/40 cursor-not-allowed"
                : "border-transparent text-muted-foreground hover:text-[#37322F]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
