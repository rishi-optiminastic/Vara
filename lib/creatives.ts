import type { CreativeFormat } from "@prisma/client"

interface Dims {
  width: number
  height: number
}

export const FORMAT_DIMS: Record<CreativeFormat, Dims> = {
  BANNER: { width: 728, height: 90 },
  NATIVE: { width: 300, height: 250 },
  VIDEO: { width: 1280, height: 720 },
  HTML5: { width: 300, height: 250 },
}

export const FORMAT_LABELS: Record<CreativeFormat, string> = {
  BANNER: "Banner — 728×90",
  NATIVE: "Native — 300×250",
  VIDEO: "Video — 1280×720",
  HTML5: "HTML5 — 300×250",
}
