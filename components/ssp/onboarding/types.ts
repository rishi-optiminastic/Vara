import { z } from 'zod'
import { Chain } from '@prisma/client'

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform(v => (v && v.length > 0 ? v : undefined))

const evmOrSolanaAddress = z
  .string()
  .trim()
  .min(1)
  .refine(
    v => /^0x[a-fA-F0-9]{40}$/.test(v) || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v),
    'Enter a valid EVM (0x…) or Solana wallet address',
  )

export const InventoryCategoryEnum = z.enum([
  'DEFI',
  'NFT',
  'GAMING',
  'NEWS',
  'SOCIAL',
  'TOOLS',
  'OTHER',
])

export const AdFormatEnum = z.enum([
  'BANNER',
  'NATIVE',
  'INTERSTITIAL',
  'WALLET_CONTEXTUAL',
  'VIDEO',
])

export const PayoutChainEnum = z.enum(['BASE', 'POLYGON'])

export const ChainEnum = z.nativeEnum(Chain)

export const TrafficBucketEnum = z.enum(['UNDER_100K', '_100K_1M', '_1M_10M', 'OVER_10M'])

export const SspOnboardingStep1Schema = z.object({
  siteName: z.string().trim().min(2).max(120),
  primaryUrl: z.string().trim().url('Enter a valid URL (https://…)').max(255),
  contactEmail: z
    .string()
    .trim()
    .email()
    .max(255)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  telegramHandle: optionalString(64),
  discordHandle: optionalString(64),
  inventoryCategory: InventoryCategoryEnum,
})

export const SspOnboardingStep2Schema = z.object({
  payoutWalletAddress: evmOrSolanaAddress,
  payoutChain: PayoutChainEnum,
  audienceChains: z.array(ChainEnum).min(1, 'Pick at least one chain'),
  adFormats: z.array(AdFormatEnum).min(1, 'Pick at least one ad format'),
  monthlyImpressions: TrafficBucketEnum,
})

export const SspOnboardingSubmitSchema = SspOnboardingStep1Schema.merge(SspOnboardingStep2Schema)

export type SspOnboardingStep1Input = z.infer<typeof SspOnboardingStep1Schema>
export type SspOnboardingStep2Input = z.infer<typeof SspOnboardingStep2Schema>
export type SspOnboardingSubmitInput = z.infer<typeof SspOnboardingSubmitSchema>

export type InventoryCategory = z.infer<typeof InventoryCategoryEnum>
export type AdFormat = z.infer<typeof AdFormatEnum>
export type PayoutChain = z.infer<typeof PayoutChainEnum>
export type TrafficBucket = z.infer<typeof TrafficBucketEnum>

export const INVENTORY_CATEGORY_LABELS: Record<InventoryCategory, string> = {
  DEFI: 'DeFi',
  NFT: 'NFT',
  GAMING: 'Gaming',
  NEWS: 'News',
  SOCIAL: 'Social',
  TOOLS: 'Tools',
  OTHER: 'Other',
}

export const AD_FORMAT_LABELS: Record<AdFormat, string> = {
  BANNER: 'Banner',
  NATIVE: 'Native',
  INTERSTITIAL: 'Interstitial',
  WALLET_CONTEXTUAL: 'Wallet contextual',
  VIDEO: 'Video',
}

export const PAYOUT_CHAIN_LABELS: Record<PayoutChain, string> = {
  BASE: 'Base',
  POLYGON: 'Polygon',
}

export const TRAFFIC_BUCKET_LABELS: Record<TrafficBucket, string> = {
  UNDER_100K: 'Under 100k / mo',
  _100K_1M: '100k – 1M / mo',
  _1M_10M: '1M – 10M / mo',
  OVER_10M: '10M+ / mo',
}

export const AUDIENCE_CHAIN_LABELS: Record<Chain, string> = {
  ETHEREUM: 'Ethereum',
  POLYGON: 'Polygon',
  SOLANA: 'Solana',
  BASE: 'Base',
  ARBITRUM: 'Arbitrum',
  OPTIMISM: 'Optimism',
  BSC: 'BNB Chain',
  AVALANCHE: 'Avalanche',
}
