import type { Chain } from "@prisma/client"
import type { SVGProps } from "react"

export interface ChainBrand {
  bg: string
  fg: string
  Logo: (props: SVGProps<SVGSVGElement>) => React.JSX.Element
}

function EthereumLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3 6 12.4 12 16l6-3.6L12 3Z" fill="currentColor" opacity="0.85" />
      <path d="M12 17.2 6 13.6 12 21l6-7.4-6 3.6Z" fill="currentColor" />
    </svg>
  )
}

function BaseLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path
        d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0-6.31 4.92h7.81v3.16H5.69A6.5 6.5 0 0 0 12 18.5Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function ArbitrumLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path d="m12 6 4.5 11h-2.4l-.95-2.5h-2.3L9.9 17H7.5L12 6Zm-.4 6.7h1.5l-.75-2-.75 2Z" fill="#FFFFFF" />
    </svg>
  )
}

function OptimismLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path
        d="M9 9.5a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 9 14.5a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 9 9.5Zm0 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Zm5.5-1.3v4.8h1.4v-1.5h.7c1 0 1.7-.7 1.7-1.65 0-.95-.7-1.65-1.7-1.65h-2.1Zm1.4 1.2h.6c.3 0 .5.2.5.45s-.2.45-.5.45h-.6v-.9Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}

function PolygonLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M16 8.2 13.6 6.8a1 1 0 0 0-1 0L10.2 8.2a1 1 0 0 0-.5.86v2.8L8 12.8 6.5 12V9.2L8 8.4l1 .55v1.5l1.2-.7V7.6a1 1 0 0 0-.5-.85L8.4 5.4a1 1 0 0 0-1 0L5 6.8a1 1 0 0 0-.5.85v2.8a1 1 0 0 0 .5.86L7.4 12.7a1 1 0 0 0 1 0L10 11.85v-2.8L11.5 8.2 13 9v2.8l-1.5.85v-1.5l-1.2.7v1.55a1 1 0 0 0 .5.85l2.4 1.4a1 1 0 0 0 1 0l2.4-1.4a1 1 0 0 0 .5-.85v-2.8a1 1 0 0 0-.5-.85Z"
        fill="currentColor"
      />
    </svg>
  )
}

function BscLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M12 4 7 9l1.4 1.4L12 6.8l3.6 3.6L17 9l-5-5Z" fill="currentColor" />
      <path d="M4 12l1.4-1.4L6.8 12l-1.4 1.4L4 12Zm5.6 0L12 9.6l2.4 2.4L12 14.4 9.6 12Zm7.6 0 1.4-1.4L20 12l-1.4 1.4L17.2 12ZM12 17.2 8.4 13.6 7 15l5 5 5-5-1.4-1.4L12 17.2Z" fill="currentColor" />
    </svg>
  )
}

function AvalancheLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" />
      <path d="m11 9-4 7h3l1.4-2.5h2L12 9h-1Zm3 4 1.5 3h3l-2.4-4.2L14 13Z" fill="#FFFFFF" />
    </svg>
  )
}

function SolanaLogo(props: SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M6.7 15.5h11.6L16.3 17.6H4.7l2-2.1Zm0-3.5h11.6L16.3 14.1H4.7L6.7 12Zm0-3.5h11.6L16.3 10.6H4.7L6.7 8.5Z" fill="currentColor" />
    </svg>
  )
}

export const CHAIN_BRAND: Record<Chain, ChainBrand> = {
  ETHEREUM: { bg: "bg-[#EAEEFC]", fg: "text-[#3C4FC9]", Logo: EthereumLogo },
  BASE: { bg: "bg-[#E5EEFF]", fg: "text-[#0052FF]", Logo: BaseLogo },
  ARBITRUM: { bg: "bg-[#E1F0FB]", fg: "text-[#1E7CB8]", Logo: ArbitrumLogo },
  OPTIMISM: { bg: "bg-[#FCE5E8]", fg: "text-[#E11D48]", Logo: OptimismLogo },
  POLYGON: { bg: "bg-[#EFE6FB]", fg: "text-[#7C3AED]", Logo: PolygonLogo },
  BSC: { bg: "bg-[#FBF1D1]", fg: "text-[#A57E07]", Logo: BscLogo },
  AVALANCHE: { bg: "bg-[#FCE3E4]", fg: "text-[#C0252A]", Logo: AvalancheLogo },
  SOLANA: { bg: "bg-[#E6F8EE]", fg: "text-[#0E8F4D]", Logo: SolanaLogo },
}

export function chainBrand(chain: Chain): ChainBrand {
  return CHAIN_BRAND[chain]
}
