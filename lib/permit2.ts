import { polygon, polygonAmoy } from "wagmi/chains"

export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3" as const

// Set NEXT_PUBLIC_PERMIT2_CHAIN_ID=80002 in .env.local for Polygon Amoy testnet,
// leave unset (default 137) for Polygon mainnet in production.
const configuredChainId = Number(process.env.NEXT_PUBLIC_PERMIT2_CHAIN_ID ?? "137")
export const PERMIT2_CHAIN = configuredChainId === polygonAmoy.id ? polygonAmoy : polygon

// USDC address for the configured chain.
// Polygon mainnet default: Circle's native USDC (not bridged USDC.e).
// Override with NEXT_PUBLIC_USDC_ADDRESS for testnet (e.g. Polygon Amoy USDC).
export const USDC_POLYGON_ADDRESS = (
  process.env.NEXT_PUBLIC_USDC_ADDRESS ?? "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
) as `0x${string}`

export const POLYGON_CHAIN_ID = PERMIT2_CHAIN.id

// Authorization defaults: 500 USDC ceiling, 30-day window
export const AUTH_CEILING_USDC = 500n
export const AUTH_DURATION_DAYS = 30
export const AUTH_CEILING_RAW = AUTH_CEILING_USDC * 10n ** 6n // 6 decimals → 500_000_000

export const RECHARGE_THRESHOLD_CENTS = 1000  // $10.00
export const RECHARGE_AMOUNT_CENTS = 2500     // $25.00

// EIP-712 domain for Permit2 on the configured chain
export const permit2Domain = {
  name: "Permit2",
  chainId: PERMIT2_CHAIN.id,
  verifyingContract: PERMIT2_ADDRESS,
}

// AllowanceTransfer typed data types
export const PERMIT2_TYPES = {
  PermitSingle: [
    { name: "details", type: "PermitDetails" },
    { name: "spender", type: "address" },
    { name: "sigDeadline", type: "uint256" },
  ],
  PermitDetails: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint160" },
    { name: "expiration", type: "uint48" },
    { name: "nonce", type: "uint48" },
  ],
} as const

// Minimal Permit2 ABI — only what the frontend reads
export const permit2Abi = [
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "user", type: "address" },
      { name: "token", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [
      { name: "amount", type: "uint160" },
      { name: "expiration", type: "uint48" },
      { name: "nonce", type: "uint48" },
    ],
  },
] as const

interface PermitParams {
  tokenAddress: `0x${string}`
  spenderAddress: `0x${string}`
  amount: bigint
  expiration: number
  nonce: number
  sigDeadline: bigint
}

export function buildPermit2TypedData(params: PermitParams) {
  return {
    domain: permit2Domain,
    types: PERMIT2_TYPES,
    primaryType: "PermitSingle" as const,
    message: {
      details: {
        token: params.tokenAddress,
        amount: params.amount,
        expiration: params.expiration,
        nonce: params.nonce,
      },
      spender: params.spenderAddress,
      sigDeadline: params.sigDeadline,
    },
  }
}

// Derive authorization health from expiry date
export function authDaysRemaining(expiresAt: Date): number {
  return Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000)
}

export function authIsExpiringSoon(expiresAt: Date): boolean {
  return authDaysRemaining(expiresAt) <= 7
}
