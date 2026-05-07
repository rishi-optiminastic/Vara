import type { Wallet, WalletTransaction } from "@prisma/client"

export interface WalletApiResponse {
  wallet: Wallet
  transactions: WalletTransaction[]
}

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function getWallet(): Promise<WalletApiResponse> {
  return jsonOrThrow(await fetch("/api/wallet", { cache: "no-store" }))
}

export async function submitDeposit(txHash: string): Promise<{ wallet: Wallet }> {
  return jsonOrThrow(
    await fetch("/api/wallet/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash, network: "SEPOLIA" }),
    }),
  )
}
