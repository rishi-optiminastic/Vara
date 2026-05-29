'use client'

import { ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react'
import type { StepNum } from './Stepper'

interface Props {
  step: StepNum
  submitting: boolean
  onBack: () => void
  onNext: () => void
  onPersist: () => void
  onFinish: () => void
}

const PRIMARY =
  'h-11 px-6 rounded-full bg-[#37322F] text-white text-sm font-medium inline-flex items-center gap-2 shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset,0_8px_20px_-6px_rgba(55,50,47,0.4)] hover:bg-[#2A2520] transition-all hover:-translate-y-px'

export function FooterButtons({
  step,
  submitting,
  onBack,
  onNext,
  onPersist,
  onFinish,
}: Props): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {step > 1 && step < 3 ? (
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="h-11 px-5 rounded-full border border-[#E0DEDB] bg-white text-sm font-medium text-[#37322F] hover:bg-[#FAFAF9] inline-flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={14} /> Back
        </button>
      ) : (
        <span />
      )}

      {step === 1 && (
        <button type="button" onClick={onNext} className={PRIMARY}>
          Continue <ArrowRight size={14} />
        </button>
      )}
      {step === 2 && (
        <button
          type="button"
          onClick={onPersist}
          disabled={submitting}
          className={`${PRIMARY} disabled:opacity-50`}
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving…
            </>
          ) : (
            <>
              Save & integrate <ArrowRight size={14} />
            </>
          )}
        </button>
      )}
      {step === 3 && (
        <button type="button" onClick={onFinish} className={PRIMARY}>
          Finish setup <Check size={14} />
        </button>
      )}
    </div>
  )
}
