import type { Campaign, Targeting, Creative, WalletSegment } from "@prisma/client"
import { centsToUsd, formatCompact } from "@/lib/money"
import { ChainRow, DeviceRow, GeoRow, ChipRow } from "./TargetingRows"
import {
  KpiStrip,
  PacingCard,
  SectionCard,
  MetaRow,
  Field,
  dateLabel,
  truncate,
} from "./CampaignOverviewParts"
import {
  SpendIcon,
  EyeScannerIcon,
  ClicksIcon,
  WalletIcon,
  OnChainIcon,
  CalendarCheckIcon,
  CampaignsIcon,
  GearIcon,
} from "@/icons"

type CampaignWithRel = Campaign & { targeting: Targeting | null; creatives: Creative[] }

interface MetricsSum {
  spendUsdCents: number
  impressions: number
  clicks: number
  walletConnects: number
  onChainConvs: number
}

interface Props {
  campaign: CampaignWithRel
  metrics: MetricsSum
  segments: WalletSegment[]
  rangeDays?: number
}

export function CampaignOverview({ campaign, metrics, segments, rangeDays = 30 }: Props): React.JSX.Element {
  const spent = metrics.spendUsdCents
  const budget = campaign.budgetUsdCents
  const spentPct = Math.min(100, Math.round((spent / Math.max(1, budget)) * 100))
  const remaining = Math.max(0, budget - spent)

  const start = campaign.startDate
  const end = campaign.endDate
  const now = Date.now()
  const totalMs = end ? Math.max(1, end.getTime() - start.getTime()) : null
  const elapsedMs = Math.max(0, Math.min(totalMs ?? Infinity, now - start.getTime()))
  const timePct = totalMs ? Math.round((elapsedMs / totalMs) * 100) : null
  const daysElapsed = Math.floor(elapsedMs / (24 * 60 * 60 * 1000))
  const daysTotal = totalMs ? Math.floor(totalMs / (24 * 60 * 60 * 1000)) : null

  const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0
  const cpm = metrics.impressions > 0 ? (spent / metrics.impressions) * 1000 : 0

  const segmentMap = new Map(segments.map((s) => [s.id, s.name]))
  const selectedSegments = (campaign.targeting?.segmentIds ?? [])
    .map((id) => segmentMap.get(id))
    .filter(Boolean) as string[]

  const KPIS = [
    { label: "Spend", value: centsToUsd(spent), icon: SpendIcon, tint: "bg-[#FFF3E8] text-[#C2410C]" },
    { label: "Impressions", value: formatCompact(metrics.impressions), icon: EyeScannerIcon, tint: "bg-[#EAF1FF] text-[#1E40AF]" },
    { label: "Clicks", value: formatCompact(metrics.clicks), icon: ClicksIcon, tint: "bg-[#F0E8FF] text-[#6D28D9]" },
    { label: "Wallet Conn.", value: formatCompact(metrics.walletConnects), icon: WalletIcon, tint: "bg-[#E8F5E9] text-[#15803D]" },
    { label: "On-chain Conv.", value: formatCompact(metrics.onChainConvs), icon: OnChainIcon, tint: "bg-[#FFF7E0] text-[#A16207]" },
  ]

  return (
    <div className="flex flex-col gap-3">
      <KpiStrip kpis={KPIS} rangeDays={rangeDays} />

      <div className="grid gap-3 lg:grid-cols-2">
        <PacingCard
          icon={SpendIcon}
          label="Budget pacing"
          primary={`${centsToUsd(spent)} of ${centsToUsd(budget)}`}
          sub={`${centsToUsd(remaining)} remaining · ${spentPct}% spent`}
          pct={spentPct}
          warn={spentPct >= 90}
          rightLabel="CPM realized"
          rightValue={cpm > 0 ? centsToUsd(Math.round(cpm)) : "—"}
        />
        <PacingCard
          icon={CalendarCheckIcon}
          label="Schedule pacing"
          primary={daysTotal != null ? `Day ${daysElapsed} of ${daysTotal}` : `${daysElapsed} days running`}
          sub={`Started ${dateLabel(start)}${end ? ` · ends ${dateLabel(end)}` : " · open-ended"}`}
          pct={timePct ?? 0}
          neutral={timePct == null}
          rightLabel="CTR"
          rightValue={`${ctr.toFixed(2)}%`}
        />
      </div>

      <SectionCard icon={CampaignsIcon} title="Targeting summary">
        {!campaign.targeting || isEmpty(campaign.targeting) ? (
          <p className="text-[11px] text-muted-foreground">No targeting configured yet.</p>
        ) : (
          <div className="grid gap-2.5 lg:grid-cols-2">
            <ChainRow label="Chains" chains={campaign.targeting.chains ?? []} empty="Any" />
            <DeviceRow label="Devices" devices={campaign.targeting.deviceTypes ?? []} empty="Any" />
            <GeoRow label="Geos" codes={campaign.targeting.geos ?? []} empty="Worldwide" />
            <ChipRow label="Segments" items={selectedSegments} empty="None" />
            <MetaRow label="Min wallet age" value={campaign.targeting.minWalletAgeDays != null ? `${campaign.targeting.minWalletAgeDays} days` : "—"} />
            <MetaRow label="Min portfolio" value={campaign.targeting.minPortfolioUsdCents != null ? centsToUsd(campaign.targeting.minPortfolioUsdCents) : "—"} />
            {campaign.targeting.holdsAnyContract.length > 0 && (
              <MetaRow label="Holds any of" value={`${campaign.targeting.holdsAnyContract.length} contract${campaign.targeting.holdsAnyContract.length > 1 ? "s" : ""}`} />
            )}
            {campaign.targeting.excludesContracts.length > 0 && (
              <MetaRow label="Excludes" value={`${campaign.targeting.excludesContracts.length} contract${campaign.targeting.excludesContracts.length > 1 ? "s" : ""}`} />
            )}
          </div>
        )}
      </SectionCard>

      <SectionCard icon={GearIcon} title="Configuration">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-4">
          <Field label="Objective" value={campaign.objective.replace(/_/g, " ").toLowerCase()} capitalize />
          <Field label="Pricing" value={campaign.pricingModel} />
          <Field label="Bid strategy" value={campaign.bidStrategy.replace(/_/g, " ").toLowerCase()} capitalize />
          <Field label="Pacing" value={campaign.pacing.toLowerCase()} capitalize />
          <Field label="Budget" value={centsToUsd(budget)} />
          <Field label="Daily cap" value={campaign.dailyCapUsdCents ? centsToUsd(campaign.dailyCapUsdCents) : "—"} />
          <Field label={`Bid (${campaign.pricingModel})`} value={centsToUsd(campaign.bidUsdCents)} />
          <Field
            label="Frequency cap"
            value={
              campaign.frequencyCapPerWallet
                ? `${campaign.frequencyCapPerWallet}/${campaign.frequencyCapHours ?? 24}h`
                : "—"
            }
          />
          <Field label="Conversion contract" value={truncate(campaign.conversionContract) ?? "—"} mono />
          <Field label="Conversion event" value={campaign.conversionEvent ?? "—"} mono />
          <Field
            label="Attribution window"
            value={campaign.conversionWindowDays ? `${campaign.conversionWindowDays} days` : "—"}
          />
          <Field label="Creatives" value={`${campaign.creatives.length} live`} />
          <Field label="Created" value={dateLabel(campaign.createdAt)} />
          <Field
            label="Brand safety"
            value={campaign.brandSafetyKeywords.length ? `${campaign.brandSafetyKeywords.length} keywords` : "—"}
          />
        </div>
        {campaign.description && (
          <div className="mt-4 pt-3 border-t border-dashed border-[rgba(55,50,47,0.1)]">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Description</div>
            <p className="text-xs text-[#37322F] leading-relaxed">{campaign.description}</p>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

function isEmpty(t: Targeting): boolean {
  return (
    t.chains.length === 0 &&
    t.deviceTypes.length === 0 &&
    t.geos.length === 0 &&
    t.segmentIds.length === 0 &&
    t.holdsAnyContract.length === 0 &&
    t.excludesContracts.length === 0 &&
    t.minWalletAgeDays == null &&
    t.minPortfolioUsdCents == null
  )
}
