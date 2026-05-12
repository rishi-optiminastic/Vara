import type { WizardState } from "@/hooks/useCampaignWizard"
import {
  SpendIcon,
  CalendarCheckIcon,
  GaugeIcon,
  CircleCheckIcon,
} from "@/icons"

interface Props {
  state: WizardState
}

function formatDate(iso: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function dayDiff(a: string, b: string): number | null {
  if (!a || !b) return null
  const start = new Date(a).getTime()
  const end = new Date(b).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return null
  return Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)))
}

interface Tile {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  tint: string
}

function buildTiles(state: WizardState): Tile[] {
  const days = dayDiff(state.startDate, state.endDate)
  const budget = Number(state.budgetUsd || 0)
  const dailyImplied = days ? budget / days : null
  return [
    {
      label: "Total budget",
      value: budget > 0 ? `$${budget.toLocaleString()}` : "—",
      sub: dailyImplied ? `≈ $${dailyImplied.toFixed(2)}/day` : "Open-ended",
      icon: SpendIcon,
      tint: "bg-[#FFF3E8] text-[#C2410C]",
    },
    {
      label: "Bid",
      value: `$${state.bidUsd}`,
      sub: `${state.pricingModel} · ${state.bidStrategy.replace(/_/g, " ").toLowerCase()}`,
      icon: GaugeIcon,
      tint: "bg-[#EAF1FF] text-[#1E40AF]",
    },
    {
      label: "Schedule",
      value: state.endDate
        ? `${days} day${days && days > 1 ? "s" : ""}`
        : "Open-ended",
      sub: state.endDate
        ? `${formatDate(state.startDate)} → ${formatDate(state.endDate)}`
        : `Starts ${formatDate(state.startDate)}`,
      icon: CalendarCheckIcon,
      tint: "bg-[#F0E8FF] text-[#6D28D9]",
    },
  ]
}

export function WizardReviewHero({ state }: Props): React.JSX.Element {
  const isActive = state.status === "ACTIVE"
  const tiles = buildTiles(state)

  return (
    <div className="rounded-xl border border-[rgba(55,50,47,0.12)] bg-gradient-to-br from-[#FFFFFF] to-[#FAF8F5] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Review & launch
          </div>
          <h2 className="text-base font-medium text-[#37322F] tracking-tight mt-0.5">
            {state.name || "Untitled campaign"}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">
            {state.objective.replace(/_/g, " ").toLowerCase()} ·{" "}
            {state.vertical.replace(/_/g, " ").toLowerCase()}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest shrink-0 ${
            isActive
              ? "bg-[#F0F7EE] text-[#15803D]"
              : "bg-[#F0ECE6] text-[#37322F]/70"
          }`}
        >
          {isActive ? <CircleCheckIcon className="size-2.5" /> : null}
          {isActive ? "Going live" : "Saving as draft"}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => {
          const Icon = t.icon
          return (
            <div
              key={t.label}
              className="rounded-lg border border-[rgba(55,50,47,0.08)] bg-white p-2.5 space-y-1"
            >
              <div className="flex items-center gap-1.5">
                <span className={`flex size-4 items-center justify-center rounded-md ${t.tint}`}>
                  <Icon className="size-2.5" />
                </span>
                <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
                  {t.label}
                </span>
              </div>
              <div className="text-base font-medium tracking-tight text-[#37322F] tabular-nums leading-none">
                {t.value}
              </div>
              <div className="text-[10px] text-muted-foreground tabular-nums truncate">{t.sub}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
