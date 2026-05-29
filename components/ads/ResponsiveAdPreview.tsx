"use client"

import type { ResponsiveAdDraft } from "@/hooks/useResponsiveAdDraft"

import { ImageSparkleIcon, CircleOpenArrowRight } from "@/icons"
import { Label } from "@/components/ui/label"

interface Props {
  draft: ResponsiveAdDraft
}

/// Approximate render of how a Responsive Display ad will appear on a
/// publisher slot. The real auction-time render assembles per impression
/// based on the requested slot dimensions; this is one representative
/// composition (landscape variant).
export function ResponsiveAdPreview({ draft }: Props): React.JSX.Element {
  const headline = pickFirstNonEmpty(draft.headlines, "Your headline shows up here")
  const description = pickFirstNonEmpty(draft.descriptions, "Your description goes here.")
  const cta = draft.cta.trim() || "Learn more"
  const host = hostnameOf(draft.clickUrl)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] uppercase tracking-widest">Preview</Label>
        <span className="text-[9px] text-muted-foreground">Landscape variant</span>
      </div>

      <div className="overflow-hidden rounded-lg border border-[rgba(10,10,10,0.12)] bg-white shadow-[0_1px_0_rgba(255,255,255,0.6),0_8px_20px_-12px_rgba(10,10,10,0.16)]">
        <ImageBand image={draft.primaryImage?.fileUrl ?? undefined} />
        <div className="space-y-1.5 px-3 pt-2.5 pb-3">
          <PreviewMeta logoUrl={draft.logo?.fileUrl ?? undefined} host={host} />
          <p className="text-[12.5px] font-semibold leading-snug text-[#0A0A0A] line-clamp-2">{headline}</p>
          <p className="text-[10.5px] leading-snug text-muted-foreground line-clamp-2">{description}</p>
          <CtaPill label={cta} />
        </div>
      </div>

      <PreviewFooter
        squareUrl={draft.squareImage?.fileUrl ?? null}
        logoUrl={draft.logo?.fileUrl ?? null}
      />
    </div>
  )
}

interface ImageBandProps { image: string | undefined }

function ImageBand({ image }: ImageBandProps): React.JSX.Element {
  return (
    <div className="relative aspect-[1.91/1] w-full bg-[#ECEAE2]">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/60">
          <ImageSparkleIcon className="size-7" />
        </div>
      )}
    </div>
  )
}

interface MetaProps { logoUrl: string | undefined; host: string | null }

function PreviewMeta({ logoUrl, host }: MetaProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-1.5">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className="size-4 rounded-sm border border-[rgba(10,10,10,0.08)] object-contain" />
      ) : (
        <div className="size-4 rounded-sm bg-[rgba(10,10,10,0.08)]" />
      )}
      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Sponsored</span>
      {host && (
        <>
          <span className="text-[9px] text-muted-foreground/60">·</span>
          <span className="truncate text-[9px] text-muted-foreground">{host}</span>
        </>
      )}
    </div>
  )
}

interface CtaProps { label: string }

function CtaPill({ label }: CtaProps): React.JSX.Element {
  return (
    <div className="pt-1.5">
      <span className="inline-flex items-center gap-1 rounded-full bg-[#0A0A0A] px-2.5 py-1 text-[10px] font-semibold text-white">
        {label}
        <CircleOpenArrowRight className="size-2.5" />
      </span>
    </div>
  )
}

interface FooterProps { squareUrl: string | null; logoUrl: string | null }

/// Secondary preview row showing the square + logo assets — both of which
/// can be selected at auction time depending on the publisher slot shape.
function PreviewFooter({ squareUrl, logoUrl }: FooterProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <MiniTile label="Square" url={squareUrl} />
      <MiniTile label="Logo" url={logoUrl} />
    </div>
  )
}

interface TileProps { label: string; url: string | null }

function MiniTile({ label, url }: TileProps): React.JSX.Element {
  return (
    <div className="overflow-hidden rounded-md border border-[rgba(10,10,10,0.1)] bg-white">
      <div className="relative aspect-square w-full bg-[#ECEAE2]">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
            <ImageSparkleIcon className="size-3.5" />
          </div>
        )}
      </div>
      <div className="px-1.5 py-0.5 text-[8.5px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  )
}

function pickFirstNonEmpty(values: string[], fallback: string): string {
  for (const v of values) {
    if (v.trim().length > 0) return v
  }
  return fallback
}

function hostnameOf(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null
  try {
    return new URL(trimmed).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
}
