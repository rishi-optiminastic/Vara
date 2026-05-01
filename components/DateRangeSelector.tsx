"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarCheckIcon } from "@/icons"
import { DATE_RANGE_DAYS, DEFAULT_RANGE, parseRange, rangeLabel } from "@/lib/dateRange"

interface Props {
  className?: string
}

const FIELD =
  "h-8 py-0 text-xs leading-none rounded-full border border-[rgba(55,50,47,0.16)] bg-white/60 hover:bg-white transition-colors text-[#37322F] placeholder:text-muted-foreground shadow-[0_1px_0_rgba(255,255,255,0.6)] focus:ring-0 focus-visible:ring-0 focus-visible:border-[rgba(55,50,47,0.3)] md:text-xs"

export function DateRangeSelector({ className }: Props): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const value = String(parseRange(searchParams.get("range")))

  function setRange(v: string): void {
    const p = new URLSearchParams(searchParams.toString())
    if (Number(v) === DEFAULT_RANGE) p.delete("range")
    else p.set("range", v)
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <Select value={value} onValueChange={setRange}>
      <SelectTrigger className={`${FIELD} w-40 pl-2.5 pr-2 gap-1.5 ${className ?? ""}`}>
        <CalendarCheckIcon className="size-3 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {DATE_RANGE_DAYS.map((d) => (
          <SelectItem key={d} value={String(d)} className="text-xs">
            {rangeLabel(d)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
