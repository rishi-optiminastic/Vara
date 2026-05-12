import type { SwissNavProps } from "@/components/landing/SwissNav"
import type { SwissHeroProps } from "@/components/landing/SwissHero"
import type { SwissSummitProps } from "@/components/landing/SwissSummit"
import type { SwissHighlightsProps } from "@/components/landing/SwissHighlights"
import type { SwissModulesProps } from "@/components/landing/SwissModules"
import type { SwissScheduleProps } from "@/components/landing/SwissSchedule"
import type { SwissPricingProps } from "@/components/landing/SwissPricing"
import type { SwissFooterProps } from "@/components/landing/SwissFooter"

export const NAV: SwissNavProps = {
  brand: { label: "VARA.", href: "/" },
  brandLogo: { src: "/VaraAd.png", alt: "Vara", width: 1080, height: 1080 },
  items: [
    { label: "OVERVIEW", href: "#overview" },
    { label: "ARCHITECTURE", href: "#architecture" },
    { label: "MODULES", href: "#modules" },
    { label: "ROADMAP", href: "#roadmap" },
    { label: "ACCESS", href: "#access" },
    { label: "DSP", href: "/dsp" },
    { label: "SSP", href: "/ssp" },
    { label: "DOCS", href: "#docs" },
  ],
  cta: { label: "EARLY ACCESS", href: "/early-access" },
}

export const HERO: SwissHeroProps = {
  eyebrow: "VARA · BUILT IN PUBLIC · 2025—2026",
  title: (
    <>
      Crypto ad exchange
      <br />
      for real-time settlement
    </>
  ),
  body: "Vara is a centralized RTB exchange with crypto-native attribution, audit, and settlement — built for product teams that ship to a real opening bell.",
  primaryCta: { label: "Request access", href: "/early-access" },
  secondaryCta: { label: "View roadmap", href: "#roadmap" },
  meta: "NOV 2025 — Q2 2026 · MONTREAL · REMOTE FIRST",
}

export const SUMMIT: SwissSummitProps = {
  heading: "A platform for real-time advertising",
  pillars: [
    { title: "Auction execution", sub: "Sub-100ms RTB path" },
    { title: "Identity intelligence", sub: "Wallet-native targeting" },
    { title: "Settlement rails", sub: "USDC-first, auditable" },
  ],
  watermark: "796",
  stats: [
    {
      number: "7",
      label: "Layers",
      body: "Experience, gateway, core services, RTB execution, identity intelligence, settlement, and observability.",
      link: { label: "Full architecture", href: "#architecture" },
    },
    {
      number: "9",
      label: "Modules",
      body: "Campaigns, publisher, SDK, auction, reporting, ledger, attribution, fraud, and treasury.",
      link: { label: "See modules", href: "#modules" },
    },
    {
      number: "6",
      label: "Services",
      body: "Bidder, exchange, identity graph, settlement engine, event bus, and observability plane.",
      link: { label: "See services", href: "#services" },
    },
  ],
}

export const HIGHLIGHTS: SwissHighlightsProps = {
  eyebrow: "PROGRAMME PREVIEW",
  heading: "Surface highlights",
  body: "A rotating glimpse into the surfaces, contracts, and instruments shaping Vara. Each feature cycles through a different layer of the platform.",
  badge: "ALL SURFACES",
  items: [
    { title: "Bidder", caption: "REAL-TIME LAYER", swatch: "muted" },
    { title: "Identity graph", caption: "INTELLIGENCE", swatch: "primary" },
    { title: "Settlement", caption: "TRUST LAYER", swatch: "dark" },
    { title: "Telemetry", caption: "PLATFORM", swatch: "muted" },
  ],
}

export const MODULES: SwissModulesProps = {
  eyebrow: "VOICES OF VARA",
  heading: "Modules & services",
  body: "Five planes spanning execution, intelligence, and trust. Explore the surfaces that compose the Vara exchange.",
  modules: [
    {
      eyebrow: "Auction Path, RTB Core",
      title: "EXCHANGE",
      body: "Go-based bidder with Redis hot cache. Async events keep the bid path free of blockchain calls — sub-100ms responses, always.",
      location: "REAL-TIME LAYER",
      tags: ["Bidding", "Caching", "Throughput"],
    },
    {
      eyebrow: "Wallet Graph, Targeting",
      title: "IDENTITY",
      body: "Build wallet-graph segments and conversion mapping. Publisher trust signals fold into bid weighting without leaking PII.",
      location: "INTELLIGENCE LAYER",
      tags: ["Graph", "Targeting", "Privacy"],
    },
    {
      eyebrow: "Append-only ledger",
      title: "SETTLEMENT",
      body: "USDC-first batched payouts with on-chain proofs. Reconciliation lives outside the auction hot path.",
      location: "TRUST LAYER",
      tags: ["Ledger", "Payouts", "Proofs"],
      variant: "dark",
    },
    {
      eyebrow: "Streaming events",
      title: "OBSERVABILITY",
      body: "Event-native analytics, latency histograms, and per-tenant cost attribution from a single bus.",
      location: "PLATFORM LAYER",
      tags: ["Telemetry", "SLOs", "Cost"],
    },
    {
      eyebrow: "Tenant scoping",
      title: "CONTROL PLANE",
      body: "Next.js dashboards plus typed services on Postgres. Strict tenant scoping for campaigns and creatives.",
      location: "EXPERIENCE LAYER",
      tags: ["Dashboards", "APIs", "RBAC"],
    },
  ],
}

export const SCHEDULE: SwissScheduleProps = {
  heading: "Build roadmap",
  body: "Every phase is sequenced to move from foundations to execution to trust. Plan the surfaces you touch and bookmark the milestones that matter to your team.",
  days: [
    {
      label: "PHASE 1 — FOUNDATIONS",
      rows: [
        {
          title: "MONOREPO & AUTH",
          body: "Workspace, type-safe envs, RBAC, and tenant isolation primitives.",
          owner: "Platform",
          time: "Wk 1 — Wk 3",
          surface: "Control plane",
          track: "Systems",
          level: "foundational",
        },
        {
          title: "CAMPAIGN MODEL",
          body: "Schemas for advertisers, campaigns, line items, and creatives.",
          owner: "Product",
          time: "Wk 3 — Wk 5",
          surface: "Control plane",
          track: "Data",
          level: "intermediate",
        },
      ],
    },
    {
      label: "PHASE 2 — EXECUTION",
      rows: [
        {
          title: "AUCTION CORE",
          body: "Go bidder with Redis hot cache; precomputed targeting & deterministic ranking.",
          owner: "Exchange",
          time: "Wk 5 — Wk 9",
          surface: "Real-time layer",
          track: "RTB",
          level: "advanced",
        },
      ],
    },
    {
      label: "PHASE 3 — TRUST",
      rows: [
        {
          title: "SETTLEMENT ENGINE",
          body: "Append-only ledger, USDC batched payouts, on-chain proofs out of the hot path.",
          owner: "Settlement",
          time: "Wk 10 — Wk 14",
          surface: "Trust layer",
          track: "Ledger",
          level: "advanced",
        },
      ],
    },
  ],
}

export const PRICING: SwissPricingProps = {
  heading: "Tickets & access",
  body: "Choose the cadence that suits your practice. Each tier is shaped with Swiss precision — clear structure, intentional pacing, and room to collaborate with peers across product, exchange, and settlement.",
  tiers: [
    {
      price: "$0",
      unit: "DEV ACCESS",
      name: "EXPLORER",
      body: "Stream the build journal and study the architecture from anywhere.",
      features: [
        "Architecture deep-dives & build notes",
        "Public RFCs and module schemas",
        "Read-only docs and ADR archive",
      ],
      cta: { label: "Join Explorer", href: "/early-access" },
      note: "Registration required for access links",
    },
    {
      price: "$260",
      unit: "PER SEAT",
      name: "STUDIO",
      body: "Focus on the essential surfaces. For independent advertisers and small studios.",
      features: [
        "Sandbox tenants for campaign & creative",
        "Audited bidder & exchange SDKs",
        "Office hours with the platform team",
      ],
      cta: { label: "Buy Studio", href: "/early-access" },
    },
    {
      price: "$520",
      unit: "TWO-PLANE",
      name: "EXCHANGE",
      body: "Immerse your team in the full discourse. Execution and trust, with prioritized review.",
      features: [
        "All exchange and identity flows",
        "Priority slots in the integration lab",
        "Invitation to the settlement salon",
      ],
      cta: { label: "Buy Exchange", href: "/early-access" },
      recommended: true,
      ctaVariant: "dark",
    },
    {
      price: "$1,920",
      unit: "WHOLE TEAM",
      name: "RESIDENCY",
      body: "Bring the whole product team. A multi-week residency along the Vara roadmap.",
      features: [
        "Full-week access to every surface",
        "Private review with platform mentors",
        "Dedicated workspace in the design library",
      ],
      cta: { label: "Plan residency", href: "/early-access" },
      note: "Limited to 6 teams to preserve focus",
    },
  ],
  footnoteLeft: "PRICING IS INDICATIVE — ACCESS IS QUOTED BY TEAM",
  footnoteRight: "NEED GUIDANCE? EMAIL THE VARA TEAM",
}

export const FOOTER: SwissFooterProps = {
  brand: "Vara.",
  brandLogo: { src: "/VaraAds.png", alt: "Varaads", width: 1080, height: 1080 },
  blurb:
    "A centralized crypto ad exchange. Real-time auctions, wallet-native identity, and auditable settlement.",
  meta: "NOV 2025 — Q2 2026 · BUILT IN PUBLIC",
  columns: [
    {
      title: "PROGRAMME",
      links: [
        { label: "Modules", href: "#modules" },
        { label: "Roadmap", href: "#roadmap" },
        { label: "Architecture", href: "#architecture" },
        { label: "Access", href: "/early-access" },
      ],
    },
    {
      title: "ESSENTIALS",
      links: [
        { label: "DSP", href: "/dsp" },
        { label: "SSP", href: "/ssp" },
        { label: "Docs", href: "#docs" },
        { label: "Contact", href: "mailto:hello@vara.exchange" },
      ],
    },
  ],
  legal: {
    copyright: "© 2026 VARA EXCHANGE · HELLO@VARA.EXCHANGE",
    links: [
      { label: "TERMS", href: "#terms" },
      { label: "PRIVACY", href: "#privacy" },
      { label: "CODE OF CONDUCT", href: "#conduct" },
    ],
  },
}
