"use client"

import { useQuery } from "@tanstack/react-query"
import type { Wallet } from "@prisma/client"
import { getWallet, type WalletApiResponse } from "@/services/wallet"

const WALLET_QUERY_KEY = ["wallet"] as const
const POLL_MS = 3_000

interface UseWalletLiveResult {
  wallet: Wallet
  isRefreshing: boolean
}

/**
 * Subscribes to live wallet updates. Polls `/api/wallet` every few seconds
 * while the tab is visible so RTB impression spend reflects in the UI without
 * a manual refresh. Falls back to the SSR-provided wallet until the first
 * refetch lands.
 */
export function useWalletLive(initial: Wallet): UseWalletLiveResult {
  const initialData: WalletApiResponse = { wallet: initial, transactions: [] }
  const { data, isFetching } = useQuery({
    queryKey: WALLET_QUERY_KEY,
    queryFn: getWallet,
    initialData,
    refetchInterval: POLL_MS,
    refetchIntervalInBackground: false,
    staleTime: 0,
  })
  return { wallet: data.wallet, isRefreshing: isFetching }
}
