'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react'
import {
  OnboardingStep1Schema,
  OnboardingStep2Schema,
  type OnboardingStep1Input,
  type OnboardingStep2Input,
} from './types'
import { Step1Account } from './Step1Account'
import { Step2Wallet } from './Step2Wallet'

interface Props {
  initial: {
    projectName: string
    websiteUrl: string | null
  }
}

type Errors = Record<string, string>

export function OnboardingFlow({ initial }: Props): React.JSX.Element {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const [s1, setS1] = useState<OnboardingStep1Input>({
    projectName: initial.projectName,
    websiteUrl: initial.websiteUrl ?? undefined,
    contactEmail: undefined,
    telegramHandle: undefined,
    discordHandle: undefined,
    businessType: 'DEFI',
  })

  const [s2, setS2] = useState<OnboardingStep2Input>({
    primaryWalletAddress: '',
    supportedChains: ['ETHEREUM'],
    tokenContracts: [],
    nftContracts: [],
    treasuryWallets: [],
    campaignWallets: [],
  })

  const handleNext = (): void => {
    const result = OnboardingStep1Schema.safeParse(s1)
    if (!result.success) {
      setErrors(flatten(result.error.flatten().fieldErrors))
      return
    }
    setErrors({})
    setStep(2)
  }

  const handleSubmit = async (): Promise<void> => {
    const result = OnboardingStep2Schema.safeParse(s2)
    if (!result.success) {
      setErrors(flatten(result.error.flatten().fieldErrors))
      return
    }
    setErrors({})
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding', {
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
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Stepper step={step} />

      {error && (
        <div className="bg-[rgba(239,68,68,0.07)] border border-[rgba(239,68,68,0.18)] rounded-lg px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {step === 1 ? (
        <Step1Account
          values={s1}
          errors={errors as Partial<Record<keyof OnboardingStep1Input, string>>}
          onChange={p => setS1(prev => ({ ...prev, ...p }))}
        />
      ) : (
        <Step2Wallet
          values={s2}
          errors={errors as Partial<Record<keyof OnboardingStep2Input, string>>}
          onChange={p => setS2(prev => ({ ...prev, ...p }))}
        />
      )}

      <div className="flex items-center justify-between gap-3 pt-2">
        {step === 2 ? (
          <button
            type="button"
            onClick={() => {
              setErrors({})
              setStep(1)
            }}
            disabled={submitting}
            className="h-11 px-5 rounded-full border border-[#E0DEDB] bg-white text-sm font-medium text-[#37322F] hover:bg-[#FAFAF9] inline-flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft size={14} /> Back
          </button>
        ) : (
          <span />
        )}

        {step === 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="h-11 px-6 rounded-full bg-[#37322F] text-white text-sm font-medium inline-flex items-center gap-2 shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset,0_8px_20px_-6px_rgba(55,50,47,0.4)] hover:bg-[#2A2520] transition-all hover:-translate-y-px"
          >
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="h-11 px-6 rounded-full bg-[#37322F] text-white text-sm font-medium inline-flex items-center gap-2 shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset,0_8px_20px_-6px_rgba(55,50,47,0.4)] hover:bg-[#2A2520] disabled:opacity-50 transition-all hover:-translate-y-px"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Finishing…
              </>
            ) : (
              <>
                Finish setup <Check size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function Stepper({ step }: { step: 1 | 2 }): React.JSX.Element {
  const items = [
    { n: 1, label: 'Account' },
    { n: 2, label: 'Wallets & chains' },
  ]
  return (
    <div className="flex items-center gap-3">
      {items.map((it, i) => {
        const active = step === it.n
        const done = step > it.n
        return (
          <div key={it.n} className="flex items-center gap-3 flex-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold shrink-0 ${
                active
                  ? 'bg-[#37322F] text-white'
                  : done
                    ? 'bg-[#37322F] text-white'
                    : 'bg-white border border-[#E0DEDB] text-[rgba(55,50,47,0.5)]'
              }`}
            >
              {done ? <Check size={12} /> : it.n}
            </div>
            <span
              className={`text-xs font-medium ${
                active || done ? 'text-[#37322F]' : 'text-[rgba(55,50,47,0.5)]'
              }`}
            >
              {it.label}
            </span>
            {i === 0 && <div className="flex-1 h-px bg-[rgba(55,50,47,0.12)]" />}
          </div>
        )
      })}
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
