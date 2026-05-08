import type {
  Objective,
  PricingModel,
  BidStrategy,
  Pacing,
  CreativeFormat,
} from "@prisma/client"

export interface ObjectiveRecs {
  pricingModel: PricingModel
  bidStrategy: BidStrategy
  pacing: Pacing
  format: CreativeFormat
  rationale: string
}

const RECS: Record<Objective, ObjectiveRecs> = {
  AWARENESS: {
    pricingModel: "CPM",
    bidStrategy: "AUTO",
    pacing: "STANDARD",
    format: "BANNER",
    rationale: "Maximize impressions across the day at a predictable CPM.",
  },
  WALLET_CONNECTS: {
    pricingModel: "CPC",
    bidStrategy: "TARGET_CPA",
    pacing: "EVEN",
    format: "NATIVE",
    rationale: "Pay for clicks that lead to wallet connect events.",
  },
  ON_CHAIN_CONVERSION: {
    pricingModel: "CPA",
    bidStrategy: "MAX_CONVERSIONS",
    pacing: "STANDARD",
    format: "NATIVE",
    rationale: "Optimize for completed mints / swaps / stakes.",
  },
  TOKEN_HOLDERS: {
    pricingModel: "CPA",
    bidStrategy: "MAX_CONVERSIONS",
    pacing: "STANDARD",
    format: "NATIVE",
    rationale: "Acquire wallets that end up holding the token.",
  },
}

export function recommendationsFor(objective: Objective): ObjectiveRecs {
  return RECS[objective]
}

export interface ForecastInput {
  budgetUsd: number
  bidUsd: number
  pricingModel: PricingModel
  chainsCount: number
  geosCount: number
  deviceCount: number
  freqCap: number
}

export interface Forecast {
  impressions: number
  clicks: number
  conversions: number
  reach: number
  ctrPct: number
  cpa: number
  confidence: "low" | "medium" | "high"
}

const BASE_CTR = 0.018
const BASE_CONV_RATE = 0.045

function impressionsFromBudget(budget: number, bid: number, model: PricingModel): number {
  if (budget <= 0 || bid <= 0) return 0
  if (model === "CPM") return Math.round((budget / bid) * 1000)
  if (model === "CPC") return Math.round((budget / bid) / BASE_CTR)
  return Math.round((budget / bid) / (BASE_CTR * BASE_CONV_RATE))
}

function targetingMultiplier(chains: number, geos: number, devices: number): number {
  const c = chains === 0 ? 1 : Math.min(1, 0.55 + chains * 0.07)
  const g = geos === 0 ? 1 : Math.min(1, 0.5 + geos * 0.05)
  const d = devices === 0 ? 1 : devices === 1 ? 0.7 : 1
  return c * g * d
}

export function forecast(input: ForecastInput): Forecast {
  const rawImp = impressionsFromBudget(input.budgetUsd, input.bidUsd, input.pricingModel)
  const tMul = targetingMultiplier(input.chainsCount, input.geosCount, input.deviceCount)
  const impressions = Math.round(rawImp * tMul)
  const clicks = Math.round(impressions * BASE_CTR)
  const conversions = Math.round(clicks * BASE_CONV_RATE)
  const freqDivisor = input.freqCap > 0 ? input.freqCap : 5
  const reach = Math.round(impressions / freqDivisor)
  const ctrPct = impressions ? (clicks / impressions) * 100 : 0
  const cpa = conversions ? input.budgetUsd / conversions : 0
  const confidence = rawImp < 20000 ? "low" : rawImp > 250000 ? "high" : "medium"
  return { impressions, clicks, conversions, reach, ctrPct, cpa, confidence }
}

export interface SetupCheck {
  key: string
  label: string
  done: boolean
  step: number
}

export interface SetupChecksInput {
  name: string
  description: string
  budgetUsd: string
  bidUsd: string
  startDate: string
  chainsLen: number
  geosLen: number
  deviceLen: number
  freqCap: string
  adsLen: number
  adsValid: boolean
}

export function setupChecks(s: SetupChecksInput): SetupCheck[] {
  return [
    { key: "name", label: "Campaign name", done: s.name.trim().length >= 2, step: 1 },
    { key: "desc", label: "Description", done: s.description.trim().length > 0, step: 1 },
    { key: "budget", label: "Budget set", done: Number(s.budgetUsd) >= 10, step: 2 },
    { key: "bid", label: "Bid set", done: Number(s.bidUsd) >= 0.1, step: 2 },
    { key: "schedule", label: "Start date set", done: Boolean(s.startDate), step: 2 },
    { key: "chains", label: "Chains targeted", done: s.chainsLen > 0, step: 3 },
    { key: "geos", label: "Geos targeted", done: s.geosLen > 0, step: 3 },
    { key: "devices", label: "Devices set", done: s.deviceLen > 0, step: 3 },
    { key: "freq", label: "Frequency cap", done: Number(s.freqCap) > 0, step: 3 },
    { key: "ads", label: "At least 1 ad", done: s.adsLen > 0 && s.adsValid, step: 4 },
  ]
}

export function setupScore(checks: SetupCheck[]): number {
  if (checks.length === 0) return 0
  const done = checks.filter((c) => c.done).length
  return Math.round((done / checks.length) * 100)
}
