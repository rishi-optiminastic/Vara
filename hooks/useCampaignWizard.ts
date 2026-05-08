"use client"

import { useEffect, useMemo, useState } from "react"
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
import { getTemplate } from "@/lib/campaignTemplates"
import { setupChecks, setupScore, type SetupCheck } from "@/lib/campaignSmart"
import {
  INITIAL_WIZARD,
  validateStep,
  buildPayload,
  adsValid,
  geoCount,
} from "@/lib/campaignWizard"
import { useWizardAutosave } from "@/hooks/useWizardAutosave"

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
  templateId: string
  savedAt: number | null
  saving: boolean
  checks: SetupCheck[]
  score: number
  hasDraft: boolean
  update: (patch: Partial<WizardState>) => void
  next: () => void
  back: () => void
  goTo: (target: number) => void
  addAd: () => void
  removeAd: (id: string) => void
  updateAd: (id: string, patch: Partial<Omit<AdDraftForm, "id">>) => void
  applyTemplate: (id: string) => void
  restoreDraft: () => void
  discardDraft: () => void
  submit: () => Promise<void>
}

function buildChecksInput(s: WizardState): Parameters<typeof setupChecks>[0] {
  return {
    name: s.name,
    description: s.description,
    budgetUsd: s.budgetUsd,
    bidUsd: s.bidUsd,
    startDate: s.startDate,
    chainsLen: s.chains.length,
    geosLen: geoCount(s.geos),
    deviceLen: s.deviceTypes.length,
    freqCap: s.freqCap,
    adsLen: s.ads.length,
    adsValid: adsValid(s.ads),
  }
}

export function useCampaignWizard(): WizardHook {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [furthestStep, setFurthestStep] = useState(1)
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [templateId, setTemplateId] = useState("")
  const [dirty, setDirty] = useState(false)
  const autosave = useWizardAutosave<WizardState>(state, dirty)
  const [hasDraft, setHasDraft] = useState(false)

  useEffect(() => {
    setHasDraft(autosave.load() !== null)
    // run once on mount only — checking persisted draft existence
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checks = useMemo(() => setupChecks(buildChecksInput(state)), [state])
  const score = useMemo(() => setupScore(checks), [checks])

  const update = (patch: Partial<WizardState>): void => {
    setDirty(true)
    setState((s) => ({ ...s, ...patch }))
  }

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
    const newAd: AdDraftForm = {
      id, name: `Ad ${state.ads.length + 1}`, format: "BANNER",
      clickUrl: "", assetUrl: "", walletConnectCta: false,
    }
    update({ ads: [...state.ads, newAd] })
  }

  const removeAd = (id: string): void => update({ ads: state.ads.filter((a) => a.id !== id) })

  const updateAd = (id: string, patch: Partial<Omit<AdDraftForm, "id">>): void =>
    update({ ads: state.ads.map((a) => (a.id === id ? { ...a, ...patch } : a)) })

  const applyTemplate = (id: string): void => {
    const t = getTemplate(id)
    if (!t) return
    setTemplateId(id)
    setDirty(true)
    setState((s) => ({
      ...s,
      vertical: t.vertical, objective: t.objective,
      pricingModel: t.pricingModel, bidStrategy: t.bidStrategy, pacing: t.pacing,
      budgetUsd: t.budgetUsd, dailyCapUsd: t.dailyCapUsd, bidUsd: t.bidUsd,
      chains: [...t.chains], geos: t.geos,
      deviceTypes: [...t.deviceTypes],
      freqCap: t.freqCap, freqHours: t.freqHours, brandSafety: t.brandSafety,
    }))
  }

  const restoreDraft = (): void => {
    const draft = autosave.load()
    if (!draft) return
    setDirty(true)
    setState(draft)
  }

  const discardDraft = (): void => autosave.clear()

  const submit = async (): Promise<void> => {
    setError("")
    setLoading(true)
    try {
      const { campaign } = await createCampaignWizard(buildPayload(state))
      autosave.clear()
      router.push(`/dashboard/campaigns/${campaign.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create campaign")
      setLoading(false)
    }
  }

  return {
    step, furthestStep, state, error, loading, templateId,
    savedAt: autosave.savedAt, saving: autosave.saving,
    checks, score, hasDraft,
    update, next, back, goTo, addAd, removeAd, updateAd,
    applyTemplate, restoreDraft, discardDraft, submit,
  }
}
