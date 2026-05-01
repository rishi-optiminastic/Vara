"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type {
  Chain,
  CampaignStatus,
  CreativeFormat,
  DeviceType,
  Objective,
  Vertical,
  PricingModel,
  BidStrategy,
  Pacing,
} from "@prisma/client"
import { createCampaignWizard } from "@/services/campaigns"

export interface AdDraftForm {
  id: string
  name: string
  format: CreativeFormat
  clickUrl: string
  assetUrl: string
  walletConnectCta: boolean
}

export interface WizardState {
  name: string
  description: string
  vertical: Vertical
  objective: Objective
  status: CampaignStatus
  budgetUsd: string
  dailyCapUsd: string
  bidUsd: string
  pricingModel: PricingModel
  bidStrategy: BidStrategy
  pacing: Pacing
  startDate: string
  endDate: string
  chains: Chain[]
  geos: string
  deviceTypes: DeviceType[]
  freqCap: string
  freqHours: string
  brandSafety: string
  ads: AdDraftForm[]
}

export interface WizardHook {
  step: number
  furthestStep: number
  state: WizardState
  error: string
  loading: boolean
  update: (patch: Partial<WizardState>) => void
  next: () => void
  back: () => void
  goTo: (target: number) => void
  addAd: () => void
  removeAd: (id: string) => void
  updateAd: (id: string, patch: Partial<Omit<AdDraftForm, "id">>) => void
  submit: () => Promise<void>
}

const today = new Date().toISOString().slice(0, 10)

const INITIAL: WizardState = {
  name: "", description: "", vertical: "TOKEN_LAUNCH", objective: "AWARENESS", status: "DRAFT",
  budgetUsd: "1000", dailyCapUsd: "", bidUsd: "2.50",
  pricingModel: "CPM", bidStrategy: "MANUAL", pacing: "STANDARD",
  startDate: today, endDate: "",
  chains: [], geos: "", deviceTypes: [],
  freqCap: "", freqHours: "24", brandSafety: "",
  ads: [],
}

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

function validateStep(step: number, s: WizardState): string {
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

function buildPayload(s: WizardState): Parameters<typeof createCampaignWizard>[0] {
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

export function useCampaignWizard(): WizardHook {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [furthestStep, setFurthestStep] = useState(1)
  const [state, setState] = useState<WizardState>(INITIAL)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (patch: Partial<WizardState>): void =>
    setState((s) => ({ ...s, ...patch }))

  const next = (): void => {
    const err = validateStep(step, state)
    if (err) { setError(err); return }
    setError("")
    setStep((s) => {
      const ns = Math.min(s + 1, 5)
      setFurthestStep((f) => Math.max(f, ns))
      return ns
    })
  }

  const back = (): void => { setError(""); setStep((s) => Math.max(s - 1, 1)) }

  const goTo = (target: number): void => {
    if (target < 1 || target > 5) return
    if (target > furthestStep) return
    setError("")
    setStep(target)
  }

  const addAd = (): void => {
    if (state.ads.length >= 3) return
    const id = Math.random().toString(36).slice(2)
    const newAd: AdDraftForm = { id, name: `Ad ${state.ads.length + 1}`, format: "BANNER", clickUrl: "", assetUrl: "", walletConnectCta: false }
    update({ ads: [...state.ads, newAd] })
  }

  const removeAd = (id: string): void =>
    update({ ads: state.ads.filter((a) => a.id !== id) })

  const updateAd = (id: string, patch: Partial<Omit<AdDraftForm, "id">>): void =>
    update({ ads: state.ads.map((a) => (a.id === id ? { ...a, ...patch } : a)) })

  const submit = async (): Promise<void> => {
    setError("")
    setLoading(true)
    try {
      const { campaign } = await createCampaignWizard(buildPayload(state))
      router.push(`/dashboard/campaigns/${campaign.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign")
      setLoading(false)
    }
  }

  return { step, furthestStep, state, error, loading, update, next, back, goTo, addAd, removeAd, updateAd, submit }
}
