import type { Campaign, Targeting, Creative, WalletSegment } from "@prisma/client"
import { centsToUsd, formatCompact } from "@/lib/money"
import { chainName } from "@/lib/chains"
import { Card, CardContent } from "@/components/ui/card"
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
            <ChipRow label="Chains" items={(campaign.targeting.chains ?? []).map(chainName)} empty="Any" />
            <ChipRow label="Devices" items={(campaign.targeting.deviceTypes ?? []).map((d) => d.toLowerCase())} empty="Any" capitalize />
            <ChipRow label="Geos" items={campaign.targeting.geos ?? []} empty="Worldwide" />
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

type Kpi = { label: string; value: string; icon: React.ElementType; tint: string }

function KpiStrip({ kpis, rangeDays }: { kpis: Kpi[]; rangeDays: number }): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.08)] px-3 py-1.5">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Performance</span>
        <span className="text-[10px] text-muted-foreground tabular-nums">Last {rangeDays} days</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(55,50,47,0.08)]">
        {kpis.map((k) => (
          <div key={k.label} className="px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{k.label}</span>
              <div className={`flex h-5 w-5 items-center justify-center rounded-md ${k.tint}`}>
                <k.icon className="size-3" />
              </div>
            </div>
            <div className="text-[20px] font-medium tracking-tight tabular-nums text-[#37322F] leading-none">{k.value}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}

interface PacingCardProps {
  icon: React.ElementType
  label: string
  primary: string
  sub: string
  pct: number
  warn?: boolean
  neutral?: boolean
  rightLabel: string
  rightValue: string
}

function PacingCard({ icon: Icon, label, primary, sub, pct, warn, neutral, rightLabel, rightValue }: PacingCardProps): React.JSX.Element {
  const barColor = neutral ? "bg-[rgba(55,50,47,0.4)]" : warn ? "bg-[#C2410C]" : "bg-[#37322F]"
  return (
    <Card className="py-3 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="px-3.5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            <Icon className="size-3" />
            {label}
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{rightLabel}</div>
            <div className="text-xs font-medium text-[#37322F] tabular-nums">{rightValue}</div>
          </div>
        </div>
        <div className="text-[15px] font-medium tracking-tight text-[#37322F] tabular-nums">{primary}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(55,50,47,0.08)]">
          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
        </div>
      </CardContent>
    </Card>
  )
}

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
        <Icon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{title}</h3>
      </div>
      <CardContent className="p-3.5">{children}</CardContent>
    </Card>
  )
}

function ChipRow({ label, items, empty, capitalize }: { label: string; items: string[]; empty: string; capitalize?: boolean }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      {items.length === 0 ? (
        <span className="text-[11px] text-muted-foreground italic">{empty}</span>
      ) : (
        <div className="flex flex-wrap gap-1">
          {items.map((it) => (
            <span key={it} className={`rounded-full bg-[#F0ECE6] px-2 py-0.5 text-[10px] font-medium text-[#37322F] ${capitalize ? "capitalize" : ""}`}>
              {it}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function MetaRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between border-t border-dashed border-[rgba(55,50,47,0.1)] pt-2 col-span-1 lg:col-span-2">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-[#37322F] tabular-nums">{value}</span>
    </div>
  )
}

function Field({ label, value, mono, capitalize }: { label: string; value: string; mono?: boolean; capitalize?: boolean }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-xs font-medium text-[#37322F] mt-1 ${mono ? "font-mono" : ""} ${capitalize ? "capitalize" : ""} truncate`}>{value}</div>
    </div>
  )
}

function dateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function truncate(s: string | null): string | null {
  if (!s) return null
  return s.length > 14 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s
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
