"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import {
  CampaignsIcon,
  InsightsIcon,
  AssetsIcon,
  ProductsIcon,
  AudiencesIcon,
  GoalsIcon,
  GearIcon,
  ReceiptIcon,
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
  NavAssetsItemIcon,
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
} from "@/icons"

type NavItem = { label: string; href: string; icon: React.ElementType }
type NavGroup = { label?: string; items: NavItem[] }

export type NavSection = {
  id: string
  label: string
  icon: React.ElementType
  groups: NavGroup[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: "campaigns",
    label: "Campaigns",
    icon: CampaignsIcon,
    groups: [
      {
        items: [
          { label: "Overview", href: "/dashboard", icon: NavOverviewIcon },
          { label: "Recommendations", href: "/dashboard/recommendations", icon: NavRecommendationsIcon },
        ],
      },
      {
        label: "Insights & reports",
        items: [
          { label: "Insights", href: "/dashboard/analytics", icon: NavInsightsIcon },
          { label: "Auction insights", href: "/dashboard/auction-insights", icon: NavAuctionInsightsIcon },
          { label: "Search terms", href: "/dashboard/search-terms", icon: NavSearchTermsIcon },
          { label: "Channel performance", href: "#", icon: NavChannelPerformanceIcon },
          { label: "Landing pages", href: "#", icon: NavLandingPagesIcon },
          { label: "Report editor", href: "#", icon: NavReportEditorIcon },
          { label: "Dashboards", href: "#", icon: NavDashboardsIcon },
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
        label: "Goals",
        items: [
          { label: "Conversions", href: "#", icon: NavConversionsIcon },
          { label: "Measurement setup", href: "#", icon: NavMeasurementSetupIcon },
        ],
      },
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: AssetsIcon,
    groups: [{ items: [{ label: "Assets", href: "#", icon: NavAssetsItemIcon }] }],
  },
  {
    id: "products",
    label: "Products",
    icon: ProductsIcon,
    groups: [
      {
        items: [
          { label: "Products", href: "#", icon: NavProductsItemIcon },
          { label: "Feeds", href: "#", icon: NavFeedsIcon },
        ],
      },
    ],
  },
  {
    id: "insights",
    label: "Insights & reports",
    icon: InsightsIcon,
    groups: [
      {
        items: [
          { label: "Insights", href: "/dashboard/analytics", icon: NavInsightsIcon },
          { label: "Auction insights", href: "/dashboard/auction-insights", icon: NavAuctionInsightsIcon },
          { label: "Search terms", href: "/dashboard/search-terms", icon: NavSearchTermsIcon },
          { label: "Channel performance", href: "#", icon: NavChannelPerformanceIcon },
          { label: "Landing pages", href: "#", icon: NavLandingPagesIcon },
          { label: "Report editor", href: "#", icon: NavReportEditorIcon },
          { label: "Dashboards", href: "#", icon: NavDashboardsIcon },
        ],
      },
    ],
  },
  {
    id: "audiences",
    label: "Audiences & content",
    icon: AudiencesIcon,
    groups: [
      {
        items: [
          { label: "Audiences", href: "/dashboard/segments", icon: NavAudiencesItemIcon },
          { label: "Keywords", href: "#", icon: NavKeywordsIcon },
          { label: "Content / Placements", href: "/dashboard/chains", icon: NavPlacementsIcon },
        ],
      },
    ],
  },
  {
    id: "goals",
    label: "Goals",
    icon: GoalsIcon,
    groups: [
      {
        items: [
          { label: "Conversions", href: "#", icon: NavConversionsIcon },
          { label: "Measurement setup", href: "#", icon: NavMeasurementSetupIcon },
        ],
      },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: ReceiptIcon,
    groups: [
      {
        items: [
          { label: "Billing summary", href: "#", icon: NavBillingSummaryIcon },
          { label: "Transactions", href: "#", icon: NavTransactionsIcon },
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
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[rgba(55,50,47,0.15)] px-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#1f40cd]">
          {section.label}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-5 w-5 items-center justify-center text-[#1f40cd]/55 hover:bg-[#1f40cd]/8 hover:text-[#1f40cd] transition-colors"
          title="Close panel"
        >
          <ChevronLeft className="size-3" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {section.groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? "mt-3" : ""}>
            {group.label && (
              <p className="px-3 pb-1 text-[9px] font-medium uppercase tracking-[0.16em] text-[#37322F]/45">
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
                  className={`flex items-center gap-2 px-3 py-1.5 text-[12px] transition-colors ${
                    active
                      ? "bg-[#1f40cd] text-white font-medium"
                      : "text-[#37322F]/75 hover:bg-[#1f40cd]/8 hover:text-[#1f40cd]"
                  }`}
                >
                  <Icon className={`size-3.5 shrink-0 ${active ? "opacity-100" : "opacity-65"}`} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
