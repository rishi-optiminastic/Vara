"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Ad, AdType } from "@prisma/client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdGroupPicker } from "@/components/ads/AdGroupPicker"
import { ResponsiveDisplayBuilder } from "@/components/ads/ResponsiveDisplayBuilder"

interface Props {
  campaignId?: string
}

/// v1 ships RESPONSIVE_DISPLAY end-to-end; the other types in the dropdown
/// are surfaced as `disabled` to telegraph the multi-format roadmap without
/// pretending to support them yet.
type SupportedAdType = Extract<
  AdType,
  | "RESPONSIVE_DISPLAY"
  | "VIDEO_IN_STREAM"
  | "NATIVE"
  | "APP_INSTALL"
  | "CATALOG_NFT"
>

interface AdTypeMeta {
  label: string
  description: string
  available: boolean
}

const AD_TYPE_META: Record<SupportedAdType, AdTypeMeta> = {
  RESPONSIVE_DISPLAY: {
    label: "Responsive Display",
    description: "Images + headlines mixed at serve time to fit any slot.",
    available: true,
  },
  VIDEO_IN_STREAM: {
    label: "Video — In-Stream",
    description: "Skippable pre/mid/post-roll video.",
    available: false,
  },
  NATIVE: {
    label: "Native",
    description: "Publisher-styled headline + image + description.",
    available: false,
  },
  APP_INSTALL: {
    label: "App Install",
    description: "Drive dApp / wallet-app installs.",
    available: false,
  },
  CATALOG_NFT: {
    label: "NFT Catalog",
    description: "Dynamic NFT or token listings from a feed.",
    available: false,
  },
}

export function NewAdFlow({ campaignId }: Props): React.JSX.Element {
  const router = useRouter()
  const [adGroupId, setAdGroupId] = useState<string | null>(null)
  const [adType, setAdType] = useState<SupportedAdType>("RESPONSIVE_DISPLAY")

  const handleCreated = (ad: Ad): void => {
    router.push(`/dashboard/ads?campaign=${campaignId ?? ""}&created=${ad.id}`)
    router.refresh()
  }

  const meta = AD_TYPE_META[adType]

  return (
    <div className="space-y-3">
      <SetupCard
        adType={adType}
        onAdType={setAdType}
        adGroupId={adGroupId}
        onAdGroupId={setAdGroupId}
        {...(campaignId !== undefined && { campaignId })}
        meta={meta}
      />

      {adGroupId && adType === "RESPONSIVE_DISPLAY" && (
        <ResponsiveDisplayBuilder adGroupId={adGroupId} onCreated={handleCreated} />
      )}

      {!adGroupId && <EmptyHint />}
    </div>
  )
}

interface SetupCardProps {
  adType: SupportedAdType
  onAdType: (v: SupportedAdType) => void
  adGroupId: string | null
  onAdGroupId: (v: string) => void
  campaignId?: string
  meta: AdTypeMeta
}

function SetupCard(props: SetupCardProps): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(10,10,10,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(10,10,10,0.08)]">
      <CardContent className="p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-widest">Ad type</Label>
            <Select
              value={props.adType}
              onValueChange={(v) => props.onAdType(v as SupportedAdType)}
            >
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.entries(AD_TYPE_META) as [SupportedAdType, AdTypeMeta][]).map(
                  ([val, m]) => (
                    <SelectItem
                      key={val}
                      value={val}
                      disabled={!m.available}
                      className="text-xs"
                    >
                      {m.label}{!m.available ? " — coming soon" : ""}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">{props.meta.description}</p>
          </div>
          <AdGroupPicker
            value={props.adGroupId}
            onChange={props.onAdGroupId}
            {...(props.campaignId !== undefined && { prefilledCampaignId: props.campaignId })}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyHint(): React.JSX.Element {
  return (
    <Card className="border border-dashed border-[rgba(10,10,10,0.16)] bg-white/40">
      <CardContent className="px-3 py-8 text-center text-[11px] text-muted-foreground">
        Pick an ad group above to start building your ad.
      </CardContent>
    </Card>
  )
}
