"use client"

import Link from "next/link"
import { ChevronRight, LogOut } from "lucide-react"
import type { User } from "@prisma/client"
import { NAV_SECTIONS } from "./DashboardNav"

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface Props {
  user: Pick<User, "name" | "email">
  activeSection: string
  panelOpen: boolean
  onSectionClick: (id: string) => void
  onSignOut: () => void
}

export function IconRail({ user, activeSection, panelOpen, onSectionClick, onSignOut }: Props): React.JSX.Element {
  return (
    <div className="flex h-full w-12 shrink-0 flex-col border-r border-[rgba(55,50,47,0.12)] bg-[#F7F5F3]">
      {/* Logo */}
      <div className="flex h-11 shrink-0 items-center justify-center border-b border-[rgba(55,50,47,0.12)]">
        <Link href="/dashboard" title="Varaads">
          <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#37322F] text-[#FAFAF8] text-[11px] font-bold shadow-[0_0_0_2px_rgba(255,255,255,0.08)_inset]">
            V
          </div>
        </Link>
      </div>

      {/* Section icons */}
      <nav className="flex flex-1 flex-col items-center gap-0.5 overflow-y-auto py-2">
        {NAV_SECTIONS.map((section) => {
          const active = activeSection === section.id
          return (
            <button
              key={section.id}
              type="button"
              title={section.label}
              onClick={() => onSectionClick(section.id)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                active
                  ? "bg-[rgba(55,50,47,0.12)] text-[#37322F]"
                  : "text-[#37322F]/60 hover:bg-[rgba(55,50,47,0.06)] hover:text-[#37322F]/80"
              }`}
            >
              <section.icon className="size-4" />
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#37322F]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer: panel toggle + user + sign out */}
      <div className="flex shrink-0 flex-col items-center gap-0.5 border-t border-[rgba(55,50,47,0.12)] py-2">
        {!panelOpen && (
          <button
            type="button"
            title="Open panel"
            onClick={() => onSectionClick(activeSection)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#37322F]/40 hover:bg-[rgba(55,50,47,0.08)] hover:text-[#37322F] transition-colors"
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#37322F] text-[#FAFAF8] text-[10px] font-semibold cursor-default"
          title={`${user.name ?? ""} · ${user.email ?? ""}`}
        >
          {initials(user.name ?? "U")}
        </div>
        <button
          type="button"
          title="Sign out"
          onClick={onSignOut}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#37322F]/40 hover:bg-[rgba(55,50,47,0.08)] hover:text-[#37322F] transition-colors"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
