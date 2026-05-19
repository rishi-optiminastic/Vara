export interface GeoSelection {
  regions: string[]
  countries: string[]
  states: string[]
}

const REGION_PREFIX = "R:"

export function encodeGeos(sel: GeoSelection): string[] {
  return [
    ...sel.regions.map((r) => `${REGION_PREFIX}${r}`),
    ...sel.countries,
    ...sel.states,
  ]
}

export function decodeGeos(encoded: string[]): GeoSelection {
  const regions: string[] = []
  const countries: string[] = []
  const states: string[] = []
  for (const raw of encoded) {
    const v = raw.trim().toUpperCase()
    if (!v) continue
    if (v.startsWith(REGION_PREFIX)) {
      regions.push(v.slice(REGION_PREFIX.length))
    } else if (v.includes("-")) {
      states.push(v)
    } else if (v.length === 2) {
      countries.push(v)
    }
  }
  return { regions, countries, states }
}

export function isEmpty(sel: GeoSelection): boolean {
  return sel.regions.length === 0 && sel.countries.length === 0 && sel.states.length === 0
}

export function selectionCount(sel: GeoSelection): number {
  return sel.regions.length + sel.countries.length + sel.states.length
}
