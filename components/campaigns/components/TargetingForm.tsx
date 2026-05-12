"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { Targeting, WalletSegment } from "@prisma/client"
import { Chain, DeviceType } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { isValidContractAddress } from "@/lib/chains"
import { saveTargeting } from "@/services/campaigns"
import { Loader2 } from "lucide-react"
import { CircleCheckIcon } from "@/icons"
import { CampaignTabHeader } from "./CampaignTabHeader"
import { TargetingSummary } from "./TargetingSummary"
import {
  TargetingWhere,
  TargetingWho,
  TargetingWhat,
} from "./TargetingSections"

interface Props {
  campaignId: string
  initial: Targeting | null
  segments: WalletSegment[]
}

interface FormState {
  chains: Chain[]
  devices: DeviceType[]
  segmentIds: string[]
  minAge: string
  minPortfolio: string
  holds: string
  excludes: string
  geos: string
}

function parseList(s: string): string[] {
  return s.split(/[\s,]+/).map((x) => x.trim()).filter(Boolean)
}

function buildInitialState(initial: Targeting | null): FormState {
  return {
    chains: initial?.chains ?? [],
    devices: initial?.deviceTypes ?? [],
    segmentIds: initial?.segmentIds ?? [],
    minAge: String(initial?.minWalletAgeDays ?? ""),
    minPortfolio: initial?.minPortfolioUsdCents
      ? String(initial.minPortfolioUsdCents / 100)
      : "",
    holds: (initial?.holdsAnyContract ?? []).join(", "),
    excludes: (initial?.excludesContracts ?? []).join(", "),
    geos: (initial?.geos ?? []).join(", "),
  }
}

function arraysEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((v) => b.includes(v))
}

function isDirty(state: FormState, initial: FormState): boolean {
  return (
    !arraysEqual(state.chains, initial.chains) ||
    !arraysEqual(state.devices, initial.devices) ||
    !arraysEqual(state.segmentIds, initial.segmentIds) ||
    state.minAge !== initial.minAge ||
    state.minPortfolio !== initial.minPortfolio ||
    state.holds !== initial.holds ||
    state.excludes !== initial.excludes ||
    state.geos !== initial.geos
  )
}

export function TargetingForm({
  campaignId,
  initial,
  segments,
}: Props): React.JSX.Element {
  const router = useRouter()
  const initialState = useMemo(() => buildInitialState(initial), [initial])
  const [state, setState] = useState<FormState>(initialState)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const patch = (p: Partial<FormState>): void => setState((s) => ({ ...s, ...p }))
  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const geosCount = useMemo(
    () => parseList(state.geos).map((g) => g.toUpperCase()).filter((g) => g.length === 2).length,
    [state.geos],
  )

  const dirty = isDirty(state, initialState)

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError("")
    const holdsList = parseList(state.holds)
    const excludesList = parseList(state.excludes)
    const bad = [...holdsList, ...excludesList].find((a) => !isValidContractAddress(a))
    if (bad) {
      setError(`Invalid contract address: ${bad}`)
      return
    }
    setSaving(true)
    try {
      await saveTargeting(campaignId, {
        chains: state.chains,
        deviceTypes: state.devices,
        segmentIds: state.segmentIds,
        geos: parseList(state.geos).map((g) => g.toUpperCase()).filter((g) => g.length === 2),
        minWalletAgeDays: state.minAge ? Number(state.minAge) : undefined,
        minPortfolioUsd: state.minPortfolio ? Number(state.minPortfolio) : undefined,
        holdsAnyContract: holdsList,
        excludesContracts: excludesList,
      })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <CampaignTabHeader
        title="Targeting"
        description="Define who sees this campaign. Combine on-chain signals (chains, wallet holdings, portfolio) with traditional ones (geo, device, contextual segments). Leave a section empty to leave it open."
        right={
          <>
            {dirty && !saving && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7E0] px-2 py-0.5 text-[10px] font-medium text-[#A16207]">
                Unsaved changes
              </span>
            )}
            {!dirty && !saving && initial && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F0F7EE] px-2 py-0.5 text-[10px] font-medium text-[#15803D]">
                <CircleCheckIcon className="size-2.5" />
                Saved
              </span>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={saving || !dirty}
              className="h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(55,50,47,0.18)] disabled:opacity-40"
            >
              {saving && <Loader2 className="size-3 animate-spin" />}
              Save targeting
            </Button>
          </>
        }
      />

      <TargetingSummary
        chains={state.chains.length}
        devices={state.devices.length}
        segments={state.segmentIds.length}
        geos={geosCount}
        minPortfolioUsd={state.minPortfolio}
      />

      <Card className="border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)] py-0">
        <CardContent className="p-4 space-y-5">
          <TargetingWhere
            chains={state.chains}
            devices={state.devices}
            geos={state.geos}
            onToggleChain={(c) => patch({ chains: toggle(state.chains, c) })}
            onToggleDevice={(d) => patch({ devices: toggle(state.devices, d) })}
            onChangeGeos={(v) => patch({ geos: v })}
          />
          <TargetingWho
            segments={segments}
            selectedSegmentIds={state.segmentIds}
            minAge={state.minAge}
            minPortfolio={state.minPortfolio}
            onToggleSegment={(id) => patch({ segmentIds: toggle(state.segmentIds, id) })}
            onChangeMinAge={(v) => patch({ minAge: v })}
            onChangeMinPortfolio={(v) => patch({ minPortfolio: v })}
          />
          <TargetingWhat
            holds={state.holds}
            excludes={state.excludes}
            onChangeHolds={(v) => patch({ holds: v })}
            onChangeExcludes={(v) => patch({ excludes: v })}
          />

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  )
}
