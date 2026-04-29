import { z } from 'zod'
import { BusinessType, Chain } from '@prisma/client'

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

const addressEntry = z
  .string()
  .trim()
  .refine(
    v => v === '' || /^0x[a-fA-F0-9]{40}$/.test(v) || /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(v),
    'Enter a valid wallet or contract address',
  )

export const BusinessTypeEnum = z.nativeEnum(BusinessType)
export const ChainEnum = z.nativeEnum(Chain)

export const OnboardingStep1Schema = z.object({
  projectName: z.string().trim().min(2).max(120),
  websiteUrl: z
    .string()
    .trim()
    .url('Enter a valid URL (https://…)')
    .max(255)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  contactEmail: z
    .string()
    .trim()
    .email()
    .max(255)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  telegramHandle: optionalString(64),
  discordHandle: optionalString(64),
  businessType: BusinessTypeEnum,
})

export const OnboardingStep2Schema = z.object({
  primaryWalletAddress: evmOrSolanaAddress,
  supportedChains: z.array(ChainEnum).min(1, 'Pick at least one chain'),
  tokenContracts: z.array(addressEntry).default([]),
  nftContracts: z.array(addressEntry).default([]),
  treasuryWallets: z.array(addressEntry).default([]),
  campaignWallets: z.array(addressEntry).default([]),
})

export const OnboardingSubmitSchema = OnboardingStep1Schema.merge(OnboardingStep2Schema)

export type OnboardingStep1Input = z.infer<typeof OnboardingStep1Schema>
export type OnboardingStep2Input = z.infer<typeof OnboardingStep2Schema>
export type OnboardingSubmitInput = z.infer<typeof OnboardingSubmitSchema>

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  DEFI: 'DeFi',
  NFT: 'NFT',
  GAMING: 'Gaming',
  EXCHANGE: 'Exchange',
  WALLET: 'Wallet',
  OTHER: 'Other',
}

export const CHAIN_LABELS: Record<Chain, string> = {
  ETHEREUM: 'Ethereum',
  POLYGON: 'Polygon',
  SOLANA: 'Solana',
  BASE: 'Base',
  ARBITRUM: 'Arbitrum',
  OPTIMISM: 'Optimism',
  BSC: 'BNB Chain',
  AVALANCHE: 'Avalanche',
}
