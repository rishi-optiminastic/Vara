// Cleanup: nuke every advertiser (and dependent wallet/deposit/campaign/etc.)
// for a given user email, so the next sign-in creates a single fresh row.
// Used to recover from a state with duplicate advertiser records.
//
//   set -a && source .env.local && set +a && npx tsx scripts/wipe-my-advertisers.ts tech1@optiminastic.com

import { prisma } from "@/lib/prisma"

async function main(): Promise<void> {
  const email = process.argv[2]
  if (!email) throw new Error("Usage: wipe-my-advertisers.ts <email>")

  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) throw new Error(`No user with email ${email}`)

  const advertisers = await prisma.advertiser.findMany({
    where: { userId: user.id },
    include: {
      wallet: { include: { deposits: true, transactions: true } },
      campaigns: true,
    },
  })

  if (advertisers.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`No advertisers for ${email} — nothing to do.`)
    return
  }

  // eslint-disable-next-line no-console
  console.log(`\nFound ${advertisers.length} advertiser(s) for ${email}:`)
  for (const a of advertisers) {
    // eslint-disable-next-line no-console
    console.log(
      `  ${a.id}  project="${a.projectName}"  campaigns=${a.campaigns.length}  ` +
        `wallet=${a.wallet ? `$${(a.wallet.balanceUsdcCents / 100).toFixed(2)} (${a.wallet.deposits.length} deposits)` : "none"}`,
    )
  }

  // eslint-disable-next-line no-console
  console.log("\nDeleting in dependency order…")
  for (const a of advertisers) {
    if (a.wallet) {
      await prisma.deposit.deleteMany({ where: { walletId: a.wallet.id } })
      await prisma.walletTransaction.deleteMany({ where: { walletId: a.wallet.id } })
      await prisma.wallet.delete({ where: { id: a.wallet.id } })
      // eslint-disable-next-line no-console
      console.log(`  ✓ wallet ${a.wallet.id} + dependents deleted`)
    }
    if (a.campaigns.length > 0) {
      await prisma.campaign.deleteMany({ where: { advertiserId: a.id } })
      // eslint-disable-next-line no-console
      console.log(`  ✓ ${a.campaigns.length} campaigns deleted`)
    }
    await prisma.advertiser.delete({ where: { id: a.id } })
    // eslint-disable-next-line no-console
    console.log(`  ✓ advertiser ${a.id} deleted`)
  }

  // eslint-disable-next-line no-console
  console.log("\nDone. Sign in again — a fresh advertiser will be auto-created.")
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
