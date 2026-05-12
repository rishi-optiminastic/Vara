"use client"

import { useRouter } from "next/navigation"
import type { Campaign } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { useAdGroupForm } from "@/hooks/useAdGroupForm"
import { AdGroupStepBasics } from "./AdGroupStepBasics"
import { AdGroupStepSettings } from "./AdGroupStepSettings"
import {
  NavAdGroupsIcon,
  SpendIcon,
  CircleCheckIcon,
  ChevronLeftIcon,
  CircleOpenArrowRight,
  SquareWandSparkleIcon,
  HourglassStartIcon,
} from "@/icons"

interface StepDef { label: string; icon: React.ElementType }

const STEPS: StepDef[] = [
  { label: "Basics", icon: NavAdGroupsIcon },
  { label: "Settings", icon: SpendIcon },
]

interface DotProps {
  step: StepDef
  index: number
  current: number
  furthest: number
  onClick: () => void
}

function StepDot({ step, index, current, furthest, onClick }: DotProps): React.JSX.Element {
  const done = index < current
  const active = index === current
  const reachable = index <= furthest
  const Icon = step.icon

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!reachable}
      className={`group flex flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-left transition-colors ${
        active ? "bg-[#37322F] text-[#FAFAF8]"
        : done ? "text-[#37322F] hover:bg-[#37322F]/[0.06]"
        : reachable ? "text-muted-foreground hover:bg-[#37322F]/[0.04]"
        : "text-muted-foreground/50 cursor-not-allowed"
      }`}
    >
      <div className={`size-5 shrink-0 rounded-full flex items-center justify-center ${
        active ? "bg-[#F7F5F3]/15 text-[#FAFAF8]"
        : done ? "bg-[#37322F] text-[#FAFAF8]"
        : "bg-[rgba(55,50,47,0.06)] text-current"
      }`}>
        {done ? <CircleCheckIcon className="size-3" /> : <Icon className="size-3" />}
      </div>
      <span className={`text-[11px] truncate ${active || done ? "font-semibold" : "font-medium"}`}>{step.label}</span>
    </button>
  )
}

interface Props {
  campaigns: Pick<Campaign, "id" | "name">[]
  defaultCampaignId?: string
}

export function AdGroupForm({ campaigns, defaultCampaignId = "" }: Props): React.JSX.Element {
  const router = useRouter()
  const { step, furthestStep, state, error, loading, update, next, back, goTo, submit } = useAdGroupForm(defaultCampaignId)

  return (
    <div className="flex flex-col gap-3 max-w-2xl">
      <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white/60 p-1 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div className="flex items-stretch gap-0.5">
          {STEPS.map((s, i) => (
            <StepDot key={s.label} step={s} index={i} current={step - 1} furthest={furthestStep - 1} onClick={() => goTo(i + 1)} />
          ))}
        </div>
      </div>

      {step === 1 && <AdGroupStepBasics state={state} update={update} campaigns={campaigns} />}
      {step === 2 && <AdGroupStepSettings state={state} update={update} />}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>
      )}

      <div className="flex items-center justify-between border-t border-[rgba(55,50,47,0.08)] pt-2.5">
        {step === 1 ? (
          <Button type="button" variant="ghost" size="sm" className="h-8 text-xs rounded-full px-4" onClick={() => router.back()}>
            Cancel
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" className="h-8 text-xs rounded-full px-4 gap-1.5" onClick={back}>
            <ChevronLeftIcon className="size-3" /> Back
          </Button>
        )}

        {step < 2 ? (
          <Button size="sm" className="h-8 gap-1.5 text-xs rounded-full px-5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]" onClick={next}>
            Settings <CircleOpenArrowRight className="size-3" />
          </Button>
        ) : (
          <Button size="sm" disabled={loading} className="h-8 gap-1.5 text-xs rounded-full px-5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]" onClick={submit}>
            {loading ? <HourglassStartIcon className="size-3" /> : <SquareWandSparkleIcon className="size-3" />}
            {state.status === "ACTIVE" ? "Activate ad group" : "Save as draft"}
          </Button>
        )}
      </div>
    </div>
  )
}
