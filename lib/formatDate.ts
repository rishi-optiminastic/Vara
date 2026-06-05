type DateInput = Date | string | number

/**
 * Coerce a value that may have been JSON-serialized (string/number) back into a
 * Date and format it. Returns "—" for missing or unparseable values.
 */
export function formatDate(value: DateInput | null | undefined): string {
  if (value === null || value === undefined) return "—"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
