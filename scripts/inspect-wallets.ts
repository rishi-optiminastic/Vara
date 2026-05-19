// One-off diagnostic: dump all advertisers, wallets, deposits — independent
// of which user they're attached to, so orphaned rows show up.
//
//   pnpm exec dotenv -e .env.local -- tsx scripts/inspect-wallets.ts
// or
//   set -a && source .env.local && set +a && npx tsx scripts/inspect-wallets.ts

import { prisma } from "@/lib/prisma"

async function main(): Promise<void> {
  const users = await prisma.user.findMany({
    select: { id: true, email: true },
    orderBy: { createdAt: "asc" },
  })
  // eslint-disable-next-line no-console
  console.log("\n=== USERS ===")
  // eslint-disable-next-line no-console
  console.table(users.map((u) => ({ id: u.id, email: u.email })))

  const advertisers = await prisma.advertiser.findMany({
    select: { id: true, userId: true, projectName: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })
  const userById = new Map(users.map((u) => [u.id, u.email]))
  // eslint-disable-next-line no-console
  console.log("\n=== ADVERTISERS ===")
  // eslint-disable-next-line no-console
  console.table(
    advertisers.map((a) => ({
      id: a.id,
      userId: a.userId,
      userEmail: userById.get(a.userId) ?? "(orphan — user deleted)",
      projectName: a.projectName,
    })),
  )

  const wallets = await prisma.wallet.findMany({
    select: {
      id: true,
      advertiserId: true,
      balanceUsdcCents: true,
      totalDepositedUsdcCents: true,
    },
  })
  const advById = new Map(advertisers.map((a) => [a.id, a]))
  // eslint-disable-next-line no-console
  console.log("\n=== WALLETS ===")
  // eslint-disable-next-line no-console
  console.table(
    wallets.map((w) => ({
      walletId: w.id,
      advertiserId: w.advertiserId,
      advertiserOwnerEmail:
        advById.get(w.advertiserId)
          ? userById.get(advById.get(w.advertiserId)!.userId) ?? "(orphan adv)"
          : "(no advertiser row)",
      balanceUsdc: (w.balanceUsdcCents / 100).toFixed(2),
      totalDepositedUsdc: (w.totalDepositedUsdcCents / 100).toFixed(2),
    })),
  )

  const deposits = await prisma.deposit.findMany({
    select: {
      id: true,
      walletId: true,
      amountUsdcCents: true,
      txHash: true,
      confirmedAt: true,
    },
    orderBy: { confirmedAt: "asc" },
  })
  // eslint-disable-next-line no-console
  console.log("\n=== DEPOSITS ===")
  // eslint-disable-next-line no-console
  console.table(
    deposits.map((d) => ({
      id: d.id.slice(0, 12),
      walletId: d.walletId,
      amountUsdc: (d.amountUsdcCents / 100).toFixed(2),
      txHash: `${d.txHash.slice(0, 10)}…${d.txHash.slice(-6)}`,
      confirmedAt: d.confirmedAt?.toISOString() ?? "—",
    })),
  )
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
