"use client"

import { useState } from "react"
import type { Ad } from "@prisma/client"

import { ImageSparkleIcon, IdBadgeIcon, FilePenIcon, CircleCheckIcon } from "@/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WizardSection } from "@/components/campaigns/components/WizardSection"
import { ResponsiveAdAssetSlot } from "@/components/ads/ResponsiveAdAssetSlot"
import { ResponsiveAdTextRows } from "@/components/ads/ResponsiveAdTextRows"
import { ResponsiveAdPreview } from "@/components/ads/ResponsiveAdPreview"
import { useResponsiveAdDraft } from "@/hooks/useResponsiveAdDraft"
import { saveResponsiveAd } from "@/lib/responsiveAdSave"
import { logger } from "@/lib/logger"

interface Props {
  adGroupId: string
  onCreated?: (ad: Ad) => void
}

interface SaveState {
  busy: boolean
  error: string | null
}

/// Top-level builder for a Responsive Display ad. Three logical sections
/// — Destination, Visuals, Copy — stacked on the left, sticky preview on
/// the right. Submits by creating one Asset per non-empty text input and
/// then POSTing /api/ads with the assembled link set.
export function ResponsiveDisplayBuilder({ adGroupId, onCreated }: Props): React.JSX.Element {
  const d = useResponsiveAdDraft()
  const [save, setSave] = useState<SaveState>({ busy: false, error: null })

  const submit = async (): Promise<void> => {
    if (!d.validation.ok) {
      setSave({ busy: false, error: d.validation.message })
      return
    }
    setSave({ busy: true, error: null })
    try {
      const ad = await saveResponsiveAd({ draft: d.draft, adGroupId })
      d.reset()
      setSave({ busy: false, error: null })
      onCreated?.(ad)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed"
      logger.error({ err }, "responsive ad save failed")
      setSave({ busy: false, error: msg })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
      <BuilderForm draft={d} />
      <PreviewColumn
        draft={d.draft}
        message={save.error ?? d.validation.message}
        error={Boolean(save.error) || !d.validation.ok}
        busy={save.busy}
        canSubmit={d.validation.ok && !save.busy}
        onSubmit={submit}
      />
    </div>
  )
}

interface FormProps {
  draft: ReturnType<typeof useResponsiveAdDraft>
}

function BuilderForm({ draft }: FormProps): React.JSX.Element {
  return (
    <Card className="py-0 gap-0 border-[rgba(10,10,10,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(10,10,10,0.08)]">
      <CardContent className="p-5 space-y-5">
        <WizardSection
          icon={IdBadgeIcon}
          title="Destination"
          description="The basics — name, where the click goes, and the call to action."
        >
          <DestinationFields
            name={draft.draft.name}
            clickUrl={draft.draft.clickUrl}
            cta={draft.draft.cta}
            onName={draft.setName}
            onClickUrl={draft.setClickUrl}
            onCta={draft.setCta}
          />
        </WizardSection>

        <WizardSection
          icon={ImageSparkleIcon}
          title="Visuals"
          description="Add one landscape, one square, and a logo. We'll pick the right one per slot."
        >
          <VisualsGrid draft={draft} />
        </WizardSection>

        <WizardSection
          icon={FilePenIcon}
          title="Copy"
          description="Multiple headlines and descriptions get mixed at serve time."
        >
          <div className="space-y-4">
            <ResponsiveAdTextRows
              label="Headlines"
              hint="Up to 5 · 30 chars each"
              values={draft.draft.headlines}
              onChange={draft.setHeadline}
              limitKey="HEADLINE"
            />
            <ResponsiveAdTextRows
              label="Descriptions"
              hint="Up to 3 · 90 chars each"
              values={draft.draft.descriptions}
              onChange={draft.setDescription}
              limitKey="DESCRIPTION"
            />
          </div>
        </WizardSection>
      </CardContent>
    </Card>
  )
}

interface DestinationProps {
  name: string
  clickUrl: string
  cta: string
  onName: (v: string) => void
  onClickUrl: (v: string) => void
  onCta: (v: string) => void
}

function DestinationFields(props: DestinationProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-widest">Ad name</Label>
        <Input
          value={props.name}
          onChange={(e) => props.onName(e.target.value)}
          placeholder="Q2 holiday push"
          className="h-8 text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[10px] uppercase tracking-widest">Call to action</Label>
        <Input
          value={props.cta}
          maxLength={25}
          onChange={(e) => props.onCta(e.target.value)}
          placeholder="Mint now"
          className="h-8 text-xs"
        />
      </div>
      <div className="col-span-2 space-y-1">
        <Label className="text-[10px] uppercase tracking-widest">Click URL</Label>
        <Input
          type="url"
          value={props.clickUrl}
          onChange={(e) => props.onClickUrl(e.target.value)}
          placeholder="https://your-project.io/mint"
          className="h-8 text-xs"
        />
      </div>
    </div>
  )
}

function VisualsGrid({ draft }: FormProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ResponsiveAdAssetSlot
        label="Primary"
        hint="1.91:1"
        assetType="IMAGE"
        value={draft.draft.primaryImage}
        onChange={draft.setPrimaryImage}
        aspectRatio="1.91/1"
      />
      <ResponsiveAdAssetSlot
        label="Square"
        hint="1:1"
        assetType="IMAGE"
        value={draft.draft.squareImage}
        onChange={draft.setSquareImage}
        aspectRatio="1/1"
      />
      <ResponsiveAdAssetSlot
        label="Logo"
        hint="1:1"
        assetType="LOGO"
        value={draft.draft.logo}
        onChange={draft.setLogo}
        aspectRatio="1/1"
      />
    </div>
  )
}

interface PreviewColumnProps {
  draft: ReturnType<typeof useResponsiveAdDraft>["draft"]
  message: string
  error: boolean
  busy: boolean
  canSubmit: boolean
  onSubmit: () => void
}

function PreviewColumn(props: PreviewColumnProps): React.JSX.Element {
  return (
    <aside className="lg:sticky lg:top-3 lg:self-start space-y-3">
      <Card className="py-0 gap-0 border-[rgba(10,10,10,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(10,10,10,0.08)]">
        <CardContent className="p-4">
          <ResponsiveAdPreview draft={props.draft} />
        </CardContent>
      </Card>
      <SaveBar
        message={props.message}
        error={props.error}
        busy={props.busy}
        canSubmit={props.canSubmit}
        onSubmit={props.onSubmit}
      />
    </aside>
  )
}

interface SaveBarProps {
  message: string
  error: boolean
  busy: boolean
  canSubmit: boolean
  onSubmit: () => void
}

function SaveBar(props: SaveBarProps): React.JSX.Element {
  const tone = props.error
    ? "text-red-600"
    : props.canSubmit
      ? "text-[#1F40CD]"
      : "text-muted-foreground"
  return (
    <Card className="py-0 gap-0 border-[rgba(10,10,10,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(10,10,10,0.08)]">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-1.5">
          {!props.error && props.canSubmit && (
            <CircleCheckIcon className="mt-0.5 size-3 shrink-0 text-[#1F40CD]" />
          )}
          <p className={`text-[10.5px] leading-snug ${tone}`}>{props.message}</p>
        </div>
        <Button
          type="button"
          disabled={!props.canSubmit}
          onClick={props.onSubmit}
          className="h-9 w-full gap-1.5 rounded-full bg-[#1F40CD] text-[12px] font-medium text-white hover:bg-[#1A36B0] disabled:opacity-50"
        >
          {props.busy ? "Saving…" : "Save responsive ad"}
        </Button>
      </CardContent>
    </Card>
  )
}
