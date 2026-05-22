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
      className={`group relative flex flex-col gap-1.5 rounded-md border p-2.5 text-left transition-all ${
        active
          ? "border-[#0A0A0A] bg-[#1F40CD] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_3px_rgba(10,10,10,0.2)]"
          : "border-[rgba(10,10,10,0.15)] bg-white hover:bg-[#ECEAE2] hover:border-[rgba(10,10,10,0.3)]"
      }`}
    >
      {active && (
        <CircleCheckIcon className="absolute right-1.5 top-1.5 size-3 text-[#FFFFFF]" />
      )}
      <div>
        <div className={`text-[11px] font-semibold leading-tight ${active ? "text-[#FFFFFF]" : "text-[#0A0A0A]"}`}>
          {template.label}
        </div>
        <div className={`text-[9px] uppercase tracking-widest leading-none mt-1 ${active ? "text-[#FFFFFF]/70" : "text-muted-foreground/70"}`}>
          {template.tagline}
        </div>
      </div>
      <p className={`text-[10px] leading-snug ${active ? "text-[#FFFFFF]/85" : "text-muted-foreground"}`}>
        {template.blurb}
      </p>
      <div className="mt-auto flex flex-wrap gap-1 pt-0.5">
        {template.highlights.map((h) => (
          <span
            key={h}
            className={`rounded-full border px-1.5 py-px text-[8px] font-medium uppercase tracking-wider ${
              active
                ? "border-[#FFFFFF]/25 text-[#FFFFFF]/85"
                : "border-[rgba(10,10,10,0.15)] text-muted-foreground"
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
        <span className="flex size-4 items-center justify-center rounded-md bg-[#ECEAE2] text-[#1F40CD]">
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
