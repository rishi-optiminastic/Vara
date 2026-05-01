"use client"

import type { Campaign } from "@prisma/client"
import type { AdGroupFormState } from "@/hooks/useAdGroupForm"
import { Card, CardContent } from "@/components/ui/card"
import { TextField } from "@/components/campaigns/components/form-fields"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Props {
  state: AdGroupFormState
  update: (patch: Partial<AdGroupFormState>) => void
  campaigns: Pick<Campaign, "id" | "name">[]
}

type StatusOption = { value: "DRAFT" | "ACTIVE"; label: string; desc: string }

const STATUS_OPTIONS: StatusOption[] = [
  { value: "DRAFT", label: "Save as draft", desc: "Review before making it live" },
  { value: "ACTIVE", label: "Activate now", desc: "Start serving immediately" },
]

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="space-y-2 border-b border-[rgba(55,50,47,0.07)] pb-3 last:border-0 last:pb-0">
      <div>
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
        {desc && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

export function AdGroupStepBasics({ state, update, campaigns }: Props): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">
        <Section title="Identity" desc="Name this ad group and link it to a campaign.">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 col-span-2">
              <Label className="text-[10px] uppercase tracking-widest">Campaign</Label>
              <Select value={state.campaignId} onValueChange={(v) => update({ campaignId: v })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select a campaign…" />
                </SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <TextField
              label="Ad group name"
              value={state.name}
              onChange={(v) => update({ name: v })}
              placeholder="e.g. Polygon — Mobile — DeFi"
              required
              span={2}
            />
          </div>
        </Section>

        <Section title="Status" desc="Drafts won't serve until activated.">
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((opt) => {
              const active = state.status === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ status: opt.value })}
                  className={`rounded-lg border p-2.5 text-left transition-all ${
                    active
                      ? "border-[#37322F] bg-[#37322F] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)]"
                      : "border-[rgba(55,50,47,0.15)] bg-white hover:bg-[#F7F4F1] hover:border-[rgba(55,50,47,0.25)]"
                  }`}
                >
                  <div className={`text-xs font-semibold ${active ? "text-white" : "text-[#37322F]"}`}>{opt.label}</div>
                  <div className={`text-[10px] mt-0.5 leading-tight ${active ? "text-white/65" : "text-muted-foreground"}`}>{opt.desc}</div>
                </button>
              )
            })}
          </div>
        </Section>
      </CardContent>
    </Card>
  )
}
