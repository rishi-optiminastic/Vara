import { z } from "zod"
import { AdFormat, Chain, PlacementStatus } from "@prisma/client"

export const CreatePlacementSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80)
      .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, _ or - only"),
    format: z.nativeEnum(AdFormat),
    chains: z.array(z.nativeEnum(Chain)).min(1, "Pick at least one chain"),
    width: z.number().int().positive().max(4096).optional(),
    height: z.number().int().positive().max(4096).optional(),
    floorPriceUsdcCents: z.number().int().nonnegative().default(0),
  })
  .refine(
    (v) =>
      v.format !== "BANNER" || (v.width !== undefined && v.height !== undefined),
    { message: "Banner requires width and height", path: ["width"] },
  )

export type CreatePlacementInput = z.infer<typeof CreatePlacementSchema>

export const UpdatePlacementStatusSchema = z.object({
  status: z.nativeEnum(PlacementStatus),
})

export const AD_FORMAT_LABELS: Record<AdFormat, string> = {
  BANNER: "Banner",
  NATIVE: "Native",
  INTERSTITIAL: "Interstitial",
  WALLET_CONTEXTUAL: "Wallet contextual",
  VIDEO: "Video",
}

export const CHAIN_LABELS: Record<Chain, string> = {
  ETHEREUM: "Ethereum",
  POLYGON: "Polygon",
  SOLANA: "Solana",
  BASE: "Base",
  ARBITRUM: "Arbitrum",
  OPTIMISM: "Optimism",
  BSC: "BNB Chain",
  AVALANCHE: "Avalanche",
}

export const ALL_CHAINS: Chain[] = [
  "ETHEREUM",
  "POLYGON",
  "SOLANA",
  "BASE",
  "ARBITRUM",
  "OPTIMISM",
  "BSC",
  "AVALANCHE",
]

export const ALL_FORMATS: AdFormat[] = [
  "BANNER",
  "NATIVE",
  "INTERSTITIAL",
  "WALLET_CONTEXTUAL",
  "VIDEO",
]
