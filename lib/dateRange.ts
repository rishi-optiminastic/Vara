export const DATE_RANGE_DAYS = [7, 14, 30, 90] as const
export type DateRangeDays = (typeof DATE_RANGE_DAYS)[number]

export const DEFAULT_RANGE: DateRangeDays = 30

export function parseRange(value: string | undefined | null): DateRangeDays {
  const n = Number(value)
  return (DATE_RANGE_DAYS as readonly number[]).includes(n) ? (n as DateRangeDays) : DEFAULT_RANGE
}

export function rangeSinceDate(days: DateRangeDays, from: Date = new Date()): Date {
  const d = new Date(from)
  d.setDate(d.getDate() - days)
  return d
}

export function rangeLabel(days: DateRangeDays): string {
  return `Last ${days} days`
}

export function rangeShortLabel(days: DateRangeDays): string {
  return `${days}d`
}
