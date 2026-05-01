"use client"

import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCampaignWizard } from "@/hooks/useCampaignWizard"
import {
  CampaignsIcon,
  SpendIcon,
  GaugeIcon,
  ImageSparkleIcon,
  FileCheckIcon,
} from "@/icons"
import { WizardStepCampaign } from "./WizardStepCampaign"
import { WizardStepBudget } from "./WizardStepBudget"
import { WizardStepTargeting } from "./WizardStepTargeting"
import { WizardStepAds } from "./WizardStepAds"
import { WizardReview } from "./WizardReview"
import { WizardSummary } from "./WizardSummary"

interface StepDef {
  label: string
  icon: React.ElementType
}

const STEPS: StepDef[] = [
  { label: "Campaign", icon: CampaignsIcon },
  { label: "Budget", icon: SpendIcon },
  { label: "Ad Group", icon: GaugeIcon },
  { label: "Ads", icon: ImageSparkleIcon },
  { label: "Review", icon: FileCheckIcon },
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
        active ? "bg-[#37322F] text-[#FAFAF8]" :
        done ? "text-[#37322F] hover:bg-[#37322F]/[0.06]" :
        reachable ? "text-muted-foreground hover:bg-[#37322F]/[0.04]" :
        "text-muted-foreground/50 cursor-not-allowed"
      }`}
    >
      <div className={`size-5 shrink-0 rounded-full flex items-center justify-center text-[9px] font-semibold ${
        active ? "bg-[#FAFAF8]/15 text-[#FAFAF8]" :
        done ? "bg-[#37322F] text-[#FAFAF8]" :
        "bg-[rgba(55,50,47,0.06)] text-current"
      }`}>
        {done ? <Check className="size-3" strokeWidth={3} /> : <Icon className="size-3" />}
      </div>
      <span className={`text-[11px] truncate ${active || done ? "font-semibold" : "font-medium"}`}>
        {step.label}
      </span>
    </button>
  )
}

interface ProgressProps {
  current: number
  furthest: number
  goTo: (n: number) => void
}

function StepProgress({ current, furthest, goTo }: ProgressProps): React.JSX.Element {
  return (
    <div className="flex items-stretch gap-0.5">
      {STEPS.map((s, i) => (
        <StepDot
          key={s.label}
          step={s}
          index={i}
          current={current - 1}
          furthest={furthest - 1}
          onClick={() => goTo(i + 1)}
        />
      ))}
    </div>
  )
}

export function CampaignForm(): React.JSX.Element {
  const router = useRouter()
  const { step, furthestStep, state, error, loading, update, next, back, goTo, addAd, removeAd, updateAd, submit } = useCampaignWizard()
  const adHandlers = { addAd, removeAd, updateAd }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="flex flex-col gap-3 min-w-0">
        <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white/60 p-1 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
          <StepProgress current={step} furthest={furthestStep} goTo={goTo} />
        </div>

        {step === 1 && <WizardStepCampaign state={state} update={update} />}
        {step === 2 && <WizardStepBudget state={state} update={update} />}
        {step === 3 && <WizardStepTargeting state={state} update={update} />}
        {step === 4 && <WizardStepAds state={state} handlers={adHandlers} />}
        {step === 5 && <WizardReview state={state} />}

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
              <ArrowLeft className="size-3" /> Back
            </Button>
          )}

          {step < 5 ? (
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs rounded-full px-5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
              onClick={next}
            >
              Continue to {STEPS[step]!.label} <ArrowRight className="size-3" />
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={loading}
              className="h-8 gap-1.5 text-xs rounded-full px-5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
              onClick={submit}
            >
              {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
              {state.status === "ACTIVE" ? "Launch campaign" : "Save as draft"}
            </Button>
          )}
        </div>
      </div>

      <aside className="hidden lg:block">
        <WizardSummary state={state} step={step} />
      </aside>
    </div>
  )
}
