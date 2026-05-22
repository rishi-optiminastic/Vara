/** @type {import('next').NextConfig} */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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
        //  - /api/auth/* — Better Auth's catch-all route in Next.js.
        //  - /api/onboarding — owned by the Next.js route at app/api/onboarding/
        //    because the BE's own handler references a `user.activeAdvertiserId`
        //    column that doesn't exist in the current schema.
        //  - /api/wallet/demo-topup — dev-only ledger top-up handled by Next.js
        //    so we don't need a BE endpoint for it. Hard-gated to non-prod.
        // The negative lookahead in the source pattern is what excludes them.
        {
          source: '/api/:path((?!auth(?:/|$)|onboarding(?:/|$)|wallet/demo-topup(?:/|$)|campaigns/[^/]+/toggle-status(?:/|$)|ad-groups/[^/]+/toggle-status(?:/|$)).*)',
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
