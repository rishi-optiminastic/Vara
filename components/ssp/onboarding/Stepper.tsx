'use client'

import { Check } from 'lucide-react'

const ITEMS = [
  { n: 1 as const, label: 'Site & contact' },
  { n: 2 as const, label: 'Inventory & payouts' },
  { n: 3 as const, label: 'Drop in the SDK' },
]

export type StepNum = 1 | 2 | 3

export function Stepper({ step }: { step: StepNum }): React.JSX.Element {
  return (
    <div className="flex items-center gap-3">
      {ITEMS.map((it, i) => {
        const active = step === it.n
        const done = step > it.n
        return (
          <div key={it.n} className="flex items-center gap-3 flex-1">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold shrink-0 ${
                active || done
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
            {i < ITEMS.length - 1 && <div className="flex-1 h-px bg-[rgba(55,50,47,0.12)]" />}
          </div>
        )
      })}
    </div>
  )
}
