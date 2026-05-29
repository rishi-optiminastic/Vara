"use client"

import { useState } from "react"
import type { Asset } from "@prisma/client"

import { BoxPlusIcon } from "@/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateFileAssetSchema } from "@/components/ads/types"
import { createFileAsset } from "@/services/assets"
import { logger } from "@/lib/logger"

interface Props {
  assetType: "IMAGE" | "VIDEO" | "LOGO"
  onCreated: (asset: Asset) => void
}

interface FormState {
  fileUrl: string
  width: string
  height: string
  busy: boolean
  error: string | null
}

const INITIAL: FormState = { fileUrl: "", width: "", height: "", busy: false, error: null }

/// Inline form for adding an already-hosted file asset by URL. The BE has a
/// presign-upload endpoint stub for true direct-to-S3 uploads (planned), but
/// today we accept a URL the advertiser controls — same model the legacy
/// Creative flow uses, so existing workflows port cleanly.
export function AssetFileForm({ assetType, onCreated }: Props): React.JSX.Element {
  const [form, setForm] = useState<FormState>(INITIAL)

  const submit = async (): Promise<void> => {
    setForm((f) => ({ ...f, busy: true, error: null }))
    const parsed = CreateFileAssetSchema.safeParse({
      type: assetType,
      fileUrl: form.fileUrl.trim(),
      width: form.width ? Number(form.width) : undefined,
      height: form.height ? Number(form.height) : undefined,
    })
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Invalid input"
      setForm((f) => ({ ...f, busy: false, error: first }))
      return
    }
    try {
      const { asset } = await createFileAsset(parsed.data)
      setForm(INITIAL)
      onCreated(asset)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create asset"
      logger.error({ err, assetType }, "asset create failed")
      setForm((f) => ({ ...f, busy: false, error: msg }))
    }
  }

  return (
    <div className="rounded-md border border-[rgba(10,10,10,0.1)] bg-white p-3 space-y-2">
      <Label className="text-[10px] uppercase tracking-widest">Add new {assetType.toLowerCase()}</Label>
      <Input
        type="url"
        value={form.fileUrl}
        onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
        placeholder="https://cdn.your-project.io/asset.jpg"
        className="h-8 text-xs"
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          value={form.width}
          onChange={(e) => setForm({ ...form, width: e.target.value })}
          placeholder="Width (px)"
          className="h-8 text-xs"
        />
        <Input
          type="number"
          value={form.height}
          onChange={(e) => setForm({ ...form, height: e.target.value })}
          placeholder="Height (px)"
          className="h-8 text-xs"
        />
      </div>
      {form.error && <p className="text-[10px] text-red-600">{form.error}</p>}
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={form.busy || !form.fileUrl}
        onClick={submit}
        className="h-7 w-full gap-1 text-[11px] rounded-full"
      >
        <BoxPlusIcon className="size-3" />
        {form.busy ? "Adding…" : "Add to library"}
      </Button>
    </div>
  )
}
