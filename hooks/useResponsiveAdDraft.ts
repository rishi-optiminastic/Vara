"use client"

import { useMemo, useState } from "react"
import type { Asset } from "@prisma/client"

const HEADLINE_SLOTS = 5
const DESCRIPTION_SLOTS = 3

export interface ResponsiveAdDraft {
  name: string
  clickUrl: string
  primaryImage: Asset | null
  squareImage: Asset | null
  logo: Asset | null
  headlines: string[]
  descriptions: string[]
  cta: string
}

export interface ResponsiveAdValidation {
  ok: boolean
  message: string
}

export interface ResponsiveAdDraftHook {
  draft: ResponsiveAdDraft
  validation: ResponsiveAdValidation
  setName: (v: string) => void
  setClickUrl: (v: string) => void
  setPrimaryImage: (a: Asset | null) => void
  setSquareImage: (a: Asset | null) => void
  setLogo: (a: Asset | null) => void
  setHeadline: (index: number, value: string) => void
  setDescription: (index: number, value: string) => void
  setCta: (v: string) => void
  reset: () => void
}

const INITIAL: ResponsiveAdDraft = {
  name: "",
  clickUrl: "",
  primaryImage: null,
  squareImage: null,
  logo: null,
  headlines: Array.from({ length: HEADLINE_SLOTS }, () => ""),
  descriptions: Array.from({ length: DESCRIPTION_SLOTS }, () => ""),
  cta: "",
}

function validate(d: ResponsiveAdDraft): ResponsiveAdValidation {
  if (!d.name.trim()) return { ok: false, message: "Name is required" }
  if (!d.clickUrl.trim() || !d.clickUrl.startsWith("http")) {
    return { ok: false, message: "Click URL is required" }
  }
  if (!d.primaryImage) return { ok: false, message: "Add a landscape primary image (1.91:1)" }
  if (!d.squareImage) return { ok: false, message: "Add a square image (1:1)" }
  if (!d.logo) return { ok: false, message: "Add a logo" }
  const headlines = d.headlines.filter((h) => h.trim().length > 0)
  if (headlines.length < 2) return { ok: false, message: "Add at least 2 headlines" }
  const descriptions = d.descriptions.filter((x) => x.trim().length > 0)
  if (descriptions.length < 1) return { ok: false, message: "Add at least 1 description" }
  return { ok: true, message: "Ready to save" }
}

/// Local-state hook for the ResponsiveDisplayBuilder. Keeps the draft in
/// memory until the user clicks Save — at which point the parent component
/// orchestrates: create text assets, then POST /api/ads with the link set.
export function useResponsiveAdDraft(): ResponsiveAdDraftHook {
  const [draft, setDraft] = useState<ResponsiveAdDraft>(INITIAL)
  const validation = useMemo(() => validate(draft), [draft])

  const setHeadline = (index: number, value: string): void => {
    setDraft((d) => {
      const next = [...d.headlines]
      next[index] = value
      return { ...d, headlines: next }
    })
  }
  const setDescription = (index: number, value: string): void => {
    setDraft((d) => {
      const next = [...d.descriptions]
      next[index] = value
      return { ...d, descriptions: next }
    })
  }

  return {
    draft,
    validation,
    setName: (v) => setDraft((d) => ({ ...d, name: v })),
    setClickUrl: (v) => setDraft((d) => ({ ...d, clickUrl: v })),
    setPrimaryImage: (a) => setDraft((d) => ({ ...d, primaryImage: a })),
    setSquareImage: (a) => setDraft((d) => ({ ...d, squareImage: a })),
    setLogo: (a) => setDraft((d) => ({ ...d, logo: a })),
    setHeadline,
    setDescription,
    setCta: (v) => setDraft((d) => ({ ...d, cta: v })),
    reset: () => setDraft(INITIAL),
  }
}
