import type { SwissNavProps } from "@/components/landing/SwissNav"
import type { SwissHeroProps } from "@/components/landing/SwissHero"
import type { SwissSummitProps } from "@/components/landing/SwissSummit"
import type { SwissHighlightsProps } from "@/components/landing/SwissHighlights"
import type { SwissModulesProps } from "@/components/landing/SwissModules"
import type { SwissPricingProps } from "@/components/landing/SwissPricing"
import type { SwissFooterProps } from "@/components/landing/SwissFooter"

export const NAV: SwissNavProps = {
  brand: { label: "VARA · SSP", href: "/ssp" },
  brandLogo: { src: "/VaraAd.png", alt: "Vara SSP", width: 1080, height: 1080 },
  items: [
    { label: "OVERVIEW", href: "#overview" },
    { label: "INVENTORY", href: "#inventory" },
    { label: "FLOORS", href: "#floors" },
    { label: "PAYOUTS", href: "#payouts" },
    { label: "TRUST", href: "#trust" },
    { label: "MAIN SITE", href: "/" },
    { label: "DSP", href: "/dsp" },
    { label: "DOCS", href: "#docs" },
  ],
  cta: { label: "SIGN IN", href: "/ssp/sign-in" },
}

export const HERO: SwissHeroProps = {
  eyebrow: "SUPPLY-SIDE · PUBLISHER CONSOLE",
  title: (
    <>
      Sell inventory,
      <br />
      keep the proof
    </>
  ),
  body: "The Vara SSP gives publishers a transparent auction surface, programmable floors, and wallet-native payouts — with a ledger receipt for every win.",
  primaryCta: { label: "Create account", href: "/ssp/sign-up" },
  secondaryCta: { label: "Sign in", href: "/ssp/sign-in" },
  meta: "",
}

export const SUMMIT: SwissSummitProps = {
  heading: "A publisher console built for trust",
  pillars: [
    { title: "Programmable floors", sub: "Per-format & per-bidder" },
    { title: "Fraud-scored demand", sub: "Trust-weighted auctions" },
    { title: "On-chain payouts", sub: "Receipted in USDC" },
  ],
  watermark: "SSP",
  stats: [
    {
      number: "1",
      label: "Inventory",
      body: "Sites, placements, and formats with deterministic IDs. Floors and pacing tracked at every level.",
      link: { label: "Inventory model", href: "#inventory" },
    },
    {
      number: "2",
      label: "Auctions",
      body: "Demand is trust-scored before it bids. Floors and frequency caps are enforced in the bidder path.",
      link: { label: "Auction model", href: "#floors" },
    },
    {
      number: "3",
      label: "Payouts",
      body: "Settled nightly in USDC against your wallet. Every payout carries a receipt against the ledger.",
      link: { label: "Payouts", href: "#payouts" },
    },
  ],
}

export const HIGHLIGHTS: SwissHighlightsProps = {
  eyebrow: "CONSOLE PREVIEW",
  heading: "What you ship from the SSP",
  body: "A publisher console for the work that actually pays: managing inventory, tuning floors, and getting paid against an auditable trail.",
  badge: "ALL SURFACES",
  items: [
    { title: "Inventory", caption: "PLACEMENTS", swatch: "muted" },
    { title: "Floors", caption: "AUCTIONS", swatch: "primary" },
    { title: "Payouts", caption: "TREASURY", swatch: "dark" },
    { title: "Trust", caption: "REPUTATION", swatch: "primary" },
  ],
}

export const MODULES: SwissModulesProps = {
  eyebrow: "PUBLISHER WORKFLOWS",
  heading: "Surfaces in the SSP",
  body: "Every screen is paired to a publisher motion — from listing inventory to clearing payouts and protecting reputation.",
  modules: [
    {
      eyebrow: "Sites, placements, formats",
      title: "INVENTORY",
      body: "Model your network as deterministic placements and formats. Floors and pacing scoped to each node.",
      location: "PLANNING SURFACE",
      tags: ["Placements", "Formats", "Pacing"],
    },
    {
      eyebrow: "Floors & curves",
      title: "FLOORS",
      body: "Programmable floors per format and per buyer trust band. Tune curves without leaving the screen.",
      location: "AUCTION SURFACE",
      tags: ["Floors", "Curves", "Trust"],
    },
    {
      eyebrow: "USDC receipts",
      title: "PAYOUTS",
      body: "Nightly batches settle to your wallet. Every payout maps back to the winning bids on the ledger.",
      location: "TREASURY SURFACE",
      tags: ["Batches", "Wallets", "Ledger"],
      variant: "dark",
    },
    {
      eyebrow: "Score & defend",
      title: "TRUST",
      body: "Reputation signals for sites and placements. Block bad demand and protect your floors before they get bid.",
      location: "REPUTATION SURFACE",
      tags: ["Scoring", "Blocks", "Audit"],
    },
  ],
}

export const PRICING: SwissPricingProps = {
  heading: "SSP plans",
  body: "Self-serve listing with treasury-grade receipts. Pricing scales with monthly cleared revenue.",
  tiers: [
    {
      price: "$0",
      unit: "SANDBOX",
      name: "EXPLORER",
      body: "List placements in a sandbox. Inspect floors, the receipts, and the trust signals against synthetic demand.",
      features: ["Sandbox placements", "Synthetic demand", "Read-only payout view"],
      cta: { label: "Start sandbox", href: "/ssp/sign-up" },
    },
    {
      price: "3%",
      unit: "OF CLEARED REVENUE",
      name: "STUDIO",
      body: "For independent publishers and creators clearing real revenue.",
      features: ["Live floors & pacing", "Nightly USDC payouts", "One wallet destination"],
      cta: { label: "Buy Studio", href: "/ssp/sign-up" },
    },
    {
      price: "2%",
      unit: "OF CLEARED REVENUE",
      name: "NETWORK",
      body: "For multi-site networks. Tenant scoping, role separation, and per-site payouts.",
      features: ["Multi-site tenants", "Per-site wallets", "Audit-ready exports"],
      cta: { label: "Buy Network", href: "/ssp/sign-up" },
      recommended: true,
      ctaVariant: "dark",
    },
    {
      price: "Custom",
      unit: "ENTERPRISE",
      name: "TREASURY",
      body: "For publishers with finance-grade reporting needs. Custom settlement and reserved capacity.",
      features: ["Reserved auction capacity", "Custom settlement schedule", "Dedicated success engineer"],
      cta: { label: "Plan treasury", href: "mailto:ssp@vara.exchange" },
      note: "Quotes shaped per program",
    },
  ],
  footnoteLeft: "PAYOUTS SETTLE NIGHTLY IN USDC",
  footnoteRight: "EMAIL SSP@VARA.EXCHANGE FOR A WALKTHROUGH",
}

export const FOOTER: SwissFooterProps = {
  brand: "Vara · SSP",
  brandLogo: { src: "/VaraAds.png", alt: "Varaads", width: 1080, height: 1080 },
  blurb:
    "Supply-side console for the Vara exchange. List inventory, set programmable floors, and get paid in USDC against an auditable trail.",
  meta: "SSP CONSOLE · LIVE 2026",
  columns: [
    {
      title: "SELL",
      links: [
        { label: "Inventory", href: "#inventory" },
        { label: "Floors", href: "#floors" },
        { label: "Payouts", href: "#payouts" },
        { label: "Trust", href: "#trust" },
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        { label: "Sign in", href: "/ssp/sign-in" },
        { label: "Sign up", href: "/ssp/sign-up" },
        { label: "Docs", href: "#docs" },
        { label: "Contact", href: "mailto:ssp@vara.exchange" },
      ],
    },
  ],
  legal: {
    copyright: "© 2026 VARA EXCHANGE · SSP@VARA.EXCHANGE",
    links: [
      { label: "TERMS", href: "#terms" },
      { label: "PRIVACY", href: "#privacy" },
      { label: "SETTLEMENT", href: "#settlement" },
    ],
  },
  newsletterHeading: "Get the publisher brief",
  newsletterBody:
    "Monthly notes on floors, trust scoring, and settlement — written for publishers.",
}
