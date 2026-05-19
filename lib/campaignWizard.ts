import type { AdDraftForm, WizardState } from "@/hooks/useCampaignWizard"
import type { createCampaignWizard } from "@/services/campaigns"
import { selectionCount, type GeoSelection } from "@/lib/geo/encoding"
import { REGIONS } from "@/lib/geo/regions"

const today = new Date().toISOString().slice(0, 10)

const EMPTY_GEOS: GeoSelection = { regions: [], countries: [], states: [] }

export const INITIAL_WIZARD: WizardState = {
  name: "", description: "", vertical: "TOKEN_LAUNCH", objective: "AWARENESS", status: "DRAFT",
  budgetUsd: "1000", dailyCapUsd: "", bidUsd: "2.50",
  pricingModel: "CPM", bidStrategy: "MANUAL", pacing: "STANDARD",
  startDate: today, endDate: "",
  chains: [], geos: EMPTY_GEOS, deviceTypes: [],
  freqCap: "", freqHours: "24", brandSafety: "",
  ads: [],
}

export function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

export function validateStep(step: number, s: WizardState): string {
  if (step === 1 && s.name.trim().length < 2) return "Campaign name must be at least 2 characters"
  if (step === 2) {
    if (Number(s.budgetUsd) < 10) return "Budget must be at least $10"
    if (Number(s.bidUsd) < 0.1) return "Bid must be at least $0.10"
    if (!s.startDate) return "Start date is required"
    if (s.endDate && s.endDate <= s.startDate) return "End date must be after start date"
  }
  if (step === 4) {
    for (const ad of s.ads) {
      if (!ad.clickUrl || !isValidUrl(ad.clickUrl)) return `"${ad.name}" needs a valid Click URL`
      if (!ad.assetUrl || !isValidUrl(ad.assetUrl)) return `"${ad.name}" needs a valid Asset URL`
    }
  }
  return ""
}

function expandRegions(regions: string[]): string[] {
  const out = new Set<string>()
  for (const code of regions) {
    const r = REGIONS.find((reg) => reg.code === code)
    if (r) r.countries.forEach((c) => out.add(c))
  }
  return [...out]
}

function geosForApi(sel: GeoSelection): string[] {
  const countries = new Set<string>(sel.countries)
  expandRegions(sel.regions).forEach((c) => countries.add(c))
  for (const s of sel.states) {
    const parent = s.split("-")[0]
    if (parent) countries.add(parent)
  }
  return [...countries]
}

export function buildPayload(s: WizardState): Parameters<typeof createCampaignWizard>[0] {
  const parseList = (raw: string): string[] => raw.split(",").map((x) => x.trim()).filter(Boolean)
  return {
    name: s.name,
    description: s.description || undefined,
    vertical: s.vertical,
    objective: s.objective,
    status: s.status,
    pricingModel: s.pricingModel,
    bidStrategy: s.bidStrategy,
    pacing: s.pacing,
    budgetUsd: Number(s.budgetUsd),
    dailyCapUsd: s.dailyCapUsd ? Number(s.dailyCapUsd) : undefined,
    bidUsd: Number(s.bidUsd),
    startDate: new Date(s.startDate),
    endDate: s.endDate ? new Date(s.endDate) : undefined,
    frequencyCapPerWallet: s.freqCap ? Number(s.freqCap) : undefined,
    frequencyCapHours: s.freqCap && s.freqHours ? Number(s.freqHours) : undefined,
    brandSafetyKeywords: parseList(s.brandSafety),
    chains: s.chains,
    geos: geosForApi(s.geos),
    deviceTypes: s.deviceTypes,
    ads: s.ads.map(({ id: _id, ...ad }) => ad),
  }
}

export function adsValid(ads: AdDraftForm[]): boolean {
  if (ads.length === 0) return false
  return ads.every((a) => isValidUrl(a.clickUrl) && isValidUrl(a.assetUrl))
}

export function geoCount(sel: GeoSelection): number {
  return selectionCount(sel)
}
