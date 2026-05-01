"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Chain, CampaignStatus, DeviceType, PricingModel, BidStrategy } from "@prisma/client"
import { createAdGroup } from "@/services/ad-groups"

export interface AdGroupFormState {
  campaignId: string
  name: string
  status: CampaignStatus
  bidUsd: string
  pricingModel: PricingModel
  bidStrategy: BidStrategy
  dailyCapUsd: string
  startDate: string
  endDate: string
  chains: Chain[]
  geos: string
  deviceTypes: DeviceType[]
}

export interface AdGroupFormHook {
  step: number
  furthestStep: number
  state: AdGroupFormState
  error: string
  loading: boolean
  update: (patch: Partial<AdGroupFormState>) => void
  next: () => void
  back: () => void
  goTo: (n: number) => void
  submit: () => Promise<void>
}

const INITIAL: AdGroupFormState = {
  campaignId: "",
  name: "",
  status: "DRAFT",
  bidUsd: "2.50",
  pricingModel: "CPM",
  bidStrategy: "MANUAL",
  dailyCapUsd: "",
  startDate: "",
  endDate: "",
  chains: [],
  geos: "",
  deviceTypes: [],
}

function validate(step: number, s: AdGroupFormState): string {
  if (step === 1) {
    if (!s.campaignId) return "Please select a campaign"
    if (s.name.trim().length < 2) return "Name must be at least 2 characters"
  }
  if (step === 2) {
    if (Number(s.bidUsd) < 0.1) return "Bid must be at least $0.10"
    if (s.endDate && s.startDate && s.endDate <= s.startDate) return "End date must be after start date"
  }
  return ""
}

function parseGeos(raw: string): string[] {
  return raw.split(/[\s,]+/).map((g) => g.trim().toUpperCase()).filter((g) => g.length === 2)
}

export function useAdGroupForm(defaultCampaignId = ""): AdGroupFormHook {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [furthestStep, setFurthestStep] = useState(1)
  const [state, setState] = useState<AdGroupFormState>({ ...INITIAL, campaignId: defaultCampaignId })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (patch: Partial<AdGroupFormState>): void =>
    setState((s) => ({ ...s, ...patch }))

  const next = (): void => {
    const err = validate(step, state)
    if (err) { setError(err); return }
    setError("")
    setStep((s) => { const ns = Math.min(s + 1, 2); setFurthestStep((f) => Math.max(f, ns)); return ns })
  }

  const back = (): void => { setError(""); setStep((s) => Math.max(s - 1, 1)) }

  const goTo = (target: number): void => {
    if (target < 1 || target > 2 || target > furthestStep) return
    setError("")
    setStep(target)
  }

  const submit = async (): Promise<void> => {
    const err = validate(step, state)
    if (err) { setError(err); return }
    setError("")
    setLoading(true)
    try {
      const { adGroup } = await createAdGroup({
        campaignId: state.campaignId,
        name: state.name,
        status: state.status,
        bidUsd: Number(state.bidUsd),
        pricingModel: state.pricingModel,
        bidStrategy: state.bidStrategy,
        dailyCapUsd: state.dailyCapUsd ? Number(state.dailyCapUsd) : undefined,
        startDate: state.startDate ? new Date(state.startDate) : undefined,
        endDate: state.endDate ? new Date(state.endDate) : undefined,
        chains: state.chains,
        geos: parseGeos(state.geos),
        deviceTypes: state.deviceTypes,
      })
      router.push(`/dashboard/ad-groups/${adGroup.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create ad group")
      setLoading(false)
    }
  }

  return { step, furthestStep, state, error, loading, update, next, back, goTo, submit }
}
