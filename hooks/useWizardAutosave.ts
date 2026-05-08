"use client"

import { useEffect, useRef, useState } from "react"

const STORAGE_KEY = "vara:campaign-wizard-draft:v1"
const SAVE_DEBOUNCE_MS = 600

export interface AutosaveState<T> {
  savedAt: number | null
  saving: boolean
  load: () => T | null
  clear: () => void
}

function readDraft<T>(): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { state: T; savedAt: number }
    return parsed.state ?? null
  } catch {
    return null
  }
}

function writeDraft<T>(state: T): number {
  const savedAt = Date.now()
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, savedAt }))
  }
  return savedAt
}

export function useWizardAutosave<T>(state: T, dirty: boolean): AutosaveState<T> {
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!dirty) return
    setSaving(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const at = writeDraft(state)
      setSavedAt(at)
      setSaving(false)
    }, SAVE_DEBOUNCE_MS)
    return (): void => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [state, dirty])

  return {
    savedAt,
    saving,
    load: (): T | null => readDraft<T>(),
    clear: (): void => {
      if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY)
      setSavedAt(null)
    },
  }
}

export function formatSavedAgo(savedAt: number | null): string {
  if (!savedAt) return ""
  const diff = Math.max(0, Date.now() - savedAt)
  if (diff < 4000) return "just now"
  if (diff < 60_000) return `${Math.round(diff / 1000)}s ago`
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m ago`
  return new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
