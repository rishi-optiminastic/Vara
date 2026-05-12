import type { Payout, PublisherStatement, PublisherWallet } from "@prisma/client"
import type { PayoutAddressInput, WithdrawInput } from "@/components/ssp/payouts/types"

async function jsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function submitWithdrawal(input: WithdrawInput): Promise<{ payout: Payout }> {
  return jsonOrThrow(
    await fetch("/api/ssp/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function updatePayoutAddress(
  input: PayoutAddressInput,
): Promise<{ wallet: PublisherWallet }> {
  return jsonOrThrow(
    await fetch("/api/ssp/payouts/address", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  )
}

export async function finalizeStatement(): Promise<{ statement: PublisherStatement }> {
  return jsonOrThrow(
    await fetch("/api/ssp/statements/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),
  )
}

export async function confirmPayout(
  id: string,
  txHash: string,
): Promise<{ payout: Payout }> {
  return jsonOrThrow(
    await fetch(`/api/ssp/payouts/${id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash }),
    }),
  )
}
