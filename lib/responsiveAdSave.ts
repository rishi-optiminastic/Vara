import type { Ad, AssetRole } from "@prisma/client"

import type { AdAssetLink } from "@/components/ads/types"
import { createAd } from "@/services/ads"
import { createTextAsset } from "@/services/assets"
import type { ResponsiveAdDraft } from "@/hooks/useResponsiveAdDraft"
import { logger } from "@/lib/logger"

interface SaveParams {
  draft: ResponsiveAdDraft
  adGroupId: string
}

const HEADLINE_ROLES: AssetRole[] = [
  "HEADLINE_1",
  "HEADLINE_2",
  "HEADLINE_3",
  "HEADLINE_4",
  "HEADLINE_5",
]
const DESCRIPTION_ROLES: AssetRole[] = ["DESCRIPTION_1", "DESCRIPTION_2", "DESCRIPTION_3"]

/// Save a ResponsiveDisplay draft: create the text assets first (each on its
/// own request — they're idempotent, so a partial failure can be retried),
/// then POST /api/ads with the assembled link set. Returns the created Ad.
///
/// The BE assigns `hasMinAssets` based on the link mix we send; if the draft
/// is incomplete the BE will still accept the row (status = DRAFT) but the
/// RTB engine won't serve it.
export async function saveResponsiveAd({ draft, adGroupId }: SaveParams): Promise<Ad> {
  const headlineLinks = await createHeadlineLinks(draft.headlines)
  const descriptionLinks = await createDescriptionLinks(draft.descriptions)
  const ctaLinks = await createCtaLinks(draft.cta)

  const imageLinks: AdAssetLink[] = []
  if (draft.primaryImage) {
    imageLinks.push({ assetId: draft.primaryImage.id, role: "PRIMARY_IMAGE" })
  }
  if (draft.squareImage) {
    imageLinks.push({ assetId: draft.squareImage.id, role: "SQUARE_IMAGE" })
  }
  if (draft.logo) {
    imageLinks.push({ assetId: draft.logo.id, role: "LOGO" })
  }

  const assets = [...imageLinks, ...headlineLinks, ...descriptionLinks, ...ctaLinks]

  logger.debug({ adGroupId, assetCount: assets.length }, "saving responsive ad")
  const { ad } = await createAd({
    adGroupId,
    name: draft.name.trim(),
    type: "RESPONSIVE_DISPLAY",
    clickUrl: draft.clickUrl.trim(),
    assets,
  })
  return ad
}

async function createHeadlineLinks(values: string[]): Promise<AdAssetLink[]> {
  const links: AdAssetLink[] = []
  for (let i = 0; i < values.length; i++) {
    const v = values[i]?.trim() ?? ""
    if (!v) continue
    const role = HEADLINE_ROLES[i]
    if (!role) break
    const { asset } = await createTextAsset({ type: "HEADLINE", textValue: v })
    links.push({ assetId: asset.id, role })
  }
  return links
}

async function createDescriptionLinks(values: string[]): Promise<AdAssetLink[]> {
  const links: AdAssetLink[] = []
  for (let i = 0; i < values.length; i++) {
    const v = values[i]?.trim() ?? ""
    if (!v) continue
    const role = DESCRIPTION_ROLES[i]
    if (!role) break
    const { asset } = await createTextAsset({ type: "DESCRIPTION", textValue: v })
    links.push({ assetId: asset.id, role })
  }
  return links
}

async function createCtaLinks(cta: string): Promise<AdAssetLink[]> {
  const v = cta.trim()
  if (!v) return []
  const { asset } = await createTextAsset({ type: "CALL_TO_ACTION", textValue: v })
  return [{ assetId: asset.id, role: "CTA" }]
}
