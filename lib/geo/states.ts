export interface SubRegion {
  code: string
  name: string
  center: [number, number]
}

const US_STATES: SubRegion[] = [
  { code: "US-AL", name: "Alabama", center: [-86.8, 32.8] },
  { code: "US-AK", name: "Alaska", center: [-152, 64] },
  { code: "US-AZ", name: "Arizona", center: [-111.7, 34.2] },
  { code: "US-AR", name: "Arkansas", center: [-92.4, 34.9] },
  { code: "US-CA", name: "California", center: [-119.7, 36.8] },
  { code: "US-CO", name: "Colorado", center: [-105.5, 39.0] },
  { code: "US-CT", name: "Connecticut", center: [-72.7, 41.6] },
  { code: "US-DE", name: "Delaware", center: [-75.5, 39] },
  { code: "US-FL", name: "Florida", center: [-81.7, 27.8] },
  { code: "US-GA", name: "Georgia", center: [-83.4, 32.7] },
  { code: "US-HI", name: "Hawaii", center: [-156, 20.7] },
  { code: "US-ID", name: "Idaho", center: [-114.5, 44.2] },
  { code: "US-IL", name: "Illinois", center: [-89.4, 40] },
  { code: "US-IN", name: "Indiana", center: [-86.3, 39.8] },
  { code: "US-IA", name: "Iowa", center: [-93.5, 42] },
  { code: "US-KS", name: "Kansas", center: [-98.4, 38.5] },
  { code: "US-KY", name: "Kentucky", center: [-84.9, 37.7] },
  { code: "US-LA", name: "Louisiana", center: [-91.9, 31.1] },
  { code: "US-ME", name: "Maine", center: [-69.4, 45.4] },
  { code: "US-MD", name: "Maryland", center: [-76.8, 39] },
  { code: "US-MA", name: "Massachusetts", center: [-71.5, 42.2] },
  { code: "US-MI", name: "Michigan", center: [-84.5, 44.3] },
  { code: "US-MN", name: "Minnesota", center: [-94.6, 46.4] },
  { code: "US-MS", name: "Mississippi", center: [-89.7, 32.7] },
  { code: "US-MO", name: "Missouri", center: [-92.5, 38.5] },
  { code: "US-MT", name: "Montana", center: [-110, 46.9] },
  { code: "US-NE", name: "Nebraska", center: [-99.9, 41.5] },
  { code: "US-NV", name: "Nevada", center: [-116.4, 38.5] },
  { code: "US-NH", name: "New Hampshire", center: [-71.6, 43.5] },
  { code: "US-NJ", name: "New Jersey", center: [-74.5, 40.3] },
  { code: "US-NM", name: "New Mexico", center: [-106.2, 34.4] },
  { code: "US-NY", name: "New York", center: [-74.9, 42.7] },
  { code: "US-NC", name: "North Carolina", center: [-79.8, 35.6] },
  { code: "US-ND", name: "North Dakota", center: [-99.8, 47.5] },
  { code: "US-OH", name: "Ohio", center: [-82.8, 40.4] },
  { code: "US-OK", name: "Oklahoma", center: [-97.5, 35.6] },
  { code: "US-OR", name: "Oregon", center: [-122.1, 44.6] },
  { code: "US-PA", name: "Pennsylvania", center: [-77.2, 40.6] },
  { code: "US-RI", name: "Rhode Island", center: [-71.5, 41.7] },
  { code: "US-SC", name: "South Carolina", center: [-80.9, 33.9] },
  { code: "US-SD", name: "South Dakota", center: [-99.4, 44.3] },
  { code: "US-TN", name: "Tennessee", center: [-86.7, 35.8] },
  { code: "US-TX", name: "Texas", center: [-97.6, 31.1] },
  { code: "US-UT", name: "Utah", center: [-111.9, 40.2] },
  { code: "US-VT", name: "Vermont", center: [-72.7, 44.0] },
  { code: "US-VA", name: "Virginia", center: [-78.2, 37.8] },
  { code: "US-WA", name: "Washington", center: [-121.5, 47.4] },
  { code: "US-WV", name: "West Virginia", center: [-80.9, 38.5] },
  { code: "US-WI", name: "Wisconsin", center: [-89.6, 44.3] },
  { code: "US-WY", name: "Wyoming", center: [-107.3, 42.8] },
]

const IN_STATES: SubRegion[] = [
  { code: "IN-MH", name: "Maharashtra", center: [75.7, 19.8] },
  { code: "IN-DL", name: "Delhi", center: [77.1, 28.7] },
  { code: "IN-KA", name: "Karnataka", center: [75.7, 15.3] },
  { code: "IN-TN", name: "Tamil Nadu", center: [78.7, 11.1] },
  { code: "IN-WB", name: "West Bengal", center: [87.9, 22.9] },
  { code: "IN-UP", name: "Uttar Pradesh", center: [80.9, 26.9] },
  { code: "IN-GJ", name: "Gujarat", center: [71.2, 22.3] },
  { code: "IN-RJ", name: "Rajasthan", center: [74.2, 27.0] },
  { code: "IN-AP", name: "Andhra Pradesh", center: [79.7, 15.9] },
  { code: "IN-TG", name: "Telangana", center: [79.0, 17.7] },
  { code: "IN-KL", name: "Kerala", center: [76.3, 10.8] },
  { code: "IN-PB", name: "Punjab", center: [75.3, 31.1] },
  { code: "IN-HR", name: "Haryana", center: [76.1, 29.0] },
  { code: "IN-MP", name: "Madhya Pradesh", center: [78.7, 23.5] },
]

const CA_PROVINCES: SubRegion[] = [
  { code: "CA-ON", name: "Ontario", center: [-85, 50] },
  { code: "CA-QC", name: "Quebec", center: [-71, 52] },
  { code: "CA-BC", name: "British Columbia", center: [-125, 54] },
  { code: "CA-AB", name: "Alberta", center: [-115, 55] },
  { code: "CA-MB", name: "Manitoba", center: [-98, 55] },
  { code: "CA-SK", name: "Saskatchewan", center: [-106, 55] },
  { code: "CA-NS", name: "Nova Scotia", center: [-63, 45] },
  { code: "CA-NB", name: "New Brunswick", center: [-66, 46.5] },
  { code: "CA-NL", name: "Newfoundland", center: [-60, 53] },
  { code: "CA-PE", name: "Prince Edward Island", center: [-63, 46.5] },
]

const AU_STATES: SubRegion[] = [
  { code: "AU-NSW", name: "New South Wales", center: [147, -32] },
  { code: "AU-VIC", name: "Victoria", center: [144, -37] },
  { code: "AU-QLD", name: "Queensland", center: [144, -22] },
  { code: "AU-WA", name: "Western Australia", center: [122, -26] },
  { code: "AU-SA", name: "South Australia", center: [135, -30] },
  { code: "AU-TAS", name: "Tasmania", center: [147, -42] },
  { code: "AU-ACT", name: "ACT", center: [149, -35.5] },
  { code: "AU-NT", name: "Northern Territory", center: [133, -19] },
]

const DE_STATES: SubRegion[] = [
  { code: "DE-BE", name: "Berlin", center: [13.4, 52.5] },
  { code: "DE-BY", name: "Bavaria", center: [11.5, 48.8] },
  { code: "DE-NW", name: "North Rhine-Westphalia", center: [7.5, 51.4] },
  { code: "DE-HE", name: "Hesse", center: [9, 50.6] },
  { code: "DE-BW", name: "Baden-Württemberg", center: [9, 48.6] },
  { code: "DE-HH", name: "Hamburg", center: [10, 53.5] },
  { code: "DE-SN", name: "Saxony", center: [13, 51] },
]

const GB_REGIONS: SubRegion[] = [
  { code: "GB-ENG", name: "England", center: [-1.5, 52.5] },
  { code: "GB-SCT", name: "Scotland", center: [-4, 57] },
  { code: "GB-WLS", name: "Wales", center: [-3.7, 52.4] },
  { code: "GB-NIR", name: "Northern Ireland", center: [-6.5, 54.6] },
]

export const STATES_BY_COUNTRY: Record<string, SubRegion[]> = {
  US: US_STATES,
  IN: IN_STATES,
  CA: CA_PROVINCES,
  AU: AU_STATES,
  DE: DE_STATES,
  GB: GB_REGIONS,
}

export function statesForCountry(countryCode: string): SubRegion[] {
  return STATES_BY_COUNTRY[countryCode.toUpperCase()] ?? []
}

export function findState(stateCode: string): SubRegion | undefined {
  const country = stateCode.split("-")[0]
  if (!country) return undefined
  return statesForCountry(country).find((s) => s.code === stateCode)
}

export function countriesWithStates(): string[] {
  return Object.keys(STATES_BY_COUNTRY)
}
