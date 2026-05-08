import type { AdDraftForm, WizardState } from "@/hooks/useCampaignWizard"
import type { createCampaignWizard } from "@/services/campaigns"

const today = new Date().toISOString().slice(0, 10)

export const INITIAL_WIZARD: WizardState = {
  name: "", description: "", vertical: "TOKEN_LAUNCH", objective: "AWARENESS", status: "DRAFT",
  budgetUsd: "1000", dailyCapUsd: "", bidUsd: "2.50",
  pricingModel: "CPM", bidStrategy: "MANUAL", pacing: "STANDARD",
  startDate: today, endDate: "",
  chains: [], geos: "", deviceTypes: [],
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

export function buildPayload(s: WizardState): Parameters<typeof createCampaignWizard>[0] {
  const parseList = (raw: string): string[] => raw.split(",").map((x) => x.trim()).filter(Boolean)
  const parseGeos = (raw: string): string[] =>
    raw.split(/[\s,]+/).map((g) => g.trim().toUpperCase()).filter((g) => g.length === 2)
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
    geos: parseGeos(s.geos),
    deviceTypes: s.deviceTypes,
    ads: s.ads.map(({ id: _id, ...ad }) => ad),
  }
}

export function adsValid(ads: AdDraftForm[]): boolean {
  if (ads.length === 0) return false
  return ads.every((a) => isValidUrl(a.clickUrl) && isValidUrl(a.assetUrl))
}

export function geoCount(raw: string): number {
  return raw.split(/[\s,]+/).map((g) => g.trim().toUpperCase()).filter((g) => g.length === 2).length
}
