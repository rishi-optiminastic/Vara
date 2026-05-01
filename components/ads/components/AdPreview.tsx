"use client"

import { ImageSparkleIcon } from "@/icons"
import { FORMAT_DIMS } from "@/lib/creatives"
import type { CreativeFormat } from "@prisma/client"

interface Props {
  format: CreativeFormat
  assetUrl: string
  name: string
  walletConnectCta: boolean
  compact?: boolean
}

function isValidUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

export function AdPreview({ format, assetUrl, name, walletConnectCta, compact = false }: Props): React.JSX.Element {
  const { width, height } = FORMAT_DIMS[format]
  const ratio = width / height
  const valid = isValidUrl(assetUrl)
  const isVideo = format === "VIDEO"

  const sizeLabel = `${width}×${height}`

  return (
    <div
      className="relative w-full overflow-hidden rounded-md border border-[rgba(55,50,47,0.12)] bg-[#F0ECE6]"
      style={{ aspectRatio: ratio }}
    >
      {valid ? (
        isVideo ? (
          <video
            src={assetUrl}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl}
            alt={name}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
          />
        )
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-muted-foreground/60">
          <ImageSparkleIcon className={compact ? "size-3.5" : "size-5"} />
          {!compact && <span className="text-[10px]">Asset preview</span>}
        </div>
      )}
      {walletConnectCta && valid && (
        <div className="absolute bottom-1.5 right-1.5 rounded-full bg-[#37322F] px-2 py-0.5 text-[9px] font-semibold text-white shadow-sm">
          Connect Wallet
        </div>
      )}
      <div className="absolute top-1 left-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider text-[#37322F] shadow-sm">
        {sizeLabel}
      </div>
    </div>
  )
}
