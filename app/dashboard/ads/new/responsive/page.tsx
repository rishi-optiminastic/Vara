import Link from "next/link"
import { redirect } from "next/navigation"

import { getCachedSession } from "@/lib/session"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { ChevronLeftIcon, ImageSparkleIcon } from "@/icons"
import { NewAdFlow } from "@/components/ads/NewAdFlow"

interface PageProps {
  searchParams: Promise<{ campaign?: string }>
}

export default async function NewResponsiveAdPage({
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  // Bootstrap advertiser for fresh accounts so the picker can find their groups.
  await getOrCreateAdvertiser(session.user.id, session.user.name)
  const { campaign } = await searchParams

  return (
    <div className="relative min-h-full">
      <div aria-hidden className="pointer-events-none absolute inset-0 flex">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-l border-dashed border-[rgba(10,10,10,0.08)] first:border-l-0 last:border-r"
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-3 p-3">
        <Link
          href={campaign ? `/dashboard/ads?campaign=${campaign}` : "/dashboard/ads"}
          className="flex w-fit items-center gap-1 text-[11px] text-muted-foreground hover:text-[#0A0A0A]"
        >
          <ChevronLeftIcon className="size-3" />
          Back to ads
        </Link>
        <div className="flex items-start justify-between gap-3 border-b border-[rgba(10,10,10,0.12)] pb-2.5 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
          <div className="flex items-start gap-2">
            <span className="mt-1 flex size-6 items-center justify-center rounded-md bg-[#ECEAE2] text-[#1F40CD]">
              <ImageSparkleIcon className="size-3.5" />
            </span>
            <div className="flex flex-col leading-tight">
              <h1 className="text-[22px] font-medium tracking-[-0.02em] text-[#0A0A0A]">
                <span className="font-instrument-serif italic font-normal text-[26px]">New </span>
                Responsive Ad
              </h1>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Upload several images and headlines — we&apos;ll mix them at serve time to fit each placement.
              </p>
            </div>
          </div>
          <span className="hidden shrink-0 rounded-full border border-[rgba(10,10,10,0.12)] bg-white px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-widest text-muted-foreground md:inline-block">
            Multi-format · v1
          </span>
        </div>
        <NewAdFlow {...(campaign !== undefined && { campaignId: campaign })} />
      </div>
    </div>
  )
}
