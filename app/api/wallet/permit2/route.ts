import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { recoverTypedDataAddress } from "viem"
import { requireAdvertiser, isAuthError, jsonError } from "@/lib/api"
import { prisma } from "@/lib/prisma"
import { getOrCreateWallet } from "@/lib/wallet"
import { permit2Domain, PERMIT2_TYPES, POLYGON_CHAIN_ID } from "@/lib/permit2"
import { logger } from "@/lib/logger"

const SubmitBody = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  spenderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  authorizedAmount: z.string().regex(/^\d+$/),
  expiration: z.number().int().positive(),
  nonce: z.number().int().min(0),
  sigDeadline: z.string().regex(/^\d+$/),
  signature: z.string().regex(/^0x[a-fA-F0-9]+$/),
  chainId: z.number().int().default(POLYGON_CHAIN_ID),
})

export async function GET(): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx

  const wallet = await getOrCreateWallet(ctx.advertiser.id)
  const auth = await prisma.permit2Authorization.findUnique({
    where: { walletId: wallet.id },
  })

  if (!auth) return NextResponse.json({ status: "none" })

  const now = new Date()
  const expired = auth.expiresAt < now
  const effectiveStatus = expired && auth.status === "ACTIVE" ? "EXPIRED" : auth.status

  return NextResponse.json({
    status: effectiveStatus,
    userWallet: auth.userWallet,
    authorizedAmount: auth.authorizedAmount.toString(),
    amountPulled: auth.amountPulled.toString(),
    expiresAt: auth.expiresAt.toISOString(),
    chainId: auth.chainId,
    createdAt: auth.createdAt.toISOString(),
  })
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ctx = await requireAdvertiser()
    if (isAuthError(ctx)) return ctx

    const parsed = SubmitBody.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422)
    }

    const { walletAddress, tokenAddress, spenderAddress, authorizedAmount,
      expiration, nonce, sigDeadline, signature, chainId } = parsed.data

    // Verify the signature recovers to the claimed wallet address
    const recovered = await recoverTypedDataAddress({
      domain: { ...permit2Domain, chainId },
      types: PERMIT2_TYPES,
      primaryType: "PermitSingle",
      message: {
        details: {
          token: tokenAddress as `0x${string}`,
          amount: BigInt(authorizedAmount),
          expiration,
          nonce,
        },
        spender: spenderAddress as `0x${string}`,
        sigDeadline: BigInt(sigDeadline),
      },
      signature: signature as `0x${string}`,
    })

    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return jsonError("Signature does not match wallet address", 400)
    }

    const wallet = await getOrCreateWallet(ctx.advertiser.id)
    const expiresAt = new Date(expiration * 1000)
    const sigDeadlineDate = new Date(Number(sigDeadline) * 1000)

    const auth = await prisma.permit2Authorization.upsert({
      where: { walletId: wallet.id },
      create: {
        walletId: wallet.id,
        userWallet: walletAddress.toLowerCase(),
        tokenAddress: tokenAddress.toLowerCase(),
        spenderAddress: spenderAddress.toLowerCase(),
        authorizedAmount: BigInt(authorizedAmount),
        expiresAt,
        nonce,
        sigDeadline: sigDeadlineDate,
        signature,
        status: "ACTIVE",
        chainId,
      },
      update: {
        userWallet: walletAddress.toLowerCase(),
        tokenAddress: tokenAddress.toLowerCase(),
        spenderAddress: spenderAddress.toLowerCase(),
        authorizedAmount: BigInt(authorizedAmount),
        expiresAt,
        nonce,
        sigDeadline: sigDeadlineDate,
        signature,
        status: "ACTIVE",
        amountPulled: 0n,
        revokedAt: null,
        revokeReason: null,
        chainId,
      },
    })

    if (!wallet.autoRechargeEnabled) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { autoRechargeEnabled: true },
      })
    }

    return NextResponse.json({
      status: auth.status,
      expiresAt: auth.expiresAt.toISOString(),
    }, { status: 201 })
  } catch (err) {
    logger.error({ err }, "POST /api/wallet/permit2 failed")
    return jsonError(err instanceof Error ? err.message : "Internal error", 500)
  }
}

export async function DELETE(): Promise<NextResponse> {
  const ctx = await requireAdvertiser()
  if (isAuthError(ctx)) return ctx

  const wallet = await getOrCreateWallet(ctx.advertiser.id)
  await prisma.permit2Authorization.updateMany({
    where: { walletId: wallet.id, status: "ACTIVE" },
    data: { status: "REVOKED", revokedAt: new Date(), revokeReason: "user_revoked" },
  })

  return NextResponse.json({ success: true })
}
