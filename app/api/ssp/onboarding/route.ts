import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { ensureStarterPlacement, getOrCreatePublisher } from '@/lib/publisher'
import { getOrCreatePublisherWallet } from '@/lib/publisherWallet'
import {
  SspOnboardingSubmitSchema,
  type SspOnboardingSubmitInput,
} from '@/components/ssp/onboarding/types'

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json(
        { error: 'Not signed in — refresh the page and sign in again.' },
        { status: 401 },
      )
    }

    const json = await req.json().catch(() => null)
    const parsed = SspOnboardingSubmitSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      )
    }
    const data: SspOnboardingSubmitInput = parsed.data

    const publisher = await getOrCreatePublisher(session.user.id, session.user.name)
    const wallet = await getOrCreatePublisherWallet(publisher.id)

    const [updatedPublisher, updatedWallet] = await prisma.$transaction([
      prisma.publisher.update({
        where: { id: publisher.id },
        data: {
          siteName: data.siteName.trim(),
          primaryUrl: data.primaryUrl.trim(),
          category: data.inventoryCategory,
        },
      }),
      prisma.publisherWallet.update({
        where: { id: wallet.id },
        data: {
          payoutAddress: data.payoutWalletAddress.trim(),
          payoutChain: data.payoutChain,
        },
      }),
    ])

    const placement = await ensureStarterPlacement({
      publisherId: publisher.id,
      siteName: data.siteName,
      adFormats: data.adFormats,
      audienceChains: data.audienceChains,
    })

    return NextResponse.json({
      publisher: updatedPublisher,
      wallet: updatedWallet,
      placement,
    })
  } catch (err) {
    logger.error({ err }, 'SSP onboarding submit failed')
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }
}
