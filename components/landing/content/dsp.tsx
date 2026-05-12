import type { SwissNavProps } from "@/components/landing/SwissNav"
import type { SwissHeroProps } from "@/components/landing/SwissHero"
import type { SwissSummitProps } from "@/components/landing/SwissSummit"
import type { SwissHighlightsProps } from "@/components/landing/SwissHighlights"
import type { SwissModulesProps } from "@/components/landing/SwissModules"
import type { SwissPricingProps } from "@/components/landing/SwissPricing"
import type { SwissFooterProps } from "@/components/landing/SwissFooter"

export const NAV: SwissNavProps = {
  brand: { label: "VARA · DSP", href: "/dsp" },
  brandLogo: { src: "/VaraAd.png", alt: "Vara DSP", width: 1080, height: 1080 },
  items: [
    { label: "OVERVIEW", href: "#overview" },
    { label: "BIDDING", href: "#bidding" },
    { label: "TARGETING", href: "#targeting" },
    { label: "BUDGETS", href: "#budgets" },
    { label: "REPORTING", href: "#reporting" },
    { label: "MAIN SITE", href: "/" },
    { label: "SSP", href: "/ssp" },
    { label: "DOCS", href: "#docs" },
  ],
  cta: { label: "SIGN IN", href: "/dsp/sign-in" },
}

export const HERO: SwissHeroProps = {
  eyebrow: "DEMAND-SIDE · BUYER CONSOLE",
  title: (
    <>
      Spend with precision,
      <br />
      settle with proof
    </>
  ),
  body: "The Vara DSP gives buyers a real-time bidder, deterministic targeting, and on-chain payout receipts — without sacrificing the speed of a centralized exchange.",
  primaryCta: { label: "Create account", href: "/dsp/sign-up" },
  secondaryCta: { label: "Sign in", href: "/dsp/sign-in" },
  meta: "USDC SETTLEMENT · SUB-100MS BIDS · WALLET ATTRIBUTION",
}

export const SUMMIT: SwissSummitProps = {
  heading: "A buyer console built for the bid window",
  pillars: [
    { title: "Deterministic bidder", sub: "Precomputed targeting" },
    { title: "Wallet attribution", sub: "Conversion mapping" },
    { title: "Auditable spend", sub: "Per-line ledger receipts" },
  ],
  watermark: "DSP",
  stats: [
    {
      number: "1",
      label: "Bidder",
      body: "Go-based bidding service co-located with the exchange. Hot Redis cache for line items, creatives, and frequency caps.",
      link: { label: "How it bids", href: "#bidding" },
    },
    {
      number: "2",
      label: "Targeting",
      body: "Audience graph, wallet signals, geo, device, and contextual segments — composable per line item.",
      link: { label: "Targeting model", href: "#targeting" },
    },
    {
      number: "3",
      label: "Receipts",
      body: "Every winning bid emits an event to the append-only ledger; payouts settle in USDC against your treasury account.",
      link: { label: "Settlement", href: "#reporting" },
    },
  ],
}

export const HIGHLIGHTS: SwissHighlightsProps = {
  eyebrow: "CONSOLE PREVIEW",
  heading: "What you ship from the DSP",
  body: "A focused console for advertisers: campaign hierarchy, deterministic delivery, transparent spend, and one source of truth for every dollar.",
  badge: "ALL SURFACES",
  items: [
    { title: "Campaigns", caption: "PLANNING", swatch: "primary" },
    { title: "Line items", caption: "DELIVERY", swatch: "muted" },
    { title: "Audiences", caption: "TARGETING", swatch: "dark" },
    { title: "Reports", caption: "OUTCOMES", swatch: "primary" },
  ],
}

export const MODULES: SwissModulesProps = {
  eyebrow: "BUYER WORKFLOWS",
  heading: "Surfaces in the DSP",
  body: "From plan to proof, the DSP is built around the everyday moves a buyer makes — and the receipts they keep.",
  modules: [
    {
      eyebrow: "Plan, structure, brief",
      title: "CAMPAIGNS",
      body: "Hierarchy from advertiser to creative, with line-item pacing, flighting, and budget guards.",
      location: "PLANNING SURFACE",
      tags: ["Hierarchy", "Pacing", "Budgets"],
    },
    {
      eyebrow: "Audience, geo, context",
      title: "TARGETING",
      body: "Compose wallet, contextual, and device signals into reusable audiences with deterministic match.",
      location: "TARGETING SURFACE",
      tags: ["Audiences", "Signals", "Match"],
    },
    {
      eyebrow: "Auctions in flight",
      title: "BIDDER",
      body: "Live latency, win rate, and bid landscape per line item. Tune the curves without leaving the page.",
      location: "DELIVERY SURFACE",
      tags: ["Latency", "Win rate", "Curves"],
      variant: "dark",
    },
    {
      eyebrow: "Outcomes & receipts",
      title: "REPORTING",
      body: "Per-line attribution, wallet-level conversions, and a ledger view of every settled spend.",
      location: "OUTCOMES SURFACE",
      tags: ["Attribution", "Receipts", "Exports"],
    },
  ],
}

export const PRICING: SwissPricingProps = {
  heading: "DSP plans",
  body: "Self-serve buying with treasury-grade reporting. Pricing scales with monthly working media, not seat counts.",
  tiers: [
    {
      price: "$0",
      unit: "SANDBOX",
      name: "EXPLORER",
      body: "Spin up a sandbox tenant. Run synthetic auctions and inspect the receipts they emit.",
      features: ["Sandbox campaigns & creatives", "Synthetic bid stream", "Read-only ledger view"],
      cta: { label: "Start sandbox", href: "/dsp/sign-up" },
    },
    {
      price: "2.5%",
      unit: "OF WORKING MEDIA",
      name: "STUDIO",
      body: "For independent buyers and small studios moving real spend through the exchange.",
      features: ["Live bidder with caps", "Wallet attribution", "USDC settlement to one wallet"],
      cta: { label: "Buy Studio", href: "/dsp/sign-up" },
    },
    {
      price: "1.5%",
      unit: "OF WORKING MEDIA",
      name: "AGENCY",
      body: "For multi-advertiser desks. Tenant scoping, role separation, and audit exports.",
      features: ["Multi-advertiser tenants", "Role-based access", "Audit-ready exports"],
      cta: { label: "Buy Agency", href: "/dsp/sign-up" },
      recommended: true,
      ctaVariant: "dark",
    },
    {
      price: "Custom",
      unit: "ENTERPRISE",
      name: "TREASURY",
      body: "For brands with finance-grade reporting needs. Custom settlement and reserved capacity.",
      features: ["Reserved bidder capacity", "Custom settlement schedule", "Dedicated success engineer"],
      cta: { label: "Plan treasury", href: "mailto:dsp@vara.exchange" },
      note: "Quotes shaped per program",
    },
  ],
  footnoteLeft: "FEES SETTLE NIGHTLY IN USDC",
  footnoteRight: "EMAIL DSP@VARA.EXCHANGE FOR A WALKTHROUGH",
}

export const FOOTER: SwissFooterProps = {
  brand: "Vara · DSP",
  brandLogo: { src: "/VaraAds.png", alt: "Varaads", width: 1080, height: 1080 },
  blurb:
    "Demand-side console for the Vara exchange. Buy with precision, settle in USDC, and keep a receipt for every dollar.",
  meta: "DSP CONSOLE · LIVE 2026",
  columns: [
    {
      title: "BUY",
      links: [
        { label: "Campaigns", href: "#campaigns" },
        { label: "Targeting", href: "#targeting" },
        { label: "Bidder", href: "#bidding" },
        { label: "Reporting", href: "#reporting" },
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        { label: "Sign in", href: "/dsp/sign-in" },
        { label: "Sign up", href: "/dsp/sign-up" },
        { label: "Docs", href: "#docs" },
        { label: "Contact", href: "mailto:dsp@vara.exchange" },
      ],
    },
  ],
  legal: {
    copyright: "© 2026 VARA EXCHANGE · DSP@VARA.EXCHANGE",
    links: [
      { label: "TERMS", href: "#terms" },
      { label: "PRIVACY", href: "#privacy" },
      { label: "SETTLEMENT", href: "#settlement" },
    ],
  },
  newsletterHeading: "Get the buyer brief",
  newsletterBody:
    "Monthly notes on the bidder, targeting, and settlement — written for advertisers.",
}
