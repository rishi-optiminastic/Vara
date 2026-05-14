"use client"

import { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCampaignWizard } from "@/hooks/useCampaignWizard"
import { formatSavedAgo } from "@/hooks/useWizardAutosave"
import { WizardStepCampaign } from "./WizardStepCampaign"
import { WizardStepBudget } from "./WizardStepBudget"
import { WizardStepTargeting } from "./WizardStepTargeting"
import { WizardStepAds } from "./WizardStepAds"
import { WizardReview } from "./WizardReview"
import { WizardSummary } from "./WizardSummary"

interface StepDef {
  label: string
}

const STEPS: StepDef[] = [
  { label: "Campaign" },
  { label: "Budget" },
  { label: "Ad Group" },
  { label: "Ads" },
  { label: "Review" },
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

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!reachable}
      className={`flex flex-col items-center gap-1.5 ${!reachable ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`size-7 rounded-full flex items-center justify-center transition-all duration-200 ${
        active
          ? "bg-[#37322F] text-[#FAFAF8] shadow-[0_0_0_3px_rgba(55,50,47,0.14)]"
          : done
          ? "bg-[#37322F] text-[#FAFAF8]"
          : reachable
          ? "bg-[rgba(55,50,47,0.08)] text-[#37322F] hover:bg-[rgba(55,50,47,0.15)]"
          : "bg-[rgba(55,50,47,0.04)] text-muted-foreground/30"
      }`}>
        {done ? (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span className="text-[10px] font-bold leading-none">{index + 1}</span>
        )}
      </div>
      <span className={`text-[10px] whitespace-nowrap transition-colors duration-200 ${
        active ? "text-[#37322F] font-semibold" :
        done ? "text-[#37322F] font-medium" :
        reachable ? "text-muted-foreground font-medium" :
        "text-muted-foreground/30 font-medium"
      }`}>
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
  const adj = current - 1
  const furthAdj = furthest - 1
  return (
    <div className="flex items-start px-4 py-3">
      {STEPS.map((s, i) => (
        <Fragment key={s.label}>
          <StepDot step={s} index={i} current={adj} furthest={furthAdj} onClick={() => goTo(i + 1)} />
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mt-[13px] transition-colors duration-300 ${
              i < adj ? "bg-[#37322F]" : "bg-[rgba(55,50,47,0.12)]"
            }`} />
          )}
        </Fragment>
      ))}
    </div>
  )
}

interface BannerProps {
  onRestore: () => void
  onDiscard: () => void
}

function DraftBanner({ onRestore, onDiscard }: BannerProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-[rgba(55,50,47,0.15)] bg-[#F0ECE6]/70 px-3 py-2 text-[11px]">
      <span className="text-[#37322F]">
        <span className="font-semibold">Unfinished draft found.</span>{" "}
        <span className="text-muted-foreground">Pick up where you left off?</span>
      </span>
      <div className="flex items-center gap-1.5">
        <Button type="button" size="sm" variant="ghost" className="h-6 text-[10px] rounded-full px-3" onClick={onDiscard}>
          Discard
        </Button>
        <Button type="button" size="sm" className="h-6 text-[10px] rounded-full px-3 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520]" onClick={onRestore}>
          Restore
        </Button>
      </div>
    </div>
  )
}

interface SavedTagProps {
  saving: boolean
  savedAt: number | null
}

function SavedTag({ saving, savedAt }: SavedTagProps): React.JSX.Element | null {
  const [, force] = useState(0)
  useEffect(() => {
    const t = setInterval(() => force((n) => n + 1), 30_000)
    return (): void => clearInterval(t)
  }, [])
  if (saving) return <span className="text-[10px] text-muted-foreground italic">Saving…</span>
  if (!savedAt) return null
  return <span className="text-[10px] text-muted-foreground">Saved · {formatSavedAgo(savedAt)}</span>
}

export function CampaignForm(): React.JSX.Element {
  const router = useRouter()
  const w = useCampaignWizard()
  const [draftDismissed, setDraftDismissed] = useState(false)
  const adHandlers = { addAd: w.addAd, removeAd: w.removeAd, updateAd: w.updateAd }
  const showDraftBanner = w.hasDraft && !draftDismissed

  const handleRestore = (): void => { w.restoreDraft(); setDraftDismissed(true) }
  const handleDiscard = (): void => { w.discardDraft(); setDraftDismissed(true) }

  const savedLabel =
    w.saving ? "Saving…" :
    w.savedAt ? `Saved · ${formatSavedAgo(w.savedAt)}` :
    ""

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="flex flex-col gap-3 min-w-0">
        {showDraftBanner && <DraftBanner onRestore={handleRestore} onDiscard={handleDiscard} />}
        <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white/60 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
          <StepProgress current={w.step} furthest={w.furthestStep} goTo={w.goTo} />
        </div>

        {w.step === 1 && (
          <WizardStepCampaign
            state={w.state}
            templateId={w.templateId}
            applyTemplate={w.applyTemplate}
            update={w.update}
          />
        )}
        {w.step === 2 && <WizardStepBudget state={w.state} update={w.update} />}
        {w.step === 3 && <WizardStepTargeting state={w.state} update={w.update} />}
        {w.step === 4 && <WizardStepAds state={w.state} handlers={adHandlers} />}
        {w.step === 5 && <WizardReview state={w.state} />}

        {w.error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{w.error}</div>
        )}

        <div className="flex items-center justify-between border-t border-[rgba(55,50,47,0.08)] pt-2.5">
          <div className="flex items-center gap-2">
            {w.step === 1 ? (
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs rounded-full px-4" onClick={() => router.back()}>
                Cancel
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" className="h-8 text-xs rounded-full px-4 gap-1.5" onClick={w.back}>
                <ArrowLeft className="size-3" /> Back
              </Button>
            )}
            <SavedTag saving={w.saving} savedAt={w.savedAt} />
          </div>

          {w.step < 5 ? (
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs rounded-full px-5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
              onClick={w.next}
            >
              Continue to {STEPS[w.step]!.label} <ArrowRight className="size-3" />
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={w.loading}
              className="h-8 gap-1.5 text-xs rounded-full px-5 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
              onClick={w.submit}
            >
              {w.loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
              {w.state.status === "ACTIVE" ? "Launch campaign" : "Save as draft"}
            </Button>
          )}
        </div>
      </div>

      <aside className="hidden lg:block">
        <WizardSummary state={w.state} step={w.step} score={w.score} savedLabel={savedLabel} />
      </aside>
    </div>
  )
}
