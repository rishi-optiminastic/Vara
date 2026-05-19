export interface Region {
  code: string
  name: string
  countries: string[]
  center: [number, number]
  zoom: number
}

export const REGIONS: Region[] = [
  {
    code: "NAM",
    name: "North America",
    countries: ["US", "CA", "MX"],
    center: [-100, 45],
    zoom: 2.4,
  },
  {
    code: "LATAM",
    name: "Latin America",
    countries: ["BR", "AR", "CL", "CO", "PE", "VE", "EC", "BO", "PY", "UY", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU"],
    center: [-60, -15],
    zoom: 2.4,
  },
  {
    code: "EMEA",
    name: "Europe & MEA",
    countries: ["GB", "FR", "DE", "IT", "ES", "NL", "BE", "SE", "NO", "DK", "FI", "IE", "PT", "AT", "CH", "PL", "CZ", "HU", "RO", "GR", "TR", "UA", "RU", "AE", "SA", "IL", "EG", "ZA", "NG", "KE", "MA"],
    center: [20, 45],
    zoom: 2.2,
  },
  {
    code: "APAC",
    name: "Asia-Pacific",
    countries: ["IN", "CN", "JP", "KR", "ID", "PH", "TH", "VN", "MY", "SG", "HK", "TW", "PK", "BD", "AU", "NZ"],
    center: [110, 20],
    zoom: 2.2,
  },
  {
    code: "OCE",
    name: "Oceania",
    countries: ["AU", "NZ", "FJ", "PG"],
    center: [145, -25],
    zoom: 3,
  },
]

export function getRegion(code: string): Region | undefined {
  return REGIONS.find((r) => r.code === code)
}

export function regionsForCountry(countryCode: string): Region[] {
  return REGIONS.filter((r) => r.countries.includes(countryCode))
}
