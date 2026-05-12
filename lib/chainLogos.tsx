import type { Chain } from "@prisma/client"
import type { ImgHTMLAttributes } from "react"
import { chainName } from "@/lib/chains"

/**
 * Canonical chain icons sourced from DefiLlama's public icon CDN
 * (https://icons.llamao.fi/icons/chains). Stable URLs, served from a
 * production CDN — keeps us out of the business of hand-drawing brand marks.
 */
const LOGO_URL: Record<Chain, string> = {
  ETHEREUM: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
  BASE: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
  ARBITRUM: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
  OPTIMISM: "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg",
  POLYGON: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
  BSC: "https://icons.llamao.fi/icons/chains/rsz_bsc.jpg",
  AVALANCHE: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
  SOLANA: "https://icons.llamao.fi/icons/chains/rsz_solana.jpg",
}

export interface ChainBrand {
  bg: string
  fg: string
  Logo: (props: ImgHTMLAttributes<HTMLImageElement>) => React.JSX.Element
}

function makeLogo(chain: Chain): ChainBrand["Logo"] {
  const src = LOGO_URL[chain]
  const alt = chainName(chain)
  return function ChainLogo({ className, ...rest }) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`rounded-full object-cover ${className ?? ""}`}
        {...rest}
      />
    )
  }
}

export const CHAIN_BRAND: Record<Chain, ChainBrand> = {
  ETHEREUM: { bg: "bg-[#EAEEFC]", fg: "text-[#3C4FC9]", Logo: makeLogo("ETHEREUM") },
  BASE: { bg: "bg-[#E5EEFF]", fg: "text-[#0052FF]", Logo: makeLogo("BASE") },
  ARBITRUM: { bg: "bg-[#E1F0FB]", fg: "text-[#1E7CB8]", Logo: makeLogo("ARBITRUM") },
  OPTIMISM: { bg: "bg-[#FCE5E8]", fg: "text-[#E11D48]", Logo: makeLogo("OPTIMISM") },
  POLYGON: { bg: "bg-[#EFE6FB]", fg: "text-[#7C3AED]", Logo: makeLogo("POLYGON") },
  BSC: { bg: "bg-[#FBF1D1]", fg: "text-[#A57E07]", Logo: makeLogo("BSC") },
  AVALANCHE: { bg: "bg-[#FCE3E4]", fg: "text-[#C0252A]", Logo: makeLogo("AVALANCHE") },
  SOLANA: { bg: "bg-[#E6F8EE]", fg: "text-[#0E8F4D]", Logo: makeLogo("SOLANA") },
}

export function chainBrand(chain: Chain): ChainBrand {
  return CHAIN_BRAND[chain]
}

export function chainLogoUrl(chain: Chain): string {
  return LOGO_URL[chain]
}
