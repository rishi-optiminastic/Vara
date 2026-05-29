import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    WALLET_DEPOSIT_RECEIVER_SEPOLIA: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid 0x… 20-byte address")
      .optional(),
    SEPOLIA_RPC_URL: z.string().url().default("https://ethereum-sepolia-rpc.publicnode.com"),
    // Polygon / Permit2 — server-side only (operator private key lives here)
    POLYGON_RPC_URL: z.string().url().default("https://polygon-rpc.com"),
    VARA_ESCROW_ADDRESS: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid 0x… 20-byte address")
      .optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_RTB_ENDPOINT: z.string().url().default('https://rtb.vara.xyz'),
    // Surfaced to client so the Permit2 setup dialog can show the escrow address
    NEXT_PUBLIC_VARA_ESCROW_ADDRESS: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid 0x… 20-byte address")
      .optional(),
    NEXT_PUBLIC_POLYGON_RPC_URL: z.string().url().optional(),
    // Permit2 chain override: 137 = Polygon mainnet (default), 80002 = Polygon Amoy testnet
    NEXT_PUBLIC_PERMIT2_CHAIN_ID: z.string().optional(),
    // USDC contract address for the Permit2 chain (required when using Amoy testnet)
    NEXT_PUBLIC_USDC_ADDRESS: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Must be a valid 0x… 20-byte address")
      .optional(),
    NEXT_PUBLIC_POLYGON_AMOY_RPC_URL: z.string().url().optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    WALLET_DEPOSIT_RECEIVER_SEPOLIA: process.env.WALLET_DEPOSIT_RECEIVER_SEPOLIA,
    SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL,
    POLYGON_RPC_URL: process.env.POLYGON_RPC_URL,
    VARA_ESCROW_ADDRESS: process.env.VARA_ESCROW_ADDRESS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_RTB_ENDPOINT: process.env.NEXT_PUBLIC_RTB_ENDPOINT,
    NEXT_PUBLIC_VARA_ESCROW_ADDRESS: process.env.NEXT_PUBLIC_VARA_ESCROW_ADDRESS,
    NEXT_PUBLIC_POLYGON_RPC_URL: process.env.NEXT_PUBLIC_POLYGON_RPC_URL,
    NEXT_PUBLIC_PERMIT2_CHAIN_ID: process.env.NEXT_PUBLIC_PERMIT2_CHAIN_ID,
    NEXT_PUBLIC_USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS,
    NEXT_PUBLIC_POLYGON_AMOY_RPC_URL: process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
