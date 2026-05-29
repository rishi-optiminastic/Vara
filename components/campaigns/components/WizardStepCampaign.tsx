"use client"

import type { Objective, Vertical } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { TextField, SelectField, TextareaField } from "./form-fields"
import { QuickstartTemplates } from "./QuickstartTemplates"
import { RecommendedBadge } from "./RecommendedBadge"
import { WizardSection } from "./WizardSection"
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

interface ObjectiveTipProps {
  rationale: string
}

function ObjectiveTip({ rationale }: ObjectiveTipProps): React.JSX.Element {
  return (
    <p className="rounded-md border border-[rgba(10,10,10,0.12)] bg-[#ECEAE2] px-2 py-1.5 text-[10px] leading-snug text-[#1F40CD] col-span-2">
      <span className="font-semibold">Tip · </span>
      <span className="opacity-80">{rationale}</span>
    </p>
  )
}

export function WizardStepCampaign({ state, templateId, applyTemplate, update }: Props): React.JSX.Element {
  const recs = recommendationsFor(state.objective)

  return (
    <div className="flex flex-col gap-2.5">
      <QuickstartTemplates selectedId={templateId} onSelect={applyTemplate} />

      <div className="bg-white p-4 space-y-5">
        <WizardSection
          icon={IdBadgeIcon}
          title="Identity"
          description="Name your campaign and tell us what you're optimizing for."
        >
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
        </WizardSection>

        <WizardSection
          icon={PlayIcon}
          title="Launch"
          description="Save as a draft to review later, or push it live immediately."
          badge={<RecommendedBadge label="Draft" tone="subtle" />}
        >
          <div className="grid grid-cols-2 border border-dashed border-[rgba(10,10,10,0.12)]">
            {STATUS_OPTIONS.map((opt, i) => {
              const active = state.status === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ status: opt.value })}
                  className={`relative px-3 py-2.5 text-left transition-colors ${
                    i > 0 ? "border-l border-dashed border-[rgba(10,10,10,0.12)]" : ""
                  } ${active ? "bg-[#1F40CD]/[0.04]" : "bg-white hover:bg-[#0A0A0A]/[0.02]"}`}
                >
                  {active && (
                    <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-[#1F40CD]" />
                  )}
                  <div className={`text-xs font-semibold ${active ? "text-[#1F40CD]" : "text-[#0A0A0A]"}`}>{opt.label}</div>
                  <div className="text-[10px] mt-0.5 leading-tight text-muted-foreground">{opt.desc}</div>
                </button>
              )
            })}
          </div>
        </WizardSection>
      </div>
    </div>
  )
}
