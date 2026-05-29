"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export type Permit2Status = "none" | "ACTIVE" | "EXPIRED" | "REVOKED" | "CEILING_REACHED"

export interface Permit2AuthData {
  status: Permit2Status
  userWallet?: string
  authorizedAmount?: string
  amountPulled?: string
  expiresAt?: string
  chainId?: number
  createdAt?: string
}

async function fetchPermit2Status(): Promise<Permit2AuthData> {
  const res = await fetch("/api/wallet/permit2", { credentials: "same-origin" })
  if (!res.ok) throw new Error("Failed to load authorization status")
  return res.json() as Promise<Permit2AuthData>
}

async function revokePermit2(): Promise<void> {
  const res = await fetch("/api/wallet/permit2", {
    method: "DELETE",
    credentials: "same-origin",
  })
  if (!res.ok) throw new Error("Failed to revoke authorization")
}

export function usePermit2Status(): {
  data: Permit2AuthData | undefined
  isLoading: boolean
  refetch: () => void
} {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["permit2-status"],
    queryFn: fetchPermit2Status,
    staleTime: 60_000,
  })
  return { data, isLoading, refetch }
}

export function useRevokePermit2(): {
  revoke: () => void
  isPending: boolean
} {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: revokePermit2,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["permit2-status"] })
    },
  })
  return { revoke: mutate, isPending }
}
