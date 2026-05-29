"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import type { User, Advertiser } from "@prisma/client"
import { BellIcon, SearchIcon, UsdcIcon, LabelInfoIcon } from "@/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconRail } from "@/components/dashboard/IconRail"
import { DashboardNav, NAV_SECTIONS } from "@/components/dashboard/DashboardNav"
import { DemoTopUpButton } from "@/components/dashboard/DemoTopUpButton"

function initialSection(pathname: string): string {
  if (pathname.startsWith("/dashboard/settings")) return "settings"
  if (pathname.startsWith("/dashboard/analytics")) return "insights"
  if (pathname.startsWith("/dashboard/segments") || pathname.startsWith("/dashboard/chains")) return "audiences"
  return "campaigns"
}

interface Crumb {
  sectionLabel: string
  pageLabel: string
}

function resolveCrumb(pathname: string): Crumb {
  for (const section of NAV_SECTIONS) {
    for (const group of section.groups) {
      for (const item of group.items) {
        if (item.href === "#") continue
        const isMatch =
          item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
        if (isMatch) return { sectionLabel: section.label, pageLabel: item.label }
      }
    }
  }
  return { sectionLabel: "Campaigns", pageLabel: "Dashboard" }
}

interface Props {
  user: Pick<User, "id" | "name" | "email">
  advertiser: Pick<Advertiser, "id" | "projectName">
  walletBalanceUsdcCents: number
  children: React.ReactNode
}

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function DashboardShell({ user, advertiser, walletBalanceUsdcCents, children }: Props): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const crumb = resolveCrumb(pathname)
  const [activeSection, setActiveSection] = useState(() => initialSection(pathname))
  const [panelOpen, setPanelOpen] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async (): Promise<void> => {
    if (signingOut) return
    setSigningOut(true)
    await signOut()
    router.push("/")
    router.refresh()
  }

  const handleSectionClick = (id: string): void => {
    if (id === activeSection && panelOpen) {
      setPanelOpen(false)
    } else {
      setActiveSection(id)
      setPanelOpen(true)
    }
  }

  const section = NAV_SECTIONS.find((s) => s.id === activeSection)

  return (
    <div className="flex h-screen overflow-hidden bg-[#ECEAE2]">
      <IconRail
        user={user}
        activeSection={activeSection}
        panelOpen={panelOpen}
        onSectionClick={handleSectionClick}
        onSignOut={handleSignOut}
      />

      {/* Sliding nav panel */}
      <div
        style={{ width: panelOpen ? "12rem" : 0 }}
        className="overflow-hidden border-r border-dashed border-[rgba(10,10,10,0.15)] bg-[#ECEAE2] shrink-0 transition-[width] duration-200 ease-in-out"
      >
        <DashboardNav sectionId={activeSection} onToggle={() => setPanelOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-11 shrink-0 items-center gap-3 border-b border-dashed border-[rgba(10,10,10,0.15)] bg-white px-4">
          <div className="relative w-64 shrink-0">
            <SearchIcon className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns, wallets, chains…"
              className="h-8 pl-7 pr-12 text-[12px] bg-white rounded-full border-[rgba(10,10,10,0.12)] focus-visible:border-[#1F40CD] focus-visible:ring-0 placeholder:text-muted-foreground"
            />
            <kbd
              aria-hidden
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[rgba(10,10,10,0.14)] bg-[#0A0A0A]/[0.03] px-1 py-0.5 text-[9px] font-semibold tabular-nums tracking-widest text-[#0A0A0A]/55"
            >
              ⌘K
            </kbd>
          </div>

          <div className="min-w-0 flex items-center gap-1.5 text-[11px]">
            <span className="font-semibold uppercase tracking-widest text-[#0A0A0A]/45">
              {crumb.sectionLabel}
            </span>
            <span aria-hidden className="text-[#0A0A0A]/25">/</span>
            <span className="font-medium text-[#0A0A0A] truncate">{crumb.pageLabel}</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <DemoTopUpButton />
            <Link
              href="/dashboard/settings?tab=wallet"
              title="Ad wallet · USDC"
              className="flex items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.12)] bg-white px-2.5 py-1 text-[#0A0A0A] transition-colors hover:border-[#1F40CD] hover:text-[#1F40CD]"
            >
              <UsdcIcon className="size-3.5" />
              <span className="text-[11px] font-medium tabular-nums">
                {formatUsdc(walletBalanceUsdcCents)}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">USDC</span>
            </Link>
            <span aria-hidden className="h-4 w-px bg-[rgba(10,10,10,0.12)]" />
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-[#0A0A0A]/[0.04]"
              title="Help & docs"
            >
              <Link href="#">
                <LabelInfoIcon className="size-3.5 text-[#0A0A0A]/65" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full relative hover:bg-[#0A0A0A]/[0.04]">
              <BellIcon className="size-3.5 text-[#0A0A0A]" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#1F40CD] ring-2 ring-[#ECEAE2]" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
