"use client"

import { useState } from "react"
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"

import { wagmiConfig } from "@/lib/wagmi"
import "@rainbow-me/rainbowkit/styles.css"

interface Props {
  children: React.ReactNode
}

export function Web3Provider({ children }: Props): React.JSX.Element {
  // QueryClient is created lazily once per mount so React's StrictMode
  // double-render doesn't share state across instances.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      }),
  )

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#37322F",
            accentColorForeground: "#FAFAF8",
            borderRadius: "medium",
            fontStack: "system",
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
