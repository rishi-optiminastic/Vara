"use client"

import { useMemo, useState } from "react"
import { flagEmoji } from "@/lib/geoFlag"
import { COUNTRIES } from "@/lib/geo/countries"
import { REGIONS } from "@/lib/geo/regions"
import { statesForCountry, countriesWithStates } from "@/lib/geo/states"
import type { GeoSelection } from "@/lib/geo/encoding"

interface RowProps {
  label: string
  meta?: string
  flag?: string
  active: boolean
  onClick: () => void
  onSecondary?: () => void
  secondaryLabel?: string
}

function Row({ label, meta, flag, active, onClick, onSecondary, secondaryLabel }: RowProps): React.JSX.Element {
  return (
    <div
      className={`group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[11px] cursor-pointer ${
        active ? "bg-[#1F40CD] text-white" : "hover:bg-[#ECEAE2] text-[#0A0A0A]"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 min-w-0">
        {flag && <span aria-hidden className="text-[13px] leading-none">{flag}</span>}
        <span className="truncate font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {meta && (
          <span className={`text-[10px] tabular-nums ${active ? "text-[#FFFFFF]/70" : "text-muted-foreground"}`}>
            {meta}
          </span>
        )}
        {onSecondary && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onSecondary()
            }}
            className={`opacity-0 group-hover:opacity-100 rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide border ${
              active
                ? "border-white/30 text-[#FFFFFF] hover:bg-white/10"
                : "border-[rgba(10,10,10,0.2)] text-[#0A0A0A] hover:bg-white"
            }`}
          >
            {secondaryLabel ?? "Open"}
          </button>
        )}
      </div>
    </div>
  )
}

interface ListProps {
  selection: GeoSelection
  onToggleRegion: (code: string) => void
  onToggleCountry: (code: string) => void
  onToggleState: (code: string) => void
  onDrillCountry: (code: string) => void
}

export function RegionList({ selection, onToggleRegion }: Pick<ListProps, "selection" | "onToggleRegion">): React.JSX.Element {
  return (
    <div className="space-y-0.5">
      {REGIONS.map((r) => (
        <Row
          key={r.code}
          label={r.name}
          meta={`${r.countries.length}`}
          active={selection.regions.includes(r.code)}
          onClick={() => onToggleRegion(r.code)}
        />
      ))}
    </div>
  )
}

export function CountryList({
  selection, onToggleCountry, onDrillCountry,
}: Pick<ListProps, "selection" | "onToggleCountry" | "onDrillCountry">): React.JSX.Element {
  const [q, setQ] = useState("")
  const drillable = useMemo(() => new Set(countriesWithStates()), [])
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return COUNTRIES
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(t) || c.code.toLowerCase().includes(t))
  }, [q])

  return (
    <div className="flex flex-col h-full min-h-0">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search countries…"
        className="mb-2 h-7 w-full rounded-md border border-[rgba(10,10,10,0.16)] bg-white px-2 text-[11px] placeholder:text-muted-foreground/60 focus:outline-none focus:border-[#0A0A0A]"
      />
      <div className="flex-1 overflow-y-auto pr-1 space-y-0.5">
        {list.map((c) => {
          const active = selection.countries.includes(c.code)
          const props: RowProps = {
            label: c.name,
            meta: c.code,
            flag: flagEmoji(c.code),
            active,
            onClick: () => onToggleCountry(c.code),
          }
          if (drillable.has(c.code)) {
            props.onSecondary = () => onDrillCountry(c.code)
            props.secondaryLabel = "States"
          }
          return <Row key={c.code} {...props} />
        })}
        {list.length === 0 && (
          <p className="text-[10px] text-muted-foreground italic px-2 py-3 text-center">No matches</p>
        )}
      </div>
    </div>
  )
}

interface StateListProps {
  selection: GeoSelection
  country: string
  onToggleState: (code: string) => void
  onBack: () => void
}

export function StateList({ selection, country, onToggleState, onBack }: StateListProps): React.JSX.Element {
  const states = statesForCountry(country)
  return (
    <div className="flex flex-col h-full min-h-0">
      <button
        type="button"
        onClick={onBack}
        className="mb-2 h-7 inline-flex items-center gap-1.5 self-start rounded-md px-2 text-[11px] text-[#0A0A0A] hover:bg-[#ECEAE2]"
      >
        <span aria-hidden>←</span> Back to countries
      </button>
      <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {country} · {states.length} subdivisions
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-0.5">
        {states.map((s) => (
          <Row
            key={s.code}
            label={s.name}
            meta={s.code.split("-")[1] ?? ""}
            active={selection.states.includes(s.code)}
            onClick={() => onToggleState(s.code)}
          />
        ))}
        {states.length === 0 && (
          <p className="text-[10px] text-muted-foreground italic px-2 py-3 text-center">
            No subdivisions available for {country}
          </p>
        )}
      </div>
    </div>
  )
}
