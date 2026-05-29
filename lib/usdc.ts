// Sepolia USDC (Circle's testnet faucet contract). Mirrors the address used
// by the on-chain verifier in be/src/helpers/sepolia.rs.
export const USDC_SEPOLIA_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const

// Native USDC on Polygon mainnet (Circle's canonical deployment, not bridged USDC.e)
export const USDC_POLYGON_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359" as const

export const USDC_DECIMALS = 6

// Address that receives platform deposits. Surfaced from the server (see
// /api/page/dsp/wallet -> depositAddress) but exposed here for client-side
// convenience.
export const DEPOSIT_RECEIVER_FALLBACK =
  process.env.NEXT_PUBLIC_DEPOSIT_RECEIVER_SEPOLIA ?? null

// ERC-20 ABI covering all functions the platform calls client-side
export const erc20Abi = [
  {
    type: "function",
    name: "transfer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "allowance",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const
