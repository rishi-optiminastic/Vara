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
    <div className="flex h-full w-12 shrink-0 flex-col border-r border-dashed border-[rgba(10,10,10,0.15)] bg-white">
      <div className="flex h-11 shrink-0 items-center justify-center border-b border-dashed border-[rgba(10,10,10,0.15)]">
        <LogoPicker />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-0.5 overflow-y-auto py-2  ">
        {NAV_SECTIONS.map((section) => {
          const active = activeSection === section.id
          return (
            <button
              key={section.id}
              type="button"
              title={section.label}
              onClick={() => onSectionClick(section.id)}
              className={`group relative flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
                active
                  ? "bg-[#1F40CD] text-white shadow-[0_1px_0_rgba(0,0,0,0.06)]"
                  : "text-[#0A0A0A]/80 hover:bg-[#0A0A0A]/6 hover:text-[#0A0A0A]"
              }`}
            >
              {active && (
                <span className="absolute -left-1.75 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#1F40CD]" />
              )}
              <section.icon
                className={`size-4 transition-opacity ${
                  active ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                }`}
              />
            </button>
          )
        })}
      </nav>

      <div className="flex shrink-0 flex-col items-center gap-1 border-t border-dashed border-[rgba(10,10,10,0.15)] py-3">
        {!panelOpen && (
          <button
            type="button"
            title="Open panel"
            onClick={() => onSectionClick(activeSection)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-[#0A0A0A]/[0.06] hover:text-[#0A0A0A] transition-colors"
          >
            <ChevronRight className="size-3.5" />
          </button>
        )}
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F40CD] text-white text-[10px] font-semibold cursor-default"
          title={`${user.name ?? ""} · ${user.email ?? ""}`}
        >
          {initials(user.name ?? "U")}
        </div>
        <button
          type="button"
          title="Sign out"
          onClick={onSignOut}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-[#0A0A0A]/[0.06] hover:text-[#0A0A0A] transition-colors"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </div>
  )
}
