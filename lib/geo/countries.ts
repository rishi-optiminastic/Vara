export interface Country {
  code: string
  name: string
  center: [number, number]
}

export const COUNTRIES: Country[] = [
  { code: "US", name: "United States", center: [-98, 39] },
  { code: "CA", name: "Canada", center: [-106, 56] },
  { code: "MX", name: "Mexico", center: [-102, 23] },
  { code: "BR", name: "Brazil", center: [-53, -10] },
  { code: "AR", name: "Argentina", center: [-64, -38] },
  { code: "CL", name: "Chile", center: [-71, -35] },
  { code: "CO", name: "Colombia", center: [-74, 4] },
  { code: "PE", name: "Peru", center: [-75, -10] },
  { code: "VE", name: "Venezuela", center: [-66, 7] },
  { code: "EC", name: "Ecuador", center: [-78, -1] },
  { code: "BO", name: "Bolivia", center: [-65, -17] },
  { code: "PY", name: "Paraguay", center: [-58, -23] },
  { code: "UY", name: "Uruguay", center: [-56, -33] },
  { code: "CR", name: "Costa Rica", center: [-84, 10] },
  { code: "PA", name: "Panama", center: [-80, 9] },
  { code: "GT", name: "Guatemala", center: [-90, 15] },
  { code: "HN", name: "Honduras", center: [-86, 15] },
  { code: "SV", name: "El Salvador", center: [-88, 13] },
  { code: "NI", name: "Nicaragua", center: [-85, 13] },
  { code: "DO", name: "Dominican Republic", center: [-70, 19] },
  { code: "CU", name: "Cuba", center: [-77, 21] },
  { code: "GB", name: "United Kingdom", center: [-2, 54] },
  { code: "FR", name: "France", center: [2, 46] },
  { code: "DE", name: "Germany", center: [10, 51] },
  { code: "IT", name: "Italy", center: [12, 42] },
  { code: "ES", name: "Spain", center: [-3, 40] },
  { code: "NL", name: "Netherlands", center: [5, 52] },
  { code: "BE", name: "Belgium", center: [4, 50] },
  { code: "SE", name: "Sweden", center: [15, 62] },
  { code: "NO", name: "Norway", center: [9, 61] },
  { code: "DK", name: "Denmark", center: [10, 56] },
  { code: "FI", name: "Finland", center: [25, 64] },
  { code: "IE", name: "Ireland", center: [-8, 53] },
  { code: "PT", name: "Portugal", center: [-8, 39] },
  { code: "AT", name: "Austria", center: [14, 47] },
  { code: "CH", name: "Switzerland", center: [8, 46] },
  { code: "PL", name: "Poland", center: [19, 52] },
  { code: "CZ", name: "Czechia", center: [15, 50] },
  { code: "HU", name: "Hungary", center: [19, 47] },
  { code: "RO", name: "Romania", center: [25, 46] },
  { code: "GR", name: "Greece", center: [22, 39] },
  { code: "TR", name: "Turkey", center: [35, 39] },
  { code: "UA", name: "Ukraine", center: [32, 49] },
  { code: "RU", name: "Russia", center: [100, 61] },
  { code: "AE", name: "UAE", center: [54, 24] },
  { code: "SA", name: "Saudi Arabia", center: [45, 24] },
  { code: "IL", name: "Israel", center: [35, 31] },
  { code: "EG", name: "Egypt", center: [30, 27] },
  { code: "ZA", name: "South Africa", center: [24, -29] },
  { code: "NG", name: "Nigeria", center: [8, 10] },
  { code: "KE", name: "Kenya", center: [38, 0] },
  { code: "MA", name: "Morocco", center: [-7, 32] },
  { code: "IN", name: "India", center: [78, 22] },
  { code: "CN", name: "China", center: [105, 36] },
  { code: "JP", name: "Japan", center: [138, 36] },
  { code: "KR", name: "South Korea", center: [128, 36] },
  { code: "ID", name: "Indonesia", center: [120, -2] },
  { code: "PH", name: "Philippines", center: [122, 12] },
  { code: "TH", name: "Thailand", center: [101, 15] },
  { code: "VN", name: "Vietnam", center: [108, 16] },
  { code: "MY", name: "Malaysia", center: [102, 4] },
  { code: "SG", name: "Singapore", center: [104, 1.3] },
  { code: "HK", name: "Hong Kong", center: [114, 22] },
  { code: "TW", name: "Taiwan", center: [121, 24] },
  { code: "PK", name: "Pakistan", center: [70, 30] },
  { code: "BD", name: "Bangladesh", center: [90, 24] },
  { code: "AU", name: "Australia", center: [134, -25] },
  { code: "NZ", name: "New Zealand", center: [172, -41] },
  { code: "FJ", name: "Fiji", center: [178, -17] },
  { code: "PG", name: "Papua New Guinea", center: [145, -6] },
]

const COUNTRY_INDEX: Record<string, Country> = COUNTRIES.reduce<Record<string, Country>>((acc, c) => {
  acc[c.code] = c
  return acc
}, {})

export function getCountry(code: string): Country | undefined {
  return COUNTRY_INDEX[code.toUpperCase()]
}

export function countryNameOf(code: string): string {
  return getCountry(code)?.name ?? code.toUpperCase()
}
