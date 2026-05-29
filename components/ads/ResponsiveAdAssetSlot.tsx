"use client"

import type { Asset } from "@prisma/client"

import { ImageSparkleIcon, CircleCheckIcon } from "@/icons"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AssetPickerDialog } from "@/components/assets/AssetPickerDialog"

interface Props {
  label: string
  hint: string
  assetType: "IMAGE" | "LOGO"
  value: Asset | null
  onChange: (a: Asset | null) => void
  aspectRatio: string
}

/// One asset slot inside the responsive display builder. Owns the labelled
/// frame, picker dialog, preview, and clear control. Empty-state and filled-
/// state share the same outer frame so the surrounding grid doesn't shift
/// as the user fills slots in.
export function ResponsiveAdAssetSlot(props: Props): React.JSX.Element {
  const { label, hint, assetType, value, onChange, aspectRatio } = props
  const hasAsset = Boolean(value?.fileUrl)

  return (
    <div className="space-y-1.5">
      <Header label={label} hint={hint} filled={hasAsset} />
      <div
        className="group relative overflow-hidden rounded-md border border-[rgba(10,10,10,0.12)] bg-[#ECEAE2]"
        style={{ aspectRatio }}
      >
        {hasAsset && value ? (
          <FilledPreview asset={value} />
        ) : (
          <EmptyState label={label} />
        )}
      </div>
      <SlotActions
        label={label}
        assetType={assetType}
        selectedId={value?.id ?? null}
        hasAsset={hasAsset}
        onChange={onChange}
      />
    </div>
  )
}

interface HeaderProps {
  label: string
  hint: string
  filled: boolean
}

function Header({ label, hint, filled }: HeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-1.5">
      <div className="flex items-center gap-1">
        <Label className="text-[10px] uppercase tracking-widest">{label}</Label>
        {filled && (
          <CircleCheckIcon className="size-2.5 text-[#1F40CD]" aria-label="filled" />
        )}
      </div>
      <span className="text-[9px] font-mono text-muted-foreground">{hint}</span>
    </div>
  )
}

interface FilledProps {
  asset: Asset
}

function FilledPreview({ asset }: FilledProps): React.JSX.Element {
  if (!asset.fileUrl) return <EmptyState label="" />
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.fileUrl} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/15 to-transparent opacity-0 transition group-hover:opacity-100" />
    </>
  )
}

interface EmptyProps {
  label: string
}

function EmptyState({ label }: EmptyProps): React.JSX.Element {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-muted-foreground/70">
      <ImageSparkleIcon className="size-5" />
      <span className="text-[10px] leading-tight">Add {label.toLowerCase()}</span>
    </div>
  )
}

interface ActionsProps {
  label: string
  assetType: "IMAGE" | "LOGO"
  selectedId: string | null
  hasAsset: boolean
  onChange: (a: Asset | null) => void
}

function SlotActions(props: ActionsProps): React.JSX.Element {
  return (
    <div className="flex gap-1.5">
      <AssetPickerDialog
        assetType={props.assetType}
        selectedId={props.selectedId}
        onPick={props.onChange}
        title={`Pick ${props.label.toLowerCase()}`}
        trigger={
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 flex-1 gap-1 text-[11px] rounded-full border-[rgba(10,10,10,0.2)]"
          >
            {props.hasAsset ? "Change" : "Upload"}
          </Button>
        }
      />
      {props.hasAsset && (
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => props.onChange(null)}
          className="h-7 text-[11px] text-muted-foreground"
        >
          Clear
        </Button>
      )}
    </div>
  )
}
