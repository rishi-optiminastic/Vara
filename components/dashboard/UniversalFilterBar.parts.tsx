"use client"

import type { CampaignStatus } from "@prisma/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const STATUS_DOT: Record<CampaignStatus, string> = {
  ACTIVE: "bg-emerald-500",
  PAUSED: "bg-amber-500",
  DRAFT: "bg-[#0A0A0A]/45",
  ENDED: "bg-[#0A0A0A]/30",
}

export interface ScopeItem {
  id: string
  name: string
  status: CampaignStatus
}

const ALL = "__all__"

interface DropdownProps {
  label: string
  value: string | null
  placeholder: string
  items: ScopeItem[]
  onChange: (value: string) => void
  disabled?: boolean
}

export function ScopeDropdown({ label, value, placeholder, items, onChange, disabled }: DropdownProps): React.JSX.Element {
  const active = !!value && !disabled
  const triggerClass = active
    ? "border-[#1F40CD] bg-[#1F40CD]/8 text-[#1F40CD]"
    : disabled
    ? "border-[rgba(10,10,10,0.14)] bg-[#0A0A0A]/[0.02] text-muted-foreground/60"
    : "border-[rgba(10,10,10,0.18)] bg-white text-[#0A0A0A] hover:border-[rgba(10,10,10,0.32)]"
  const activeItem = items.find((it) => it.id === value)
  return (
    <Select value={value ?? ALL} onValueChange={onChange} disabled={disabled ?? false}>
      <SelectTrigger className={`h-7 max-w-[220px] rounded-full px-3 gap-1.5 border text-[11px] font-medium focus:ring-0 focus:outline-none ${triggerClass}`}>
        <span className="text-[9.5px] font-semibold uppercase tracking-widest opacity-70">{label}</span>
        <SelectValue placeholder={placeholder}>
          {activeItem ? activeItem.name : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[320px]" align="start">
        <SelectItem value={ALL} className="text-[11px]">
          All<span className="ml-1.5 text-[10px] text-muted-foreground">({items.length})</span>
        </SelectItem>
        {items.map((it) => (
          <SelectItem key={it.id} value={it.id} className="text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <span className={`size-[6px] rounded-full ${STATUS_DOT[it.status]}`} aria-hidden />
              {it.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface ChipProps {
  dot: string
  children: React.ReactNode
  onRemove: () => void
}

export function FilterChip({ dot, children, onRemove }: ChipProps): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1F40CD]/8 pl-1.5 pr-0.5 py-0.5 text-[10px] font-medium text-[#1F40CD]">
      <span className={`size-[5px] rounded-full ${dot}`} aria-hidden />
      <span className="max-w-[160px] truncate">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove filter"
        className="inline-flex size-3.5 items-center justify-center rounded-full text-[#1F40CD]/70 hover:bg-[#1F40CD]/15 hover:text-[#1F40CD]"
      >
        <span aria-hidden className="text-[11px] leading-none">×</span>
      </button>
    </span>
  )
}
