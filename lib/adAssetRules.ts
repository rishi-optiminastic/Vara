import type { AdType, AssetRole } from "@prisma/client"

/// Mirrors `be/src/helpers/ads.rs::meets_minimum_mix`. Both copies must stay
/// in sync — the BE re-enforces this rule so a divergence surfaces as a
/// rejected save rather than silently-unservable ads. Kept in TS too because
/// the Next.js API routes do their own writes (they don't proxy to the Rust
/// BE) and would otherwise let `hasMinAssets` drift to default `false`.

function count(roles: AssetRole[], target: AssetRole): number {
  let n = 0
  for (const r of roles) if (r === target) n++
  return n
}

function countDistinct(roles: AssetRole[], targets: AssetRole[]): number {
  let n = 0
  for (const t of targets) if (count(roles, t) > 0) n++
  return n
}

const HEADLINE_SLOTS: AssetRole[] = [
  "HEADLINE_1", "HEADLINE_2", "HEADLINE_3", "HEADLINE_4", "HEADLINE_5",
]
const DESCRIPTION_SLOTS: AssetRole[] = ["DESCRIPTION_1", "DESCRIPTION_2", "DESCRIPTION_3"]

export function meetsMinimumMix(adType: AdType, roles: AssetRole[]): boolean {
  const headlines = countDistinct(roles, HEADLINE_SLOTS)
  const descriptions = countDistinct(roles, DESCRIPTION_SLOTS)
  const has = (r: AssetRole): boolean => count(roles, r) >= 1

  switch (adType) {
    case "STATIC_DISPLAY":
    case "INTERSTITIAL":
      return has("PRIMARY_IMAGE")
    case "HTML5":
      return has("HTML_BUNDLE")
    case "RESPONSIVE_DISPLAY":
      return (
        has("PRIMARY_IMAGE") &&
        has("SQUARE_IMAGE") &&
        has("LOGO") &&
        headlines >= 2 &&
        descriptions >= 1
      )
    case "VIDEO_IN_STREAM":
    case "VIDEO_OUTSTREAM":
    case "VIDEO_REWARDED":
      return has("VIDEO_FILE")
    case "NATIVE":
    case "APP_INSTALL":
      return has("PRIMARY_IMAGE") && headlines >= 1 && descriptions >= 1
    case "WALLET_CONTEXTUAL":
    case "TOKEN_GATED":
      return has("PRIMARY_IMAGE") && headlines >= 1
    case "CATALOG_NFT":
      return has("PRIMARY_IMAGE") && headlines >= 1
    default:
      return false
  }
}
