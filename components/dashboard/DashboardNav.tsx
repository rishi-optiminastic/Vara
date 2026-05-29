"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
  CampaignsIcon,
  AssetsIcon,
  AudiencesIcon,
  GearIcon,
  NavOverviewIcon,
  NavRecommendationsIcon,
  NavInsightsIcon,
  NavAuctionInsightsIcon,
  NavSearchTermsIcon,
  NavChannelPerformanceIcon,
  NavLandingPagesIcon,
  NavReportEditorIcon,
  NavDashboardsIcon,
  NavCampaignsItemIcon,
  NavAdGroupsIcon,
  NavAdsIcon,
  NavExperimentsIcon,
  NavConversionsIcon,
  NavMeasurementSetupIcon,
  NavProductsItemIcon,
  NavFeedsIcon,
  NavAudiencesItemIcon,
  NavKeywordsIcon,
  NavPlacementsIcon,
  NavBillingSummaryIcon,
  NavTransactionsIcon,
  NavAccountSettingsIcon,
  NavAccessSecurityIcon,
  NavPreferencesIcon,
  NavChangeHistoryIcon,
  BoxPlusIcon,
} from "@/icons"

type NavItem = { label: string; href: string; icon: React.ElementType }
type NavGroup = { label?: string; items: NavItem[] }

type NavCta = { label: string; href: string }

export type NavSection = {
  id: string
  label: string
  icon: React.ElementType
  cta?: NavCta
  groups: NavGroup[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "campaigns",
    label: "Campaigns",
    icon: CampaignsIcon,
    // cta: { label: "New campaign", href: "/dashboard/campaigns/new" },
    groups: [
      {
        items: [
          { label: "Overview", href: "/dashboard", icon: NavOverviewIcon },
          { label: "Recommendations", href: "/dashboard/recommendations", icon: NavRecommendationsIcon },
          { label: "Assets", href:"/dashboard/assets",icon:AssetsIcon}
        ],
      },
      {
        label: "Campaigns",
        items: [
          { label: "Campaigns", href: "/dashboard/campaigns", icon: NavCampaignsItemIcon },
          { label: "Ad groups", href: "/dashboard/ad-groups", icon: NavAdGroupsIcon },
          { label: "Ads", href: "/dashboard/ads", icon: NavAdsIcon },
          { label: "Experiments", href: "#", icon: NavExperimentsIcon },
        ],
      },
      {
        label: "Insights & reports",
        items: [
          { label: "Insights", href: "/dashboard/analytics", icon: NavInsightsIcon },
          { label: "Auction insights", href: "/dashboard/auction-insights", icon: NavAuctionInsightsIcon },
          { label: "Search terms", href: "/dashboard/search-terms", icon: NavSearchTermsIcon },
          { label: "Channel performance", href: "/dashboard/channels", icon: NavChannelPerformanceIcon },
          { label: "Landing pages", href: "/dashboard/landing-pages", icon: NavLandingPagesIcon },
          { label: "Report editor", href: "#", icon: NavReportEditorIcon },
          { label: "Dashboards", href: "#", icon: NavDashboardsIcon },
        ],
      },
    ],
  },
  {
    id: "audiences",
    label: "Audiences & products",
    icon: AudiencesIcon,
    cta: { label: "New audience", href: "/dashboard/segments" },
    groups: [
      {
        label: "Audiences",
        items: [
          { label: "Audiences", href: "/dashboard/segments", icon: NavAudiencesItemIcon },
          { label: "Keywords", href: "#", icon: NavKeywordsIcon },
          { label: "Content / Placements", href: "/dashboard/chains", icon: NavPlacementsIcon },
        ],
      },
      {
        label: "Products",
        items: [
          { label: "Products", href: "#", icon: NavProductsItemIcon },
          { label: "Feeds", href: "#", icon: NavFeedsIcon },
        ],
      },
      {
        label: "Goals",
        items: [
          { label: "Conversions", href: "#", icon: NavConversionsIcon },
          { label: "Measurement setup", href: "#", icon: NavMeasurementSetupIcon },
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
        label: "Admin",
        items: [
          { label: "Account settings", href: "/dashboard/settings", icon: NavAccountSettingsIcon },
          { label: "Access & security", href: "#", icon: NavAccessSecurityIcon },
          { label: "Preferences", href: "#", icon: NavPreferencesIcon },
        ],
      },
      {
        label: "Billing",
        items: [
          { label: "Billing summary", href: "/dashboard/settings?tab=wallet", icon: NavBillingSummaryIcon },
          { label: "Transactions", href: "/dashboard/settings?tab=wallet", icon: NavTransactionsIcon },
        ],
      },
      { label: "Change history", items: [{ label: "Change history", href: "#", icon: NavChangeHistoryIcon }] },
    ],
  },
]

function isActive(href: string, pathname: string): boolean {
  if (href === "#") return false
  return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href)
}

interface Props {
  sectionId: string
  onToggle: () => void
}

export function DashboardNav({ sectionId, onToggle }: Props): React.JSX.Element {
  const pathname = usePathname()
  const section = NAV_SECTIONS.find((s) => s.id === sectionId) ?? NAV_SECTIONS[0]!

  return (
    <div className="flex h-full w-48 flex-col overflow-hidden">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-dashed border-[rgba(10,10,10,0.15)] px-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0A0A0A]/55">
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
      {section.cta && (
        <div className="border-b border-dashed border-[rgba(10,10,10,0.12)] p-2">
          <Link
            href={section.cta.href}
            className="group flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-[#1F40CD] text-[11px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(31,64,205,0.25)] hover:bg-[#1A36B0] transition-colors"
          >
            <BoxPlusIcon className="size-3" />
            <span>{section.cta.label}</span>
          </Link>
        </div>
      )}
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
                      ? "bg-[#1F40CD] text-white font-medium shadow-[0_1px_0_rgba(0,0,0,0.05)]"
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
