"use client"

import { flagEmoji } from "@/lib/geoFlag"
import { getCountry } from "@/lib/geo/countries"
import { getRegion } from "@/lib/geo/regions"
import { findState } from "@/lib/geo/states"
import type { GeoSelection } from "@/lib/geo/encoding"

type Size = "sm" | "md"

interface ChipProps {
  label: string
  hint?: string
  emoji?: string
  tone: "region" | "country" | "state"
  size: Size
  onRemove?: () => void
}

const TONE: Record<ChipProps["tone"], string> = {
  region: "bg-[#ECEAE2] text-[#1F40CD] border-[rgba(10,10,10,0.12)]",
  country: "bg-white text-[#0A0A0A] border-[rgba(10,10,10,0.16)]",
  state: "bg-[#ECEAE2] text-[#1F40CD] border-[rgba(10,10,10,0.12)]",
}

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-5 px-1.5 gap-1 text-[10px]",
  md: "h-6 px-2 gap-1.5 text-[11px]",
}

function Chip({ label, hint, emoji, tone, size, onRemove }: ChipProps): React.JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full border ${TONE[tone]} ${SIZE_CLASS[size]} font-medium tabular-nums`}
      title={hint ?? label}
    >
      {emoji && <span aria-hidden>{emoji}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 -mr-0.5 size-3.5 inline-flex items-center justify-center rounded-full hover:bg-black/10 text-[9px]"
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  )
}

interface Props {
  selection: GeoSelection
  size?: Size
  onRemoveRegion?: (code: string) => void
  onRemoveCountry?: (code: string) => void
  onRemoveState?: (code: string) => void
  emptyLabel?: string
}

export function GeoChips({
  selection,
  size = "md",
  onRemoveRegion,
  onRemoveCountry,
  onRemoveState,
  emptyLabel,
}: Props): React.JSX.Element {
  const total = selection.regions.length + selection.countries.length + selection.states.length
  if (total === 0) {
    return (
      <p className="text-[10px] text-muted-foreground/60 italic">
        {emptyLabel ?? "Worldwide"}
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {selection.regions.map((code) => {
        const r = getRegion(code)
        return (
          <Chip
            key={`r-${code}`}
            label={r?.name ?? code}
            hint={`Region · ${r?.countries.length ?? 0} countries`}
            tone="region"
            size={size}
            {...(onRemoveRegion ? { onRemove: () => onRemoveRegion(code) } : {})}
          />
        )
      })}
      {selection.countries.map((code) => (
        <Chip
          key={`c-${code}`}
          label={code}
          hint={getCountry(code)?.name ?? code}
          emoji={flagEmoji(code)}
          tone="country"
          size={size}
          {...(onRemoveCountry ? { onRemove: () => onRemoveCountry(code) } : {})}
        />
      ))}
      {selection.states.map((code) => {
        const s = findState(code)
        const parent = code.split("-")[0] ?? ""
        return (
          <Chip
            key={`s-${code}`}
            label={s?.name ?? code}
            hint={`${s?.name ?? code} · ${parent}`}
            emoji={flagEmoji(parent)}
            tone="state"
            size={size}
            {...(onRemoveState ? { onRemove: () => onRemoveState(code) } : {})}
          />
        )
      })}
    </div>
  )
}
