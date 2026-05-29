"use client"

import { useEffect, useState } from "react"
import type { Asset, AssetType } from "@prisma/client"

import { ImageSparkleIcon, CircleCheckIcon } from "@/icons"
import { Label } from "@/components/ui/label"
import { listAssets } from "@/services/assets"
import { logger } from "@/lib/logger"

interface Props {
  type: AssetType
  selectedId?: string | null
  onSelect: (asset: Asset) => void
  emptyHint?: string
}

interface State {
  assets: Asset[]
  loading: boolean
  error: string | null
}

export function AssetLibraryGrid(props: Props): React.JSX.Element {
  const { type, selectedId, onSelect, emptyHint } = props
  const [state, setState] = useState<State>({ assets: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    listAssets({ type, status: "APPROVED", limit: 60 })
      .then((r) => {
        if (cancelled) return
        setState({ assets: r.assets, loading: false, error: null })
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load assets"
        logger.error({ err, type }, "asset library load failed")
        if (!cancelled) setState({ assets: [], loading: false, error: msg })
      })
    return () => { cancelled = true }
  }, [type])

  if (state.loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-md border border-dashed border-[rgba(10,10,10,0.12)] bg-[rgba(10,10,10,0.03)]" />
        ))}
      </div>
    )
  }

  if (state.error) {
    return <p className="text-xs text-red-600">{state.error}</p>
  }

  if (state.assets.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[rgba(10,10,10,0.16)] bg-white/40 px-3 py-6 text-center">
        <ImageSparkleIcon className="mx-auto mb-1 size-4 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground">
          {emptyHint ?? "No assets yet — upload your first one."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {state.assets.map((a) => (
        <AssetThumb key={a.id} asset={a} selected={a.id === selectedId} onClick={() => onSelect(a)} />
      ))}
    </div>
  )
}

interface ThumbProps {
  asset: Asset
  selected: boolean
  onClick: () => void
}

function AssetThumb({ asset, selected, onClick }: ThumbProps): React.JSX.Element {
  const isImage = asset.type === "IMAGE" || asset.type === "LOGO"
  const isVideo = asset.type === "VIDEO"
  const ring = selected ? "ring-2 ring-[#0A0A0A]" : "ring-1 ring-transparent hover:ring-[rgba(10,10,10,0.2)]"
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative aspect-square overflow-hidden rounded-md border border-[rgba(10,10,10,0.08)] bg-white transition ${ring}`}
    >
      {isImage && asset.fileUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.fileUrl}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      ) : isVideo && asset.fileUrl ? (
        <video src={asset.fileUrl} muted className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center text-[9px] text-muted-foreground">
          <Label className="text-[9px] uppercase tracking-widest">{asset.type}</Label>
          <span className="line-clamp-3">{asset.textValue ?? ""}</span>
        </div>
      )}
      {selected && (
        <div className="absolute right-1 top-1 rounded-full bg-[#0A0A0A] p-0.5 text-white shadow">
          <CircleCheckIcon className="size-3" />
        </div>
      )}
    </button>
  )
}
