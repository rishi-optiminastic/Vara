const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", IN: "India", DE: "Germany",
  SG: "Singapore", FR: "France", JP: "Japan", KR: "South Korea",
  CA: "Canada", AU: "Australia", BR: "Brazil", MX: "Mexico",
  CN: "China", HK: "Hong Kong", TW: "Taiwan", ES: "Spain",
  IT: "Italy", NL: "Netherlands", SE: "Sweden", CH: "Switzerland",
  AE: "UAE", SA: "Saudi Arabia", ZA: "South Africa", AR: "Argentina",
  TR: "Turkey", PL: "Poland", PT: "Portugal", IE: "Ireland",
  NG: "Nigeria", KE: "Kenya", ID: "Indonesia", PH: "Philippines",
  TH: "Thailand", VN: "Vietnam", MY: "Malaysia", PK: "Pakistan",
  BD: "Bangladesh", RU: "Russia", UA: "Ukraine",
}

export function flagEmoji(code: string): string {
  const c = code.trim().toUpperCase()
  if (c.length !== 2) return ""
  const base = 0x1f1e6
  const a = c.charCodeAt(0) - 65
  const b = c.charCodeAt(1) - 65
  if (a < 0 || a > 25 || b < 0 || b > 25) return ""
  return String.fromCodePoint(base + a, base + b)
}

export function countryName(code: string): string {
  return COUNTRY_NAMES[code.trim().toUpperCase()] ?? code.toUpperCase()
}
