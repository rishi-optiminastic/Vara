import type {
  Chain,
  DeviceType,
  Objective,
  Vertical,
  PricingModel,
  BidStrategy,
  Pacing,
} from "@prisma/client"

export interface TemplatePreset {
  id: string
  label: string
  tagline: string
  blurb: string
  vertical: Vertical
  objective: Objective
  pricingModel: PricingModel
  bidStrategy: BidStrategy
  pacing: Pacing
  budgetUsd: string
  dailyCapUsd: string
  bidUsd: string
  chains: Chain[]
  geos: string
  deviceTypes: DeviceType[]
  freqCap: string
  freqHours: string
  brandSafety: string
  highlights: string[]
}

export const CAMPAIGN_TEMPLATES: TemplatePreset[] = [
  {
    id: "token-launch",
    label: "Token Launch",
    tagline: "Drive holders for a TGE",
    blurb: "On-chain conversion focus, max-conversions bidding, EVM-heavy targeting.",
    vertical: "TOKEN_LAUNCH",
    objective: "TOKEN_HOLDERS",
    pricingModel: "CPA",
    bidStrategy: "MAX_CONVERSIONS",
    pacing: "STANDARD",
    budgetUsd: "5000",
    dailyCapUsd: "500",
    bidUsd: "8.00",
    chains: ["ETHEREUM", "BASE", "ARBITRUM"],
    geos: "US, GB, SG, DE",
    deviceTypes: ["DESKTOP", "MOBILE"],
    freqCap: "5",
    freqHours: "24",
    brandSafety: "rug, scam, hack, gambling, adult",
    highlights: ["Acquire token holders", "EVM-heavy chains", "Conversion bidding"],
  },
  {
    id: "nft-drop",
    label: "NFT Drop",
    tagline: "Mint event traffic",
    blurb: "Awareness + native creatives, bursty pacing for a short mint window.",
    vertical: "NFT_DROP",
    objective: "ON_CHAIN_CONVERSION",
    pricingModel: "CPM",
    bidStrategy: "AUTO",
    pacing: "ACCELERATED",
    budgetUsd: "2500",
    dailyCapUsd: "",
    bidUsd: "4.50",
    chains: ["ETHEREUM", "BASE", "SOLANA"],
    geos: "US, GB, JP, KR",
    deviceTypes: ["DESKTOP", "MOBILE"],
    freqCap: "8",
    freqHours: "12",
    brandSafety: "rug, scam, hack, gambling, adult",
    highlights: ["Burst mint traffic", "ETH + Solana", "Accelerated pacing"],
  },
  {
    id: "defi-growth",
    label: "DeFi Growth",
    tagline: "Wallet connects for a protocol",
    blurb: "CPC bidding, even pacing, high-intent EVM L2 audiences.",
    vertical: "DEFI",
    objective: "WALLET_CONNECTS",
    pricingModel: "CPC",
    bidStrategy: "TARGET_CPA",
    pacing: "EVEN",
    budgetUsd: "3000",
    dailyCapUsd: "200",
    bidUsd: "1.50",
    chains: ["ARBITRUM", "OPTIMISM", "BASE"],
    geos: "US, GB, DE, SG, IN",
    deviceTypes: ["DESKTOP"],
    freqCap: "4",
    freqHours: "24",
    brandSafety: "rug, scam, hack, gambling, adult",
    highlights: ["Target connects", "L2-focused", "Steady CPC pacing"],
  },
  {
    id: "dapp-growth",
    label: "dApp Growth",
    tagline: "Acquire active users",
    blurb: "Awareness + conversion mix across all major chains, mobile-friendly.",
    vertical: "DAPP_GROWTH",
    objective: "AWARENESS",
    pricingModel: "CPM",
    bidStrategy: "AUTO",
    pacing: "STANDARD",
    budgetUsd: "1500",
    dailyCapUsd: "100",
    bidUsd: "2.50",
    chains: ["ETHEREUM", "BASE", "POLYGON", "SOLANA"],
    geos: "",
    deviceTypes: ["DESKTOP", "MOBILE"],
    freqCap: "6",
    freqHours: "24",
    brandSafety: "rug, scam, hack, gambling, adult",
    highlights: ["Worldwide reach", "Multi-chain mix", "Balanced pacing"],
  },
]

export function getTemplate(id: string): TemplatePreset | undefined {
  return CAMPAIGN_TEMPLATES.find((t) => t.id === id)
}
