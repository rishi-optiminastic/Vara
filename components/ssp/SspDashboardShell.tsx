"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import type { User } from "@prisma/client"
import { BellIcon, SearchIcon, UsdcIcon } from "@/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SspIconRail } from "./SspIconRail"
import { SspNav, SSP_NAV_SECTIONS } from "./SspNav"

function initialSection(pathname: string): string {
  if (pathname.startsWith("/ssp/dashboard/payouts")) return "earnings"
  if (pathname.startsWith("/ssp/dashboard/inventory")) return "publisher"
  return "publisher"
}

interface Props {
  user: Pick<User, "id" | "name" | "email">
  availableUsdcCents?: number
  children: React.ReactNode
}

function formatUsdc(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function SspDashboardShell({
  user,
  availableUsdcCents = 0,
  children,
}: Props): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState(() => initialSection(pathname))
  const [panelOpen, setPanelOpen] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async (): Promise<void> => {
    if (signingOut) return
    setSigningOut(true)
    await signOut()
    router.push("/ssp/sign-in")
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

  void SSP_NAV_SECTIONS // keep import side-effect for future use

  return (
    <div className="flex h-screen overflow-hidden bg-[#ECEAE2]">
      <SspIconRail
        user={user}
        activeSection={activeSection}
        panelOpen={panelOpen}
        onSectionClick={handleSectionClick}
        onSignOut={handleSignOut}
      />

      <div
        style={{ width: panelOpen ? "12rem" : 0 }}
        className="overflow-hidden border-r border-dashed border-[rgba(10,10,10,0.15)] bg-[#ECEAE2] shrink-0 transition-[width] duration-200 ease-in-out"
      >
        <SspNav sectionId={activeSection} onToggle={() => setPanelOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-11 shrink-0 items-center gap-2 border-b border-dashed border-[rgba(10,10,10,0.15)] bg-white px-4">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search placements, statements, payouts…"
              className="h-8 pl-7 text-[12px] bg-white rounded-full border-[rgba(10,10,10,0.12)] focus-visible:border-[#B45309] focus-visible:ring-0 placeholder:text-muted-foreground"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/ssp/dashboard/payouts"
              title="Available to withdraw · USDC"
              className="flex items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.12)] bg-white px-2.5 py-1 text-[#0A0A0A] transition-colors hover:border-[#B45309] hover:text-[#B45309]"
            >
              <UsdcIcon className="size-3.5" />
              <span className="text-[11px] font-medium tabular-nums">
                {formatUsdc(availableUsdcCents)}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground">USDC</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full relative hover:bg-[#0A0A0A]/[0.04]"
            >
              <BellIcon className="size-3.5 text-[#0A0A0A]" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#B45309] ring-2 ring-[#ECEAE2]" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
