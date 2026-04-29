import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getOrCreateAdvertiser } from '@/lib/advertiser'
import { OnboardingSubmitSchema } from '@/components/onboarding/types'

export async function POST(req: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)
  if (advertiser.onboardedAt) {
    return NextResponse.json({ error: 'Already onboarded' }, { status: 409 })
  }

  const json = await req.json().catch(() => null)
  const parsed = OnboardingSubmitSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', issues: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const data = parsed.data

  const updated = await prisma.advertiser.update({
    where: { id: advertiser.id },
    data: {
      projectName: data.projectName,
      websiteUrl: data.websiteUrl ?? null,
      contactEmail: data.contactEmail ?? null,
      telegramHandle: data.telegramHandle ?? null,
      discordHandle: data.discordHandle ?? null,
      businessType: data.businessType,
      primaryWalletAddress: data.primaryWalletAddress,
      supportedChains: data.supportedChains,
      chain: data.supportedChains[0] ?? advertiser.chain,
      tokenContracts: (data.tokenContracts as string[]).filter(v => v.length > 0),
      nftContracts: (data.nftContracts as string[]).filter(v => v.length > 0),
      treasuryWallets: (data.treasuryWallets as string[]).filter(v => v.length > 0),
      campaignWallets: (data.campaignWallets as string[]).filter(v => v.length > 0),
      onboardedAt: new Date(),
    },
  })

  return NextResponse.json({ advertiser: updated })
}
