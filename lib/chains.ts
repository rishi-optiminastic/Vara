import { Chain } from "@prisma/client"

export interface ChainMeta {
  id: Chain
  name: string
  symbol: string
  evm: boolean
}

export const CHAINS: ChainMeta[] = [
  { id: Chain.ETHEREUM, name: "Ethereum", symbol: "ETH", evm: true },
  { id: Chain.BASE, name: "Base", symbol: "ETH", evm: true },
  { id: Chain.ARBITRUM, name: "Arbitrum", symbol: "ETH", evm: true },
  { id: Chain.OPTIMISM, name: "Optimism", symbol: "ETH", evm: true },
  { id: Chain.POLYGON, name: "Polygon", symbol: "MATIC", evm: true },
  { id: Chain.BSC, name: "BNB Chain", symbol: "BNB", evm: true },
  { id: Chain.AVALANCHE, name: "Avalanche", symbol: "AVAX", evm: true },
  { id: Chain.SOLANA, name: "Solana", symbol: "SOL", evm: false },
]

const EVM_RE = /^0x[a-fA-F0-9]{40}$/
const SOL_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

export function isValidContractAddress(addr: string): boolean {
  return EVM_RE.test(addr) || SOL_RE.test(addr)
}

export function chainName(id: Chain): string {
  return CHAINS.find((c) => c.id === id)?.name ?? id
}
