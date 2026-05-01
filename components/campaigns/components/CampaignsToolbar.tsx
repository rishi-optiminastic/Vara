"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchIcon, InboxArrowDownIcon } from "@/icons"

export interface CampaignCsvRow {
  name: string
  status: string
  vertical: string
  budget: string
  bid: string
  dailyCap: string
  pricingModel: string
  bidStrategy: string
  pacing: string
  startDate: string
  endDate: string
  creatives: string
  created: string
}

interface Props {
  totalCount: number
  filteredCount: number
  csvData: CampaignCsvRow[]
}

const CSV_HEADERS = [
  "Name", "Status", "Vertical", "Budget", "Bid", "Daily Cap",
  "Pricing Model", "Bid Strategy", "Pacing", "Start Date", "End Date",
  "Creatives", "Created",
]

function csvEscape(v: string): string {
  return `"${v.replace(/"/g, '""')}"`
}

export function CampaignsToolbar({ totalCount, filteredCount, csvData }: Props): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const status = searchParams.get("status") ?? "all"
  const vertical = searchParams.get("vertical") ?? "all"
  const sort = searchParams.get("sort") ?? "newest"
  const q = searchParams.get("q") ?? ""

  function buildParams(key: string, value: string): string {
    const p = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") p.set(key, value)
    else p.delete(key)
    return p.toString()
  }

  function setParam(key: string, value: string): void {
    router.replace(`${pathname}?${buildParams(key, value)}`)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const val = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const p = new URLSearchParams(searchParams.toString())
      if (val) p.set("q", val)
      else p.delete("q")
      router.replace(`${pathname}?${p.toString()}`)
    }, 350)
  }

  function exportCsv(): void {
    const rows = csvData.map((r) =>
      [r.name, r.status, r.vertical, r.budget, r.bid, r.dailyCap,
       r.pricingModel, r.bidStrategy, r.pacing, r.startDate, r.endDate,
       r.creatives, r.created].map(csvEscape).join(",")
    )
    const csv = [CSV_HEADERS.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `campaigns-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const FIELD_W = "w-40"
  const fieldBase =
    "h-8 py-0 text-xs leading-none rounded-full border border-[rgba(55,50,47,0.16)] bg-white/60 hover:bg-white transition-colors text-[#37322F] placeholder:text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.6)] focus:ring-0 focus-visible:ring-0 focus-visible:border-[rgba(55,50,47,0.3)] md:text-xs"

  return (
    <>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
        <Input
          ref={searchRef}
          defaultValue={q}
          onChange={handleSearchChange}
          placeholder="Search…"
          className={`${fieldBase} ${FIELD_W} pl-8 pr-3`}
        />
      </div>

      <Select value={status} onValueChange={(v) => setParam("status", v)}>
        <SelectTrigger className={`${fieldBase} ${FIELD_W} pl-3 pr-2 gap-1`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">All statuses</SelectItem>
          <SelectItem value="ACTIVE" className="text-xs">Active</SelectItem>
          <SelectItem value="PAUSED" className="text-xs">Paused</SelectItem>
          <SelectItem value="DRAFT" className="text-xs">Draft</SelectItem>
          <SelectItem value="ENDED" className="text-xs">Ended</SelectItem>
        </SelectContent>
      </Select>

      <Select value={vertical} onValueChange={(v) => setParam("vertical", v)}>
        <SelectTrigger className={`${fieldBase} ${FIELD_W} pl-3 pr-2 gap-1`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">All verticals</SelectItem>
          <SelectItem value="TOKEN_LAUNCH" className="text-xs">Token Launch</SelectItem>
          <SelectItem value="NFT_DROP" className="text-xs">NFT Drop</SelectItem>
          <SelectItem value="DEFI" className="text-xs">DeFi</SelectItem>
          <SelectItem value="DAPP_GROWTH" className="text-xs">dApp Growth</SelectItem>
          <SelectItem value="OTHER" className="text-xs">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => setParam("sort", v)}>
        <SelectTrigger className={`${fieldBase} ${FIELD_W} pl-3 pr-2 gap-1`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest" className="text-xs">Newest first</SelectItem>
          <SelectItem value="oldest" className="text-xs">Oldest first</SelectItem>
          <SelectItem value="budget_desc" className="text-xs">Budget ↓</SelectItem>
          <SelectItem value="budget_asc" className="text-xs">Budget ↑</SelectItem>
          <SelectItem value="name_asc" className="text-xs">Name A–Z</SelectItem>
        </SelectContent>
      </Select>

      <div className="mx-1 h-5 w-px bg-[rgba(55,50,47,0.12)]" aria-hidden />

      <Button
        variant="outline"
        size="sm"
        onClick={exportCsv}
        className={`${fieldBase} gap-1.5 px-3.5`}
      >
        <InboxArrowDownIcon className="size-3" />
        Export
      </Button>
    </>
  )
}
