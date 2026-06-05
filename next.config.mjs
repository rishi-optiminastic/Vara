/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Lint is enforced via `pnpm lint` and the lint-staged pre-commit hook,
    // not the production build (mirrors the typescript.ignoreBuildErrors choice).
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Client router cache: re-entering a page within these windows reuses the
    // already-rendered RSC payload instead of refetching from the Rust backend.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // Tree-shake heavy barrel imports — speeds up dev compile and prod bundle.
    optimizePackageImports: [
      "@rainbow-me/rainbowkit",
      "wagmi",
      "viem",
      "@tanstack/react-query",
      "react-hook-form",
      "date-fns",
      "lodash",
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Everything under /api/* goes to the Rust backend EXCEPT:
        //  - /api/wallet/demo-topup — dev-only ledger top-up handled by Next.js.
        //    Hard-gated to non-prod; no BE endpoint needed.
        //  - /api/wallet/permit2 — Permit2 setup still served by Next.js until the
        //    EIP-712 signature verification is ported to Rust (alloy).
        // Everything else — auth, campaigns (incl. toggle-status), ad-groups
        // (incl. toggle-status), ads, assets, creatives, segments, onboarding,
        // wallet, ssp/* (incl. integration-status) — is served by the Rust backend.
        {
          source: '/api/:path((?!wallet/demo-topup(?:/|$)|wallet/permit2(?:/|$)).*)',
          destination: `${BACKEND_URL}/api/:path`,
        },
      ],
    }
  },
  // MetaMask SDK and WalletConnect ship with optional React Native + node-only
  // modules that webpack tries to resolve in a browser build and fails. These
  // shims tell webpack "treat as empty in the browser bundle" — required for
  // wagmi/RainbowKit to load without a runtime crash.
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
      lokijs: false,
      encoding: false,
    }
    if (!isServer) {
      config.externals = [...(config.externals || []), 'bufferutil', 'utf-8-validate']
    }
    return config
  },
}

export default nextConfig
