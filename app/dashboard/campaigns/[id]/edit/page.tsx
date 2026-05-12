import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { CampaignEditForm } from "@/components/campaigns/components/CampaignEditForm"
import { ChevronLeftIcon } from "@/icons"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignEditPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const campaign = await prisma.campaign.findFirst({
    where: { id, advertiserId: advertiser.id },
  })
  if (!campaign) notFound()

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <Link
          href={`/dashboard/campaigns/${campaign.id}`}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#37322F] transition-colors"
        >
          <ChevronLeftIcon className="size-3" />
          {campaign.name}
        </Link>
        <div className="mt-1.5">
          <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
            Edit campaign
          </h1>
          <p className="text-[11px] text-muted-foreground mt-1.5">
            Update basics, budget, schedule, and brand safety. Status changes will reserve or
            release escrow against your wallet.
          </p>
        </div>
      </div>

      <CampaignEditForm
        campaign={campaign}
        reservedUsdcCents={campaign.reservedUsdcCents}
      />
    </div>
  )
}
