import type { Chain } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { FORMAT_LABELS } from "@/lib/creatives"
import { ChainBadge } from "@/components/ChainBadge"
import { DeviceBadge } from "@/components/DeviceBadge"
import { GeoBadge } from "@/components/GeoBadge"

interface Props {
  state: WizardState
}

function Row({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-[#37322F] tabular-nums capitalize">{value}</span>
    </div>
  )
}

interface BadgeRowProps {
  label: string
  empty: string
  children: React.ReactNode
}

function BadgeRow({ label, empty, children }: BadgeRowProps): React.JSX.Element {
  const arr = Array.isArray(children) ? children : [children]
  const hasItems = arr.length > 0 && arr.some(Boolean)
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-[11px] text-muted-foreground shrink-0 pt-0.5">{label}</span>
      {hasItems ? (
        <div className="flex flex-wrap gap-1 justify-end">{children}</div>
      ) : (
        <span className="text-[11px] font-medium text-[#37322F] italic">{empty}</span>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="space-y-0.5 border-b border-[rgba(55,50,47,0.07)] pb-3 last:border-0 last:pb-0">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">{title}</div>
      {children}
    </div>
  )
}

function AnalyticsPreview(): React.JSX.Element {
  const kpis = [
    { label: "Impressions", color: "bg-[#EAF1FF] text-[#1E40AF]" },
    { label: "Clicks", color: "bg-[#F0E8FF] text-[#6D28D9]" },
    { label: "CTR", color: "bg-[#FFF3E8] text-[#C2410C]" },
    { label: "Spend", color: "bg-[#E8F5E9] text-[#15803D]" },
  ]
  return (
    <div className="rounded-xl border border-dashed border-[rgba(55,50,47,0.15)] bg-[#FFFFFF] p-3 space-y-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Analytics preview · live after launch
      </div>
      <div className="grid grid-cols-4 gap-2">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-lg p-2.5 text-center ${k.color}`}>
            <div className="text-[20px] font-medium leading-none mb-1 opacity-40">—</div>
            <div className="text-[9px] uppercase tracking-wider opacity-60">{k.label}</div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60 text-center">
        Real data will appear here once the campaign is live.
      </p>
    </div>
  )
}

export function WizardReview({ state }: Props): React.JSX.Element {
  const geoList = state.geos
    .split(/[\s,]+/)
    .map((g) => g.trim().toUpperCase())
    .filter((g) => g.length === 2)

  const chainList = state.chains as Chain[]
  const isActive = state.status === "ACTIVE"

  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[rgba(55,50,47,0.07)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#37322F]">Review & Launch</h3>
          <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest border ${
            isActive
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-[#F0ECE6] border-[rgba(55,50,47,0.2)] text-[#37322F]"
          }`}>
            {isActive ? "Going live" : "Draft"}
          </span>
        </div>

        <Section title="Campaign">
          <Row label="Name" value={state.name || "—"} />
          <Row label="Objective" value={state.objective.replace(/_/g, " ").toLowerCase()} />
          <Row label="Vertical" value={state.vertical.replace(/_/g, " ").toLowerCase()} />
        </Section>

        <Section title="Budget & Bidding">
          <Row label="Total budget" value={`$${Number(state.budgetUsd).toLocaleString()}`} />
          {state.dailyCapUsd && <Row label="Daily cap" value={`$${Number(state.dailyCapUsd).toLocaleString()}`} />}
          <Row label={`Bid (${state.pricingModel})`} value={`$${state.bidUsd}`} />
          <Row label="Bid strategy" value={state.bidStrategy.replace(/_/g, " ").toLowerCase()} />
          <Row label="Schedule" value={state.endDate ? `${state.startDate} → ${state.endDate}` : `${state.startDate} (open-ended)`} />
        </Section>

        <Section title="Ad Group · Targeting">
          <BadgeRow label="Chains" empty="All chains">
            {chainList.map((c) => <ChainBadge key={c} chain={c} size="md" />)}
          </BadgeRow>
          <BadgeRow label="Geos" empty="Worldwide">
            {geoList.map((g) => <GeoBadge key={g} code={g} size="md" />)}
          </BadgeRow>
          <BadgeRow label="Devices" empty="All devices">
            {state.deviceTypes.map((d) => <DeviceBadge key={d} device={d} size="md" />)}
          </BadgeRow>
          <Row label="Frequency cap" value={state.freqCap ? `${state.freqCap} impr. per ${state.freqHours}h` : "None"} />
          <Row
            label="Placement filters"
            value={
              state.brandSafety
                ? `${state.brandSafety.split(",").filter((s) => s.trim()).length} keyword(s)`
                : "None"
            }
          />
        </Section>

        <Section title="Ads">
          {state.ads.length === 0 ? (
            <p className="text-[11px] text-muted-foreground italic py-1">
              No ads — you can add creatives from the campaign page after saving.
            </p>
          ) : (
            state.ads.map((ad) => (
              <div key={ad.id} className="flex items-center justify-between py-1">
                <span className="text-[11px] text-muted-foreground">{ad.name}</span>
                <span className="text-[10px] font-medium text-[#37322F]">{FORMAT_LABELS[ad.format]}</span>
              </div>
            ))
          )}
        </Section>

        <AnalyticsPreview />
      </CardContent>
    </Card>
  )
}
