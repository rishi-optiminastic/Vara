import { PrismaClient, Chain, Vertical, Objective, CampaignStatus, AttrEventType } from "@prisma/client"
import { createHash } from "node:crypto"

const prisma = new PrismaClient()

const SEGMENTS = [
  { slug: "defi-power", name: "DeFi Power Users", description: "Active across 3+ DeFi protocols, monthly TVL >$10k.", chain: null, estSize: 84_300 },
  { slug: "nft-flippers", name: "NFT Flippers", description: "10+ NFT trades in last 90d, avg hold <30 days.", chain: null, estSize: 26_900 },
  { slug: "stable-holders", name: "Stablecoin Holders", description: "Holds USDC/USDT/DAI > $5k, low transaction frequency.", chain: null, estSize: 412_000 },
  { slug: "sol-memecoin", name: "Solana Memecoin Traders", description: "Active on Solana memecoins (BONK, WIF, etc).", chain: Chain.SOLANA, estSize: 58_400 },
  { slug: "ens-owners", name: "ENS Domain Owners", description: "Owns at least one .eth ENS domain.", chain: Chain.ETHEREUM, estSize: 192_000 },
  { slug: "base-natives", name: "Base Natives", description: "First TX on Base, active in last 30d.", chain: Chain.BASE, estSize: 134_500 },
  { slug: "arb-defi", name: "Arbitrum DeFi Users", description: "Active on GMX, Camelot, or Pendle.", chain: Chain.ARBITRUM, estSize: 71_800 },
  { slug: "blue-chip-nft", name: "Blue-chip NFT Holders", description: "Holds BAYC, CryptoPunks, Azuki, or Pudgy Penguins.", chain: Chain.ETHEREUM, estSize: 12_400 },
  { slug: "high-net-worth", name: "High Net-worth Wallets", description: "Portfolio value > $100k.", chain: null, estSize: 38_200 },
  { slug: "early-airdroppers", name: "Early Airdrop Hunters", description: "Claimed 5+ token airdrops in last 6 months.", chain: null, estSize: 145_000 },
  { slug: "l2-bridges", name: "L2 Bridge Users", description: "Bridged from L1 to L2 in last 60d.", chain: null, estSize: 218_000 },
  { slug: "dao-voters", name: "Active DAO Voters", description: "Voted on Snapshot or Tally in last 90d.", chain: null, estSize: 47_500 },
] as const

async function main(): Promise<void> {
  console.log("Seeding wallet segments…")
  for (const s of SEGMENTS) {
    await prisma.walletSegment.upsert({
      where: { slug: s.slug },
      create: { slug: s.slug, name: s.name, description: s.description, chain: s.chain, estSize: s.estSize },
      update: { name: s.name, description: s.description, chain: s.chain, estSize: s.estSize },
    })
  }
  console.log(`Seeded ${SEGMENTS.length} segments.`)

  const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } })
  if (!firstUser) {
    console.log("No user yet — sign up first, then re-run seed for demo campaigns.")
    return
  }

  const advertiser = await prisma.advertiser.upsert({
    where: { userId: firstUser.id },
    create: { userId: firstUser.id, projectName: firstUser.name || "Demo Project", chain: Chain.BASE },
    update: {},
  })

  const existing = await prisma.campaign.count({ where: { advertiserId: advertiser.id } })
  if (existing > 0) {
    console.log(`Advertiser already has ${existing} campaigns — skipping demo seed.`)
    return
  }

  console.log("Seeding demo campaigns…")
  const demos = [
    { name: "$VARA Token Launch", vertical: Vertical.TOKEN_LAUNCH, objective: Objective.AWARENESS, chain: Chain.BASE, budget: 5000, bid: 250 },
    { name: "Genesis NFT Drop", vertical: Vertical.NFT_DROP, objective: Objective.WALLET_CONNECTS, chain: Chain.SOLANA, budget: 3500, bid: 320 },
    { name: "DeFi Vault Awareness", vertical: Vertical.DEFI, objective: Objective.ON_CHAIN_CONVERSION, chain: Chain.ARBITRUM, budget: 2000, bid: 180 },
    { name: "Wallet Retargeting Q4", vertical: Vertical.DAPP_GROWTH, objective: Objective.WALLET_CONNECTS, chain: Chain.ETHEREUM, budget: 1500, bid: 410 },
    { name: "L2 Migration Promo", vertical: Vertical.DAPP_GROWTH, objective: Objective.AWARENESS, chain: Chain.OPTIMISM, budget: 800, bid: 150 },
  ]

  for (const d of demos) {
    const c = await prisma.campaign.create({
      data: {
        advertiserId: advertiser.id,
        name: d.name,
        vertical: d.vertical,
        objective: d.objective,
        status: CampaignStatus.ACTIVE,
        budgetUsdCents: d.budget * 100,
        bidUsdCents: d.bid,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        targeting: { create: { chains: [d.chain], deviceTypes: ["DESKTOP", "MOBILE"], geos: ["US", "GB", "IN"] } },
      },
    })

    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setUTCHours(0, 0, 0, 0)
      date.setUTCDate(date.getUTCDate() - i)
      const base = 800 + Math.random() * 400
      const impressions = Math.floor(base * (50 + Math.random() * 80))
      const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.04))
      const walletConnects = Math.floor(clicks * (0.15 + Math.random() * 0.25))
      const onChainConvs = Math.floor(walletConnects * (0.05 + Math.random() * 0.2))
      const spendUsdCents = Math.floor((impressions / 1000) * d.bid)
      await prisma.metricDaily.create({
        data: { campaignId: c.id, date, impressions, clicks, walletConnects, onChainConvs, spendUsdCents },
      })

      for (let j = 0; j < 3; j++) {
        await prisma.attributionEvent.create({
          data: {
            campaignId: c.id,
            walletHash: createHash("sha256").update(`demo-${c.id}-${i}-${j}`).digest("hex"),
            eventType: j === 0 ? AttrEventType.WALLET_CONNECT : AttrEventType.CLICK,
            chain: d.chain,
            occurredAt: date,
          },
        })
      }
    }
  }

  console.log(`Seeded ${demos.length} demo campaigns with 30 days of metrics.`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
