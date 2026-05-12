import type { Chain } from "@prisma/client"
import type { WizardState } from "@/hooks/useCampaignWizard"
import { Card, CardContent } from "@/components/ui/card"
import { FORMAT_LABELS } from "@/lib/creatives"
import { ChainBadge } from "@/components/ChainBadge"
import { DeviceBadge } from "@/components/DeviceBadge"
import { GeoBadge } from "@/components/GeoBadge"
import { SpendIcon, CalendarCheckIcon, AudiencesIcon } from "@/icons"
import { WizardReviewHero } from "./WizardReviewHero"

interface Props {
  state: WizardState
}

function Row({
  label,
  value,
  capitalize,
}: {
  label: string
  value: string
  capitalize?: boolean
}): React.JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-dashed border-[rgba(55,50,47,0.08)] last:border-b-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className={`text-[12px] font-medium text-[#37322F] tabular-nums text-right ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}

function BadgeRow({
  label,
  empty,
  children,
}: {
  label: string
  empty: string
  children: React.ReactNode
}): React.JSX.Element {
  const arr = Array.isArray(children) ? children : [children]
  const hasItems = arr.length > 0 && arr.some(Boolean)
  return (
    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-dashed border-[rgba(55,50,47,0.08)] last:border-b-0">
      <span className="text-[11px] text-muted-foreground shrink-0 pt-0.5">{label}</span>
      {hasItems ? (
        <div className="flex flex-wrap gap-1 justify-end">{children}</div>
      ) : (
        <span className="text-[11px] text-[#37322F]/70 italic">{empty}</span>
      )}
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  tint,
  children,
}: {
  title: string
  icon: React.ElementType
  tint: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="rounded-lg border border-[rgba(55,50,47,0.1)] bg-[#FFFFFF] p-3 space-y-1">
      <div className="flex items-center gap-1.5 pb-1.5">
        <span className={`flex size-4 items-center justify-center rounded-md ${tint}`}>
          <Icon className="size-2.5" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#37322F]">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

export function WizardReview({ state }: Props): React.JSX.Element {
  const geoList = state.geos
    .split(/[\s,]+/)
    .map((g) => g.trim().toUpperCase())
    .filter((g) => g.length === 2)

  const chainList = state.chains as Chain[]
  const safetyCount = state.brandSafety
    ? state.brandSafety.split(",").filter((s) => s.trim()).length
    : 0

  return (
    <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <CardContent className="p-4 space-y-3">
        <WizardReviewHero state={state} />

        <div className="grid gap-3 lg:grid-cols-2">
          <Section title="Budget & bidding" icon={SpendIcon} tint="bg-[#FFF3E8] text-[#C2410C]">
            <Row label="Total budget" value={`$${Number(state.budgetUsd).toLocaleString()}`} />
            {state.dailyCapUsd && (
              <Row label="Daily cap" value={`$${Number(state.dailyCapUsd).toLocaleString()}`} />
            )}
            <Row label={`Bid (${state.pricingModel})`} value={`$${state.bidUsd}`} />
            <Row
              label="Bid strategy"
              value={state.bidStrategy.replace(/_/g, " ").toLowerCase()}
              capitalize
            />
            <Row label="Pacing" value={state.pacing.toLowerCase()} capitalize />
          </Section>

          <Section title="Targeting" icon={AudiencesIcon} tint="bg-[#FFE8F0] text-[#BE185D]">
            <BadgeRow label="Chains" empty="All chains">
              {chainList.map((c) => (
                <ChainBadge key={c} chain={c} size="md" />
              ))}
            </BadgeRow>
            <BadgeRow label="Geos" empty="Worldwide">
              {geoList.map((g) => (
                <GeoBadge key={g} code={g} size="md" />
              ))}
            </BadgeRow>
            <BadgeRow label="Devices" empty="All devices">
              {state.deviceTypes.map((d) => (
                <DeviceBadge key={d} device={d} size="md" />
              ))}
            </BadgeRow>
            <Row
              label="Frequency cap"
              value={state.freqCap ? `${state.freqCap} per ${state.freqHours}h` : "None"}
            />
            <Row
              label="Brand safety"
              value={
                safetyCount > 0
                  ? `${safetyCount} keyword${safetyCount > 1 ? "s" : ""}`
                  : "None"
              }
            />
          </Section>
        </div>

        <Section
          title={`Ads · ${state.ads.length}`}
          icon={CalendarCheckIcon}
          tint="bg-[#F0E8FF] text-[#6D28D9]"
        >
          {state.ads.length === 0 ? (
            <p className="text-[11px] text-muted-foreground italic py-1">
              No ads yet — add creatives from the campaign page after saving.
            </p>
          ) : (
            <div className="space-y-0">
              {state.ads.map((ad) => (
                <div
                  key={ad.id}
                  className="flex items-center justify-between gap-2 py-1.5 border-b border-dashed border-[rgba(55,50,47,0.08)] last:border-b-0"
                >
                  <span className="text-[12px] font-medium text-[#37322F] truncate">{ad.name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground shrink-0">
                    {FORMAT_LABELS[ad.format]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Section>
      </CardContent>
    </Card>
  )
}
