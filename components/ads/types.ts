import { z } from "zod"
import { AdType, AssetRole, AssetType, CreativeFormat } from "@prisma/client"

export const CreateCreativeSchema = z.object({
  campaignId: z.string().min(1, "Campaign is required"),
  name: z.string().min(1, "Name is required").max(120),
  format: z.nativeEnum(CreativeFormat),
  assetUrl: z.string().url("Must be a valid URL"),
  clickUrl: z.string().url("Must be a valid URL"),
  walletConnectCta: z.boolean().default(false),
})
export type CreateCreativeInput = z.infer<typeof CreateCreativeSchema>

// ===== Multi-format ads (Asset/Ad model) =====
//
// Schemas mirror the BE DTOs in be/src/dto/asset.rs and be/src/dto/ad.rs.
// Keep these in sync — the BE re-validates everything, so a bad input here
// surfaces as a 422 from the API rather than a silent failure.

export const CreateTextAssetSchema = z.object({
  type: z.enum(["HEADLINE", "LONG_HEADLINE", "DESCRIPTION", "CALL_TO_ACTION", "CLICK_URL"]),
  textValue: z.string().min(1, "Text is required"),
})
export type CreateTextAssetInput = z.infer<typeof CreateTextAssetSchema>

export const CreateFileAssetSchema = z.object({
  type: z.enum(["IMAGE", "VIDEO", "LOGO", "HTML_BUNDLE"]),
  fileUrl: z.string().url("Must be a valid URL"),
  fileMimeType: z.string().optional(),
  fileBytes: z.number().int().positive().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationMs: z.number().int().positive().optional(),
  aspectRatio: z.string().optional(),
  gatedByContract: z.string().optional(),
})
export type CreateFileAssetInput = z.infer<typeof CreateFileAssetSchema>

export const AdAssetLinkSchema = z.object({
  assetId: z.string().min(1),
  role: z.nativeEnum(AssetRole),
  weight: z.number().int().min(0).max(100).optional(),
})
export type AdAssetLink = z.infer<typeof AdAssetLinkSchema>

export const CreateAdSchema = z.object({
  adGroupId: z.string().min(1, "Ad group is required"),
  name: z.string().min(1, "Name is required").max(120),
  type: z.nativeEnum(AdType),
  clickUrl: z.string().url("Must be a valid URL"),
  finalUrlSuffix: z.string().optional(),
  trafficShare: z.number().int().min(0).max(100).optional(),
  assets: z.array(AdAssetLinkSchema).min(1, "At least one asset is required").max(30),
})
export type CreateAdInput = z.infer<typeof CreateAdSchema>

export const UpdateAdSchema = CreateAdSchema.partial().extend({
  status: z.enum(["DRAFT", "IN_REVIEW", "ACTIVE", "PAUSED", "REJECTED", "ARCHIVED"]).optional(),
})
export type UpdateAdInput = z.infer<typeof UpdateAdSchema>

// ===== Asset role conventions used by the ResponsiveDisplay builder =====

export const RESPONSIVE_DISPLAY_HEADLINE_SLOTS = [
  AssetRole.HEADLINE_1,
  AssetRole.HEADLINE_2,
  AssetRole.HEADLINE_3,
  AssetRole.HEADLINE_4,
  AssetRole.HEADLINE_5,
] as const

export const RESPONSIVE_DISPLAY_DESCRIPTION_SLOTS = [
  AssetRole.DESCRIPTION_1,
  AssetRole.DESCRIPTION_2,
  AssetRole.DESCRIPTION_3,
] as const

export interface ResponsiveDisplayDraft {
  name: string
  clickUrl: string
  primaryImageAssetId: string | null
  squareImageAssetId: string | null
  logoAssetId: string | null
  headlines: string[]
  descriptions: string[]
  cta: string | null
}

/// Headline character limits enforced by the BE. Keep in sync with
/// `be/src/dto/asset.rs` (HEADLINE_MAX / LONG_HEADLINE_MAX / DESCRIPTION_MAX).
export const ASSET_LIMITS = {
  HEADLINE: 30,
  LONG_HEADLINE: 90,
  DESCRIPTION: 90,
  CALL_TO_ACTION: 25,
} satisfies Partial<Record<AssetType, number>>
