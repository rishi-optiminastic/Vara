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
import { Stepper, type StepDef } from './Stepper'

interface Props {
  initial: {
    projectName: string
    websiteUrl: string | null
  }
}

type Errors = Record<string, string>

const STEPS: StepDef[] = [
  { id: 0, label: 'Create account', description: 'Email or Google', done: true },
  { id: 1, label: 'Workspace', description: 'Project & contact info' },
  { id: 2, label: 'Wallets & chains', description: 'Settlement and attribution' },
]

interface StepCopy {
  eyebrow: string
  accent: string
  rest: string
  lede: string
}

const TITLES: Record<1 | 2, StepCopy> = {
  1: {
    eyebrow: 'Step 1 of 2',
    accent: 'About',
    rest: 'your workspace',
    lede: 'A couple of details so we can target the right wallets and keep your campaigns clean.',
  },
  2: {
    eyebrow: 'Step 2 of 2',
    accent: 'Wallets',
    rest: '& chains',
    lede: 'Tell us where you settle and which on-chain assets to attribute conversions to.',
  },
}

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
    supportedChains: ['POLYGON'],
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
        credentials: 'same-origin',
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

  const meta = TITLES[step]

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 lg:items-start">
      <div className="lg:hidden">
        <Stepper steps={STEPS} active={step} orientation="horizontal" />
      </div>

      <aside className="hidden lg:flex flex-col pt-2 sticky top-20">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]/45 mb-5">
          Getting started
        </div>
        <Stepper steps={STEPS} active={step} orientation="vertical" />
      </aside>

      <div className="flex flex-col min-w-0">
        <header className="pb-6 border-b border-[rgba(10,10,10,0.08)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0A0A0A]/45">
            {meta.eyebrow}
          </div>
          <h1 className="mt-1.5 text-[26px] sm:text-[28px] font-medium text-[#0A0A0A] tracking-[-0.02em] leading-[1.05]">
            <span className="font-instrument-serif italic font-normal text-[30px] sm:text-[32px] text-[#1F40CD] mr-1">
              {meta.accent}
            </span>
            {meta.rest}
          </h1>
          <p className="mt-2 text-[13px] text-[#0A0A0A]/60 leading-relaxed max-w-xl">
            {meta.lede}
          </p>
        </header>

        <div className="py-7">
          {error && (
            <div className="mb-5 bg-[rgba(239,68,68,0.07)] border border-[rgba(239,68,68,0.2)] rounded-md px-3.5 py-2.5 text-[12.5px] text-red-700">
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
        </div>

        <footer className="flex items-center justify-between gap-3 pt-5 border-t border-[rgba(10,10,10,0.08)]">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => {
                setErrors({})
                setStep(1)
              }}
              disabled={submitting}
              className="h-9 px-4 rounded-full border border-[rgba(10,10,10,0.12)] bg-white text-[12.5px] font-medium text-[#0A0A0A] hover:border-[#1F40CD] hover:text-[#1F40CD] inline-flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              <ArrowLeft size={13} /> Back
            </button>
          ) : (
            <span className="text-[11.5px] text-[#0A0A0A]/55">
              Required fields are marked <span className="text-[#1F40CD]">*</span>
            </span>
          )}

          {step === 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="h-9 px-5 rounded-full bg-[#1F40CD] text-white text-[12.5px] font-medium inline-flex items-center gap-1.5 hover:bg-[#1A36B0] transition-colors"
            >
              Continue <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="h-9 px-5 rounded-full bg-[#1F40CD] text-white text-[12.5px] font-medium inline-flex items-center gap-1.5 hover:bg-[#1A36B0] disabled:opacity-60 transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Finishing…
                </>
              ) : (
                <>
                  Finish setup <Check size={13} />
                </>
              )}
            </button>
          )}
        </footer>
      </div>
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
