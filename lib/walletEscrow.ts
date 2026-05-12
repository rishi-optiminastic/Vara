import type { Prisma, PrismaClient } from "@prisma/client"
import { prisma } from "@/lib/prisma"

type Tx = Prisma.TransactionClient | PrismaClient

export class InsufficientFundsError extends Error {
  constructor(
    public required: number,
    public available: number,
  ) {
    super(`Insufficient funds: need ${required}, available ${available}`)
    this.name = "InsufficientFundsError"
  }
}

export class OverChargeError extends Error {
  constructor(
    public requested: number,
    public reservedRemaining: number,
  ) {
    super(`Charge ${requested} exceeds remaining reservation ${reservedRemaining}`)
    this.name = "OverChargeError"
  }
}

export interface WalletSnapshot {
  balanceUsdcCents: number
  reservedUsdcCents: number
  availableUsdcCents: number
}

export async function getWalletSnapshot(advertiserId: string): Promise<WalletSnapshot> {
  const wallet = await prisma.wallet.findUnique({ where: { advertiserId } })
  if (!wallet) return { balanceUsdcCents: 0, reservedUsdcCents: 0, availableUsdcCents: 0 }
  return {
    balanceUsdcCents: wallet.balanceUsdcCents,
    reservedUsdcCents: wallet.reservedUsdcCents,
    availableUsdcCents: wallet.balanceUsdcCents - wallet.reservedUsdcCents,
  }
}

/**
 * Authoritative reconciler: snaps `wallet.reservedUsdcCents` and every
 * campaign's `reservedUsdcCents` to the truth derived from each campaign's
 * status, budget, and accumulated spend.
 *
 *  - ACTIVE campaigns reserve `max(0, budget - spent)`.
 *  - Non-ACTIVE campaigns reserve 0.
 *  - Wallet reservation = sum of campaign reservations.
 *
 * Safe to run on every wallet read — it short-circuits when state already
 * matches truth, and never refuses to write even if the result leaves the
 * advertiser overcommitted (we'd rather surface that than hide it).
 */
export async function reconcileAdvertiserReservations(
  advertiserId: string,
): Promise<void> {
  await prisma.$transaction(async (db) => {
    const wallet = await db.wallet.findUnique({ where: { advertiserId } })
    if (!wallet) return
    const campaigns = await db.campaign.findMany({
      where: { advertiserId },
      select: {
        id: true,
        status: true,
        budgetUsdCents: true,
        spentUsdcCents: true,
        reservedUsdcCents: true,
      },
    })

    let totalReserved = 0
    for (const c of campaigns) {
      const truth = c.status === "ACTIVE" ? Math.max(0, c.budgetUsdCents - c.spentUsdcCents) : 0
      totalReserved += truth
      if (c.reservedUsdcCents !== truth) {
        await db.campaign.update({
          where: { id: c.id },
          data: { reservedUsdcCents: truth },
        })
      }
    }

    if (wallet.reservedUsdcCents !== totalReserved) {
      await db.wallet.update({
        where: { id: wallet.id },
        data: { reservedUsdcCents: totalReserved },
      })
    }
  })
}

/**
 * Reserve `campaign.budgetUsdCents` from the advertiser's wallet for the given
 * campaign. Throws InsufficientFundsError if the available balance is too low.
 * Idempotent — if the campaign already has a reservation, returns without
 * changes.
 */
export async function reserveForCampaign(campaignId: string): Promise<void> {
  await prisma.$transaction(async (db) => {
    const campaign = await db.campaign.findUniqueOrThrow({
      where: { id: campaignId },
      select: {
        id: true,
        advertiserId: true,
        budgetUsdCents: true,
        reservedUsdcCents: true,
        spentUsdcCents: true,
        name: true,
      },
    })
    if (campaign.reservedUsdcCents > 0) return

    const target = Math.max(0, campaign.budgetUsdCents - campaign.spentUsdcCents)
    if (target === 0) return

    const wallet = await db.wallet.findUniqueOrThrow({
      where: { advertiserId: campaign.advertiserId },
    })
    const available = wallet.balanceUsdcCents - wallet.reservedUsdcCents
    if (available < target) throw new InsufficientFundsError(target, available)

    await db.wallet.update({
      where: { id: wallet.id },
      data: { reservedUsdcCents: { increment: target } },
    })
    await db.campaign.update({
      where: { id: campaign.id },
      data: { reservedUsdcCents: target },
    })
  })
}

/**
 * Release the remaining reservation (budget − spent) for a campaign back to
 * the wallet's available balance. Safe to call on already-released campaigns.
 */
export async function releaseFromCampaign(campaignId: string): Promise<void> {
  await prisma.$transaction(async (db) => {
    const campaign = await db.campaign.findUniqueOrThrow({
      where: { id: campaignId },
      select: { id: true, advertiserId: true, reservedUsdcCents: true },
    })
    if (campaign.reservedUsdcCents <= 0) return

    const wallet = await db.wallet.findUniqueOrThrow({
      where: { advertiserId: campaign.advertiserId },
    })
    await db.wallet.update({
      where: { id: wallet.id },
      data: { reservedUsdcCents: { decrement: campaign.reservedUsdcCents } },
    })
    await db.campaign.update({
      where: { id: campaign.id },
      data: { reservedUsdcCents: 0 },
    })
  })
}

/**
 * Debit `cents` from a campaign's reservation as ad spend. Emits an AD_SPEND
 * WalletTransaction. Throws OverChargeError if the charge exceeds what's
 * still reserved for this campaign.
 */
export async function chargeCampaignSpend(
  campaignId: string,
  cents: number,
  source = "rtb",
): Promise<void> {
  if (cents <= 0) return
  await prisma.$transaction(async (db: Tx) => {
    const campaign = await db.campaign.findUniqueOrThrow({
      where: { id: campaignId },
      select: { id: true, advertiserId: true, reservedUsdcCents: true, name: true },
    })
    if (campaign.reservedUsdcCents < cents) {
      throw new OverChargeError(cents, campaign.reservedUsdcCents)
    }
    const wallet = await db.wallet.findUniqueOrThrow({
      where: { advertiserId: campaign.advertiserId },
    })
    await db.wallet.update({
      where: { id: wallet.id },
      data: {
        balanceUsdcCents: { decrement: cents },
        reservedUsdcCents: { decrement: cents },
        totalSpentUsdcCents: { increment: cents },
      },
    })
    await db.campaign.update({
      where: { id: campaign.id },
      data: {
        spentUsdcCents: { increment: cents },
        reservedUsdcCents: { decrement: cents },
      },
    })
    await db.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "AD_SPEND",
        status: "COMPLETED",
        amountUsdcCents: -cents,
        description: `Spend · ${campaign.name}`,
        source: `${source}:${campaign.id}`,
      },
    })
  })
}
