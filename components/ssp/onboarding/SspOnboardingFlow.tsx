'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Placement } from '@prisma/client'
import {
  SspOnboardingStep1Schema,
  SspOnboardingStep2Schema,
  type SspOnboardingStep1Input,
  type SspOnboardingStep2Input,
} from './types'
import { StepSite } from './StepSite'
import { StepInventory } from './StepInventory'
import { StepIntegration } from './StepIntegration'
import { Stepper, type StepNum } from './Stepper'
import { FooterButtons } from './FooterButtons'

type SerializedPlacement = Pick<Placement, 'id' | 'width' | 'height' | 'format'>

interface Props {
  initial: {
    siteName: string
    primaryUrl: string
  }
  // Server-provided placement from a prior submit. When present we boot the
  // wizard straight into step 3 so the publisher sees the SDK snippet without
  // having to refill steps 1 + 2.
  resumePlacement?: SerializedPlacement | null
}

type Errors = Record<string, string>

interface SubmitResponse {
  placement: SerializedPlacement
}

export function SspOnboardingFlow({ initial, resumePlacement }: Props): React.JSX.Element {
  const router = useRouter()
  const [step, setStep] = useState<StepNum>(resumePlacement ? 3 : 1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [placement, setPlacement] = useState<SerializedPlacement | null>(
    resumePlacement ?? null,
  )

  const [s1, setS1] = useState<SspOnboardingStep1Input>({
    siteName: initial.siteName,
    primaryUrl: initial.primaryUrl,
    contactEmail: undefined,
    telegramHandle: undefined,
    discordHandle: undefined,
    inventoryCategory: 'DEFI',
  })

  const [s2, setS2] = useState<SspOnboardingStep2Input>({
    payoutWalletAddress: '',
    payoutChain: 'BASE',
    audienceChains: ['ETHEREUM'],
    adFormats: ['BANNER'],
    monthlyImpressions: '_100K_1M',
  })

  const handleNext = (): void => {
    const result = SspOnboardingStep1Schema.safeParse(s1)
    if (!result.success) {
      setErrors(flatten(result.error.flatten().fieldErrors))
      return
    }
    setErrors({})
    setStep(2)
  }

  const persistAndAdvance = async (): Promise<void> => {
    const result = SspOnboardingStep2Schema.safeParse(s2)
    if (!result.success) {
      setErrors(flatten(result.error.flatten().fieldErrors))
      return
    }
    setErrors({})
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/ssp/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s1, ...s2 }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setError(body?.error ?? 'Failed to save. Please try again.')
        setSubmitting(false)
        return
      }
      const body = (await res.json()) as SubmitResponse
      setPlacement(body.placement)
      setSubmitting(false)
      setStep(3)
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  const handleFinish = (): void => {
    router.push('/ssp/dashboard')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <Stepper step={step} />

      {error && (
        <div className="bg-[rgba(239,68,68,0.07)] border border-[rgba(239,68,68,0.18)] rounded-lg px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 1 && (
        <StepSite
          values={s1}
          errors={errors as Partial<Record<keyof SspOnboardingStep1Input, string>>}
          onChange={p => setS1(prev => ({ ...prev, ...p }))}
        />
      )}
      {step === 2 && (
        <StepInventory
          values={s2}
          errors={errors as Partial<Record<keyof SspOnboardingStep2Input, string>>}
          onChange={p => setS2(prev => ({ ...prev, ...p }))}
        />
      )}
      {step === 3 && placement && (
        <StepIntegration placement={placement} primaryUrl={s1.primaryUrl} />
      )}
      {step === 3 && !placement && (
        <div className="rounded-md border border-[#E0DEDB] bg-white px-4 py-3 text-sm text-[rgba(55,50,47,0.7)]">
          We couldn't find your placement. Go back to step 1 and resubmit to regenerate the SDK
          snippet.
        </div>
      )}

      <FooterButtons
        step={step}
        submitting={submitting}
        onBack={() => {
          setErrors({})
          setStep((prev) => (prev > 1 ? ((prev - 1) as StepNum) : prev))
        }}
        onNext={handleNext}
        onPersist={persistAndAdvance}
        onFinish={handleFinish}
      />
    </div>
  )
}

function flatten(field: Record<string, string[] | undefined>): Errors {
  const out: Errors = {}
  for (const [k, v] of Object.entries(field)) {
    if (v && v.length > 0) out[k] = v[0] as string
  }
  return out
}
