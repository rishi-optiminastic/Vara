"use client"

import { ChevronRight, LogOut } from "lucide-react"
import type { User } from "@prisma/client"
import { NAV_SECTIONS } from "./DashboardNav"
import { LogoPicker } from "./LogoPicker"

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
    <div className="flex h-full w-12 shrink-0 flex-col border-r border-[rgba(55,50,47,0.15)] bg-[#ECEAE2]">
      <div className="flex h-11 shrink-0 items-center justify-center border-b border-[rgba(55,50,47,0.15)]">
        <LogoPicker />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 overflow-y-auto py-3">
        {NAV_SECTIONS.map((section) => {
          const active = activeSection === section.id
          return (
            <button
              key={section.id}
              type="button"
              title={section.label}
              onClick={() => onSectionClick(section.id)}
              className={`relative flex h-9 w-9 items-center justify-center transition-colors ${
                active
                  ? "bg-[#1f40cd] text-white"
                  : "text-[#1f40cd]/65 hover:bg-[#1f40cd]/8 hover:text-[#1f40cd]"
              }`}
            >
              <section.icon className="size-4" />
            </button>
          )
        })}
      </nav>

      <div className="flex shrink-0 flex-col items-center gap-1 border-t border-[rgba(55,50,47,0.15)] py-3">
        {!panelOpen && (
          <button
            type="button"
            title="Open panel"
            onClick={() => onSectionClick(activeSection)}
            className="flex h-7 w-7 items-center justify-center text-[#1f40cd]/55 hover:bg-[#1f40cd]/8 hover:text-[#1f40cd] transition-colors"
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}
        <div
          className="flex h-7 w-7 items-center justify-center bg-[#1f40cd] text-white text-[10px] font-semibold tracking-[0.06em] cursor-default"
          title={`${user.name ?? ""} · ${user.email ?? ""}`}
        >
          {initials(user.name ?? "U")}
        </div>
        <button
          type="button"
          title="Sign out"
          onClick={onSignOut}
          className="flex h-7 w-7 items-center justify-center text-[#1f40cd]/55 hover:bg-[#1f40cd]/8 hover:text-[#1f40cd] transition-colors"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
