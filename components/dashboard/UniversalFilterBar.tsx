"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition } from "react"
import type { CampaignStatus } from "@prisma/client"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { ScopeDropdown, FilterChip, STATUS_DOT, type ScopeItem } from "./UniversalFilterBar.parts"

const STATUS_OPTIONS: { value: CampaignStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "DRAFT", label: "Draft" },
  { value: "ENDED", label: "Ended" },
]

interface Props {
  campaigns: ScopeItem[]
  adGroups: ScopeItem[]
  selectedStatuses: CampaignStatus[]
  selectedCampaignId: string | null
  selectedAdGroupId: string | null
}

const ALL = "__all__"

export function UniversalFilterBar({
  campaigns,
  adGroups,
  selectedStatuses,
  selectedCampaignId,
  selectedAdGroupId,
}: Props): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const pushParams = (mutate: (sp: URLSearchParams) => void): void => {
    const sp = new URLSearchParams(searchParams?.toString() ?? "")
    mutate(sp)
    startTransition(() => {
      const qs = sp.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  const toggleStatus = (status: CampaignStatus): void => {
    const next = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status]
    pushParams((sp) => {
      if (next.length === 0) sp.delete("status")
      else sp.set("status", next.join(","))
    })
  }

  const setParam = (key: string, value: string, alsoClear?: string): void => {
    pushParams((sp) => {
      if (value === ALL) sp.delete(key)
      else sp.set(key, value)
      if (alsoClear) sp.delete(alsoClear)
    })
  }

  const clearAll = (): void => {
    pushParams((sp) => { sp.delete("status"); sp.delete("campaign"); sp.delete("adGroup") })
  }

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId)
  const activeAdGroup = adGroups.find((g) => g.id === selectedAdGroupId)
  const hasFilters =
    selectedStatuses.length > 0 || selectedCampaignId !== null || selectedAdGroupId !== null

  const statusLabel =
    selectedStatuses.length === 0
      ? "All"
      : selectedStatuses.length === 1
      ? STATUS_OPTIONS.find((o) => o.value === selectedStatuses[0])?.label ?? "—"
      : `${selectedStatuses.length} selected`

  return (
    <div className={`flex flex-wrap items-center gap-2 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <span className="text-[9.5px] font-semibold uppercase tracking-widest text-[#0A0A0A]/45">Filter</span>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors ${
              selectedStatuses.length > 0
                ? "border-[#1F40CD] bg-[#1F40CD]/8 text-[#1F40CD]"
                : "border-[rgba(10,10,10,0.18)] bg-white text-[#0A0A0A] hover:border-[rgba(10,10,10,0.32)]"
            }`}
          >
            <span className="text-[9.5px] font-semibold uppercase tracking-widest opacity-70">Status</span>
            <span className="tabular-nums">{statusLabel}</span>
            <ChevronDown className="size-3 opacity-60" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-44 p-1">
          {STATUS_OPTIONS.map((opt) => {
            const checked = selectedStatuses.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleStatus(opt.value)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-[11px] hover:bg-[#0A0A0A]/[0.04]"
              >
                <Checkbox checked={checked} className="size-3.5 rounded-[3px]" />
                <span className={`size-[6px] rounded-full ${STATUS_DOT[opt.value]}`} aria-hidden />
                <span className={checked ? "font-medium text-[#0A0A0A]" : "text-[#0A0A0A]/75"}>{opt.label}</span>
              </button>
            )
          })}
        </PopoverContent>
      </Popover>

      <ScopeDropdown
        label="Campaign"
        value={selectedCampaignId}
        placeholder="All"
        items={campaigns}
        onChange={(v) => setParam("campaign", v, "adGroup")}
      />

      <ScopeDropdown
        label="Ad group"
        value={selectedAdGroupId}
        placeholder={activeCampaign ? "All" : "Pick a campaign"}
        items={adGroups}
        disabled={!activeCampaign}
        onChange={(v) => setParam("adGroup", v)}
      />

      {hasFilters && (
        <>
          <span aria-hidden className="mx-1 h-4 w-px bg-[rgba(10,10,10,0.12)]" />
          <div className="flex flex-wrap items-center gap-1.5">
            {selectedStatuses.map((s) => (
              <FilterChip key={s} dot={STATUS_DOT[s]} onRemove={() => toggleStatus(s)}>
                {STATUS_OPTIONS.find((o) => o.value === s)?.label}
              </FilterChip>
            ))}
            {activeCampaign && (
              <FilterChip dot={STATUS_DOT[activeCampaign.status]} onRemove={() => setParam("campaign", ALL, "adGroup")}>
                {activeCampaign.name}
              </FilterChip>
            )}
            {activeAdGroup && (
              <FilterChip dot={STATUS_DOT[activeAdGroup.status]} onRemove={() => setParam("adGroup", ALL)}>
                {activeAdGroup.name}
              </FilterChip>
            )}
          </div>
          <button
            type="button"
            onClick={clearAll}
            className="text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A]/55 hover:text-[#1F40CD] transition-colors"
          >
            Clear all
          </button>
        </>
      )}
    </div>
  )
}
