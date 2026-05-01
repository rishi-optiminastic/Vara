import { getCachedSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { AdGroupForm } from "@/components/ad-groups/components/AdGroupForm"

interface Props {
  searchParams: Promise<{ campaign?: string }>
}

export default async function NewAdGroupPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)
  const { campaign: defaultCampaignId = "" } = await searchParams

  const campaigns = await prisma.campaign.findMany({
    where: { advertiserId: advertiser.id },
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-baseline justify-between border-b border-[rgba(55,50,47,0.12)] pb-2 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">New </span>
          Ad Group
        </h1>
        <p className="text-[10px] text-muted-foreground">Basics → Settings</p>
      </div>
      <AdGroupForm campaigns={campaigns} defaultCampaignId={defaultCampaignId} />
    </div>
  )
}
