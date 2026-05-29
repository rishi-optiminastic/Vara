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

function TemplateCell({ template, active, onClick }: CardProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col gap-1.5 border-l border-dashed border-[rgba(10,10,10,0.12)] px-3 py-2.5 text-left transition-colors first:border-l-0 ${
        active ? "bg-[#1F40CD]/[0.04]" : "bg-white hover:bg-[#0A0A0A]/[0.02]"
      }`}
    >
      {active && (
        <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-[#1F40CD]" />
      )}
      <div className="flex items-center justify-between gap-2">
        <div className={`text-[11.5px] font-semibold leading-tight ${active ? "text-[#1F40CD]" : "text-[#0A0A0A]"}`}>
          {template.label}
        </div>
        {active && <CircleCheckIcon className="size-3 shrink-0 text-[#1F40CD]" />}
      </div>
      <div className="text-[9px] uppercase tracking-widest leading-none text-muted-foreground/70">
        {template.tagline}
      </div>
      <p className="text-[10px] leading-snug text-muted-foreground">{template.blurb}</p>
      <div className="mt-auto flex flex-wrap gap-1 pt-0.5">
        {template.highlights.map((h) => (
          <span
            key={h}
            className={`text-[8px] font-medium uppercase tracking-wider ${
              active ? "text-[#1F40CD]/70" : "text-muted-foreground/80"
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
    <div className="bg-white">
      <div className="flex items-center gap-1.5 border-b border-dashed border-[rgba(10,10,10,0.12)] px-3 py-2">
        <SquareWandSparkleIcon className="size-3 text-[#1F40CD]" />
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Quickstart
        </h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {CAMPAIGN_TEMPLATES.map((t) => (
          <TemplateCell
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
