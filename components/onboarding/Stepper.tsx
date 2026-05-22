'use client'

import { Check } from 'lucide-react'

export interface StepDef {
  id: number
  label: string
  description?: string
  done?: boolean
}

interface Props {
  steps: StepDef[]
  active: number
  orientation: 'horizontal' | 'vertical'
}

interface CircleProps {
  step: StepDef
  isActive: boolean
  isDone: boolean
}

function StepCircle({ step, isActive, isDone }: CircleProps): React.JSX.Element {
  return (
    <span
      aria-hidden
      className={`shrink-0 size-6 grid place-items-center rounded-full text-[10.5px] font-semibold transition-colors ${
        isDone
          ? 'bg-[#1F40CD] text-white'
          : isActive
            ? 'bg-white border-[1.5px] border-[#1F40CD] text-[#1F40CD]'
            : 'bg-white border border-[rgba(10,10,10,0.2)] text-[#0A0A0A]/45'
      }`}
    >
      {isDone ? <Check size={11} strokeWidth={3} /> : step.id}
    </span>
  )
}

export function Stepper({ steps, active, orientation }: Props): React.JSX.Element {
  if (orientation === 'vertical') return <VerticalStepper steps={steps} active={active} />
  return <HorizontalStepper steps={steps} active={active} />
}

function HorizontalStepper({
  steps,
  active,
}: {
  steps: StepDef[]
  active: number
}): React.JSX.Element {
  return (
    <ol className="flex items-center gap-2 sm:gap-3 w-full">
      {steps.map((step, i) => {
        const isActive = step.id === active
        const isDone = step.done || step.id < active
        const isLast = i === steps.length - 1
        return (
          <li key={step.id} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <StepCircle step={step} isActive={isActive} isDone={isDone} />
            <div
              className={`hidden sm:flex flex-col leading-tight min-w-0 ${
                isActive || isDone ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]/55'
              }`}
            >
              <span
                className={`text-[12.5px] truncate ${isActive ? 'font-semibold' : 'font-medium'}`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <span
                aria-hidden
                className={`flex-1 h-px ${
                  isDone ? 'bg-[#1F40CD]' : 'bg-[rgba(10,10,10,0.12)]'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

function VerticalStepper({
  steps,
  active,
}: {
  steps: StepDef[]
  active: number
}): React.JSX.Element {
  return (
    <ol className="flex flex-col gap-0.5">
      {steps.map((step, i) => {
        const isActive = step.id === active
        const isDone = step.done || step.id < active
        const isLast = i === steps.length - 1
        return (
          <li key={step.id} className="relative pl-9 pr-3 py-2.5">
            {!isLast && (
              <span
                aria-hidden
                className={`absolute left-3.5 top-9 bottom-0 w-px ${
                  isDone ? 'bg-[#1F40CD]' : 'bg-[rgba(10,10,10,0.12)]'
                }`}
              />
            )}
            <span className="absolute left-1.5 top-2.5">
              <StepCircle step={step} isActive={isActive} isDone={isDone} />
            </span>
            <div
              className={`flex flex-col leading-tight ${
                isActive || isDone ? 'text-[#0A0A0A]' : 'text-[#0A0A0A]/55'
              }`}
            >
              <span
                className={`text-[13px] ${isActive ? 'font-semibold' : 'font-medium'}`}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="mt-0.5 text-[11px] text-[#0A0A0A]/50">
                  {step.description}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
