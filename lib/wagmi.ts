import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import {
  coinbaseWallet,
  injectedWallet,
} from "@rainbow-me/rainbowkit/wallets"
import { createConfig, http } from "wagmi"
import { sepolia } from "wagmi/chains"

// We deliberately exclude `metaMaskWallet` and `walletConnectWallet`:
//  - `metaMaskWallet` (RainbowKit's bundled connector) routes through
//    MetaMask SDK's deep-link relay, which silently no-ops when the
//    extension is installed AND adds a `pulse.walletconnect.org` analytics
//    ping that gets blocked by adblockers + some corp networks.
//  - `injectedWallet` already handles the MetaMask extension via
//    `window.ethereum` directly, no SDK round-trip.
//  - `walletConnectWallet` is only needed for mobile/QR sign-in, which we
//    don't have a use case for yet. Add it back when you ship a mobile
//    flow.
const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [injectedWallet, coinbaseWallet],
    },
  ],
  {
    appName: "Vara",
    // Project id is unused without WalletConnect, but the helper still
    // requires the field to exist.
    projectId: "vara-local",
  },
)

export const wagmiConfig = createConfig({
  connectors,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  ssr: true,
})
