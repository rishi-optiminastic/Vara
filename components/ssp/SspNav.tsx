"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
  NavOverviewIcon,
  NavPlacementsIcon,
  NavInsightsIcon,
  NavTransactionsIcon,
  NavBillingSummaryIcon,
  NavAccountSettingsIcon,
  NavPreferencesIcon,
  AssetsIcon,
  ReceiptIcon,
  GearIcon,
  GaugeIcon,
} from "@/icons"

type NavItem = { label: string; href: string; icon: React.ElementType }
type NavGroup = { label?: string; items: NavItem[] }

export type SspNavSection = {
  id: string
  label: string
  icon: React.ElementType
  groups: NavGroup[]
}

// Single source of truth for the SSP sidebar. Mirrors the DSP NAV_SECTIONS
// shape so the rail/panel components can stay structurally identical and we
// only swap content + the accent colour.
export const SSP_NAV_SECTIONS: SspNavSection[] = [
  {
    id: "publisher",
    label: "Publisher",
    icon: AssetsIcon,
    groups: [
      {
        items: [
          { label: "Overview", href: "/ssp/dashboard", icon: NavOverviewIcon },
          { label: "Inventory", href: "/ssp/dashboard/inventory", icon: NavPlacementsIcon },
        ],
      },
    ],
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: ReceiptIcon,
    groups: [
      {
        items: [
          { label: "Payouts", href: "/ssp/dashboard/payouts", icon: NavTransactionsIcon },
          { label: "Statements", href: "/ssp/dashboard/payouts", icon: NavBillingSummaryIcon },
        ],
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    icon: GaugeIcon,
    groups: [
      {
        items: [
          { label: "Analytics", href: "#", icon: NavInsightsIcon },
        ],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: GearIcon,
    groups: [
      {
        items: [
          { label: "Account", href: "#", icon: NavAccountSettingsIcon },
          { label: "Preferences", href: "#", icon: NavPreferencesIcon },
        ],
      },
    ],
  },
]

function isActive(href: string, pathname: string): boolean {
  if (href === "#") return false
  return href === "/ssp/dashboard" ? pathname === "/ssp/dashboard" : pathname.startsWith(href)
}

interface Props {
  sectionId: string
  onToggle: () => void
}

export function SspNav({ sectionId, onToggle }: Props): React.JSX.Element {
  const pathname = usePathname()
  const section = SSP_NAV_SECTIONS.find((s) => s.id === sectionId) ?? SSP_NAV_SECTIONS[0]!

  return (
    <div className="flex h-full w-48 flex-col overflow-hidden">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-dashed border-[rgba(10,10,10,0.15)] px-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0A0A0A]">
          {section.label}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-[#0A0A0A]/[0.04] hover:text-[#0A0A0A] transition-colors"
          title="Close panel"
        >
          <ChevronLeft className="size-3" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-1.5 py-2">
        {section.groups.map((group, gi) => (
          <div
            key={gi}
            className={gi > 0 ? "mt-2 border-t border-dashed border-[rgba(10,10,10,0.12)] pt-3" : ""}
          >
            {group.label && (
              <p className="px-2 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#0A0A0A]/55">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href, pathname)
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] transition-colors ${
                    active
                      ? "bg-[#B45309] text-white font-medium shadow-[0_1px_0_rgba(0,0,0,0.05)]"
                      : "text-[#0A0A0A]/85 hover:bg-[#0A0A0A]/[0.05] hover:text-[#0A0A0A]"
                  }`}
                >
                  <Icon
                    className={`size-3.5 shrink-0 transition-opacity ${
                      active ? "opacity-100" : "opacity-60 group-hover:opacity-90"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
