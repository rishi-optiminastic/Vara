"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCampaignWizard } from "@/hooks/useCampaignWizard"
import { formatSavedAgo } from "@/hooks/useWizardAutosave"
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
        <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-white/60 p-1 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
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
