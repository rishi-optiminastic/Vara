"use client"

import { CAMPAIGN_TEMPLATES, type TemplatePreset } from "@/lib/campaignTemplates"
import { CircleCheckIcon, SquareWandSparkleIcon } from "@/icons"

interface Props {
  selectedId: string
  onSelect: (id: string) => void
}

interface CardProps {
  template: TemplatePreset
  active: boolean
  onClick: () => void
}

function TemplateCard({ template, active, onClick }: CardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col gap-1.5 rounded-lg border p-2.5 text-left transition-all ${
        active
          ? "border-[#37322F] bg-[#37322F] text-[#FAFAF8] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_3px_rgba(55,50,47,0.2)]"
          : "border-[rgba(55,50,47,0.15)] bg-white hover:bg-[#F7F4F1] hover:border-[rgba(55,50,47,0.3)]"
      }`}
    >
      {active && (
        <CircleCheckIcon className="absolute right-1.5 top-1.5 size-3 text-[#FAFAF8]" />
      )}
      <div>
        <div className={`text-[11px] font-semibold leading-tight ${active ? "text-[#FAFAF8]" : "text-[#37322F]"}`}>
          {template.label}
        </div>
        <div className={`text-[9px] uppercase tracking-widest leading-none mt-1 ${active ? "text-[#FAFAF8]/70" : "text-muted-foreground/70"}`}>
          {template.tagline}
        </div>
      </div>
      <p className={`text-[10px] leading-snug ${active ? "text-[#FAFAF8]/85" : "text-muted-foreground"}`}>
        {template.blurb}
      </p>
      <div className="mt-auto flex flex-wrap gap-1 pt-0.5">
        {template.highlights.map((h) => (
          <span
            key={h}
            className={`rounded-full border px-1.5 py-px text-[8px] font-medium uppercase tracking-wider ${
              active
                ? "border-[#FAFAF8]/25 text-[#FAFAF8]/85"
                : "border-[rgba(55,50,47,0.15)] text-muted-foreground"
            }`}
          >
            {h}
          </span>
        ))}
      </div>
    </button>
  )
}

export function QuickstartTemplates({ selectedId, onSelect }: Props): React.JSX.Element {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <span className="flex size-4 items-center justify-center rounded-md bg-[#F0E8FF] text-[#6D28D9]">
          <SquareWandSparkleIcon className="size-2.5" />
        </span>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Quickstart</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {CAMPAIGN_TEMPLATES.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            active={selectedId === t.id}
            onClick={() => onSelect(t.id)}
          />
        ))}
      </div>
    </div>
  )
}
