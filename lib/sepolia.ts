import { env } from "@/lib/env"

export const USDC_SEPOLIA_CONTRACT = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238"
export const USDC_DECIMALS = 6

const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

interface RpcLog {
  address: string
  topics: string[]
  data: string
}

interface RpcReceipt {
  status: string
  blockNumber: string
  logs: RpcLog[]
}

export interface VerifiedTransfer {
  fromAddress: string
  toAddress: string
  amountRaw: bigint
  amountUsdcCents: number
  blockNumber: number
}

async function rpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(env.SEPOLIA_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Sepolia RPC failed: ${res.status}`)
  const body = (await res.json()) as { result?: T; error?: { message: string } }
  if (body.error) throw new Error(`Sepolia RPC error: ${body.error.message}`)
  if (body.result === undefined) throw new Error("Sepolia RPC: empty result")
  return body.result
}

function topicToAddress(topic: string): string {
  return "0x" + topic.slice(-40).toLowerCase()
}

function usdcRawToCents(raw: bigint): number {
  // USDC has 6 decimals on-chain; we store in cents (2 decimals).
  // cents = raw * 100 / 10^6 = raw / 10^4
  const cents = (raw * 100n) / 10n ** BigInt(USDC_DECIMALS)
  return Number(cents)
}

export async function verifySepoliaUsdcTransfer(
  txHash: string,
  expectedTo: string,
): Promise<VerifiedTransfer> {
  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    throw new Error("Invalid transaction hash")
  }

  const receipt = await rpc<RpcReceipt | null>("eth_getTransactionReceipt", [txHash])
  if (!receipt) throw new Error("Transaction not found yet — wait for confirmation and retry")
  if (receipt.status !== "0x1") throw new Error("Transaction failed on-chain")

  const expectedToLc = expectedTo.toLowerCase()
  const usdcLog = receipt.logs.find(
    (log) =>
      log.address.toLowerCase() === USDC_SEPOLIA_CONTRACT &&
      log.topics[0] === TRANSFER_TOPIC,
  )
  if (!usdcLog) throw new Error("No USDC Transfer event in this transaction")
  if (!usdcLog.topics[1] || !usdcLog.topics[2]) {
    throw new Error("Malformed USDC Transfer log")
  }

  const fromAddress = topicToAddress(usdcLog.topics[1])
  const toAddress = topicToAddress(usdcLog.topics[2])
  if (toAddress !== expectedToLc) {
    throw new Error(`USDC was sent to ${toAddress}, not the Vara deposit address`)
  }

  const amountRaw = BigInt(usdcLog.data)
  if (amountRaw === 0n) throw new Error("Transfer amount is zero")

  return {
    fromAddress,
    toAddress,
    amountRaw,
    amountUsdcCents: usdcRawToCents(amountRaw),
    blockNumber: parseInt(receipt.blockNumber, 16),
  }
}
