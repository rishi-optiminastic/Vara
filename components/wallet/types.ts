export type FundingMethodId = "crypto" | "bank" | "card" | "exchange"

export interface FundingMethod {
  id: FundingMethodId
  name: string
  description: string
  estimatedTime: string
  feeLabel: string
  enabled: boolean
}

export const FUNDING_METHODS: FundingMethod[] = [
  {
    id: "crypto",
    name: "Crypto wallet (USDC on Sepolia)",
    description: "Send testnet USDC to your Vara deposit address. Submit the transaction hash and we'll verify it on-chain and credit your wallet.",
    estimatedTime: "~30 sec after confirmation",
    feeLabel: "Network gas only",
    enabled: true,
  },
  {
    id: "bank",
    name: "Bank transfer (ACH / Wire)",
    description: "Coming soon. Will convert USD to USDC and credit your wallet automatically.",
    estimatedTime: "1–3 business days",
    feeLabel: "0.5% (min $5)",
    enabled: false,
  },
  {
    id: "card",
    name: "Credit / Debit card",
    description: "Coming soon. Top up instantly with Visa or Mastercard via on-ramp partner.",
    estimatedTime: "Instant",
    feeLabel: "2.9% + $0.30",
    enabled: false,
  },
  {
    id: "exchange",
    name: "Exchange transfer",
    description: "Coming soon. Withdraw USDC directly from Coinbase, Binance, Kraken, or any centralized exchange.",
    estimatedTime: "5–30 min",
    feeLabel: "Exchange fees apply",
    enabled: false,
  },
]
