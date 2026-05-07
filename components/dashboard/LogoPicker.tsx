"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Logos available in /public/logo. Order = order shown in the picker grid.
// Slugs are URL-encoded paths so files with spaces resolve correctly.
const LOGOS = [
  { id: "artboard-1", label: "Artboard 1", src: "/logo/Artboard%201.png" },
  { id: "artboard-2", label: "Artboard 2", src: "/logo/Artboard%202.png" },
  { id: "artboard-3", label: "Artboard 3", src: "/logo/Artboard%203.png" },
  { id: "artboard-4", label: "Artboard 4", src: "/logo/Artboard%204.png" },
  { id: "designer-01", label: "Designer 01", src: "/logo/Designer_01.png" },
  { id: "designer-02", label: "Designer 02", src: "/logo/Designer_02.png" },
  { id: "designer-03", label: "Designer 03", src: "/logo/Designer_03.png" },
] as const

const STORAGE_KEY = "vara:logo"
const DEFAULT_ID = LOGOS[0].id

export function LogoPicker(): React.JSX.Element {
  const [activeId, setActiveId] = useState<string>(DEFAULT_ID)
  const [open, setOpen] = useState(false)

  // Hydrate from localStorage after mount so SSR markup matches the default.
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
    if (stored && LOGOS.some(l => l.id === stored)) setActiveId(stored)
  }, [])

  const select = (id: string): void => {
    setActiveId(id)
    window.localStorage.setItem(STORAGE_KEY, id)
    setOpen(false)
  }

  const active = LOGOS.find(l => l.id === activeId) ?? LOGOS[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={`Logo: ${active.label} (click to switch)`}
          className="group flex h-10 w-10 items-center justify-center rounded-lg transition-all hover:bg-[rgba(55,50,47,0.06)] hover:ring-2 hover:ring-[rgba(55,50,47,0.16)]"
        >
          <Image
            src={active.src}
            alt={active.label}
            width={80}
            height={80}
            className="h-9 w-9 object-contain"
            priority
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={10}
        className="w-[340px] p-3 border-[rgba(55,50,47,0.12)] bg-white shadow-[0_8px_32px_-8px_rgba(55,50,47,0.2)]"
      >
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Pick a logo
          </span>
          <span className="text-[10px] tabular-nums text-muted-foreground/70">
            {LOGOS.findIndex(l => l.id === activeId) + 1} / {LOGOS.length}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {LOGOS.map(l => {
            const isActive = l.id === activeId
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => select(l.id)}
                title={l.label}
                className={`group relative flex flex-col items-center justify-center gap-1 rounded-lg border p-2 transition-all ${
                  isActive
                    ? "border-[#37322F] bg-[#FAFAF8] ring-2 ring-[#37322F]/20"
                    : "border-[rgba(55,50,47,0.12)] bg-white hover:border-[rgba(55,50,47,0.32)] hover:bg-[#FAFAF8]"
                }`}
              >
                <div className="flex h-20 w-full items-center justify-center">
                  <Image
                    src={l.src}
                    alt={l.label}
                    width={160}
                    height={160}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span
                  className={`text-[10px] font-medium ${
                    isActive ? "text-[#37322F]" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </span>
              </button>
            )
          })}
        </div>
        <Link
          href="/dashboard"
          className="block mt-2.5 px-1 text-[10px] text-muted-foreground hover:text-[#37322F]"
          onClick={() => setOpen(false)}
        >
          Go to dashboard →
        </Link>
      </PopoverContent>
    </Popover>
  )
}
