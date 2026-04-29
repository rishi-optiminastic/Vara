import { createHash } from "node:crypto"

export function hashWallet(address: string): string {
  return createHash("sha256").update(address.toLowerCase().trim()).digest("hex")
}
