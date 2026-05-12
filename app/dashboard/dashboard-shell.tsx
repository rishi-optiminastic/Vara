"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import type { User, Advertiser } from "@prisma/client"
import { BellIcon, SearchIcon, UsdcIcon } from "@/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { IconRail } from "@/components/dashboard/IconRail"
import { DashboardNav, NAV_SECTIONS } from "@/components/dashboard/DashboardNav"

function initialSection(pathname: string): string {
  if (pathname.startsWith("/dashboard/settings")) return "settings"
  if (pathname.startsWith("/dashboard/analytics")) return "insights"
  if (pathname.startsWith("/dashboard/segments") || pathname.startsWith("/dashboard/chains")) return "audiences"
  return "campaigns"
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
        className="overflow-hidden border-r border-[rgba(55,50,47,0.15)] bg-[#ECEAE2] shrink-0 transition-[width] duration-200 ease-in-out"
      >
        <DashboardNav sectionId={activeSection} onToggle={() => setPanelOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-11 shrink-0 items-center gap-2 border-b border-[rgba(55,50,47,0.15)] bg-[#ECEAE2] px-4">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-[#1f40cd]/55" />
            <Input
              placeholder="Search campaigns, wallets, chains…"
              className="h-7 pl-7 text-[12px] bg-transparent border-0 border-b border-[#37322F]/25 rounded-none focus-visible:border-[#1f40cd] focus-visible:ring-0 placeholder:text-[#37322F]/40"
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/dashboard/settings?tab=wallet"
              title="Ad wallet · USDC"
              className="flex items-center gap-1.5 border border-[#1f40cd] px-2.5 py-1 text-[#1f40cd] transition-colors hover:bg-[#1f40cd]/5"
            >
              <UsdcIcon className="size-3.5" />
              <span className="text-[11px] font-medium tabular-nums">
                {formatUsdc(walletBalanceUsdcCents)}
              </span>
              <span className="text-[9px] uppercase tracking-[0.14em] opacity-70">USDC</span>
            </Link>
            <Button variant="ghost" size="icon" className="h-7 w-7 relative hover:bg-[#1f40cd]/8">
              <BellIcon className="size-3.5 text-[#1f40cd]" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#c2410c] ring-2 ring-[#ECEAE2]" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
