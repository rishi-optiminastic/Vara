"use client"

import type { Objective, Vertical } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { TextField, SelectField, TextareaField } from "./form-fields"
import { QuickstartTemplates } from "./QuickstartTemplates"
import { RecommendedBadge } from "./RecommendedBadge"
import { recommendationsFor } from "@/lib/campaignSmart"
import { IdBadgeIcon, PlayIcon } from "@/icons"

interface Props {
  state: WizardState
  templateId: string
  applyTemplate: (id: string) => void
  update: (patch: Partial<WizardState>) => void
}

const OBJECTIVES: { value: Objective; label: string; desc: string }[] = [
  { value: "AWARENESS", label: "Awareness", desc: "Optimize for reach & impressions" },
  { value: "WALLET_CONNECTS", label: "Wallet Connects", desc: "Drive connect_wallet events" },
  { value: "ON_CHAIN_CONVERSION", label: "On-chain Conversion", desc: "Drive mints, swaps, stakes" },
  { value: "TOKEN_HOLDERS", label: "Token Holders", desc: "Acquire wallets holding the token" },
]

const VERTICALS: { value: Vertical; label: string; desc: string }[] = [
  { value: "TOKEN_LAUNCH", label: "Token Launch", desc: "New token / TGE" },
  { value: "NFT_DROP", label: "NFT Drop", desc: "Mint or collection launch" },
  { value: "DEFI", label: "DeFi", desc: "Lending, DEX, vaults, perps" },
  { value: "DAPP_GROWTH", label: "dApp Growth", desc: "User acquisition for existing dApp" },
  { value: "OTHER", label: "Other", desc: "Anything else" },
]

type CampaignStatusDraft = "DRAFT" | "ACTIVE"

const STATUS_OPTIONS: { value: CampaignStatusDraft; label: string; desc: string }[] = [
  { value: "DRAFT", label: "Save as draft", desc: "Review before launching" },
  { value: "ACTIVE", label: "Launch now", desc: "Start delivering immediately" },
]

interface SectionProps {
  icon: React.ElementType
  tint: string
  title: string
  children: React.ReactNode
  badge?: React.ReactNode
}

function Section({ icon: Icon, tint, title, children, badge }: SectionProps): React.JSX.Element {
  return (
    <div className="space-y-2 border-b border-[rgba(55,50,47,0.07)] pb-3 last:border-0 last:pb-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`flex size-4 items-center justify-center rounded-md ${tint}`}>
            <Icon className="size-2.5" />
          </span>
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
        </div>
        {badge}
      </div>
      {children}
    </div>
  )
}

interface ObjectiveTipProps {
  rationale: string
}

function ObjectiveTip({ rationale }: ObjectiveTipProps): React.JSX.Element {
  return (
    <p className="rounded-md border border-[#E0D4FF] bg-[#F5EFFF] px-2 py-1.5 text-[10px] leading-snug text-[#5B21B6] col-span-2">
      <span className="font-semibold">Tip · </span>
      <span className="opacity-80">{rationale}</span>
    </p>
  )
}

export function WizardStepCampaign({ state, templateId, applyTemplate, update }: Props): React.JSX.Element {
  const recs = recommendationsFor(state.objective)

  return (
    <div className="space-y-3">
      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardContent className="p-4">
          <QuickstartTemplates selectedId={templateId} onSelect={applyTemplate} />
        </CardContent>
      </Card>

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
        <CardContent className="p-4 space-y-3">
          <Section icon={IdBadgeIcon} tint="bg-[#F0E8FF] text-[#6D28D9]" title="Identity">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Campaign name"
                value={state.name}
                onChange={(v) => update({ name: v })}
                placeholder="Q4 Token Launch"
                required
                span={2}
              />
              <SelectField
                label="Objective"
                value={state.objective}
                onChange={(v) => update({ objective: v as Objective })}
                options={OBJECTIVES}
              />
              <SelectField
                label="Vertical"
                value={state.vertical}
                onChange={(v) => update({ vertical: v as Vertical })}
                options={VERTICALS}
              />
              <ObjectiveTip rationale={recs.rationale} />
              <TextareaField
                label="Description"
                value={state.description}
                onChange={(v) => update({ description: v })}
                placeholder="Internal note (optional)"
                rows={2}
              />
            </div>
          </Section>

          <Section icon={PlayIcon} tint="bg-[#E8F5E9] text-[#15803D]" title="Launch" badge={<RecommendedBadge label="Draft" tone="subtle" />}>
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
    </div>
  )
}
