"use client"

import { useEffect, useState } from "react"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { listAdGroups, type AdGroupWithRel } from "@/services/ad-groups"
import { logger } from "@/lib/logger"

interface Props {
  value: string | null
  onChange: (id: string) => void
  prefilledCampaignId?: string
}

interface State {
  groups: AdGroupWithRel[]
  loading: boolean
  error: string | null
}

/// Compact dropdown that loads the current advertiser's ad groups and
/// surfaces them with `<campaign name> · <ad-group name>` so the user can
/// disambiguate. Optionally pre-scopes to a single campaign — when the user
/// navigates from a campaign detail page, that page can pass campaignId.
export function AdGroupPicker(props: Props): React.JSX.Element {
  const { value, onChange, prefilledCampaignId } = props
  const [state, setState] = useState<State>({ groups: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    listAdGroups()
      .then((r) => {
        if (cancelled) return
        const filtered = prefilledCampaignId
          ? r.adGroups.filter((g) => g.campaign.id === prefilledCampaignId)
          : r.adGroups
        setState({ groups: filtered, loading: false, error: null })
        if (!value && filtered.length === 1 && filtered[0]) {
          onChange(filtered[0].id)
        }
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load ad groups"
        logger.error({ err }, "ad group load failed")
        if (!cancelled) setState({ groups: [], loading: false, error: msg })
      })
    return () => { cancelled = true }
    // value/onChange intentionally not in deps — we only auto-select once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledCampaignId])

  if (state.loading) {
    return <p className="text-[10px] text-muted-foreground">Loading ad groups…</p>
  }
  if (state.error) {
    return <p className="text-[10px] text-red-600">{state.error}</p>
  }
  if (state.groups.length === 0) {
    return (
      <p className="text-[11px] text-muted-foreground">
        No ad groups yet. Create one inside a campaign first.
      </p>
    )
  }

  return (
    <div className="space-y-1">
      <Label className="text-[10px] uppercase tracking-widest">Ad group</Label>
      <Select value={value ?? ""} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Pick an ad group" />
        </SelectTrigger>
        <SelectContent>
          {state.groups.map((g) => (
            <SelectItem key={g.id} value={g.id} className="text-xs">
              {g.campaign.name} · {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
