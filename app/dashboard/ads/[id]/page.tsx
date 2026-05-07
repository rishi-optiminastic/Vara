import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getCachedSession } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { getOrCreateAdvertiser } from "@/lib/advertiser"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/campaigns/components/StatusBadge"
import { AdActions } from "@/components/ads/components/AdActions"
import { AdPreview } from "@/components/ads/components/AdPreview"
import { ChevronLeftIcon } from "@/icons"
import { FORMAT_DIMS } from "@/lib/creatives"

interface Props { params: Promise<{ id: string }> }

const FORMAT_STYLE: Record<string, string> = {
  BANNER: "bg-[#EAF1FF] text-[#1E40AF]",
  HTML5: "bg-[#F0E8FF] text-[#6D28D9]",
  VIDEO: "bg-[#FFF7E0] text-[#A16207]",
  NATIVE: "bg-[#E8F5E9] text-[#15803D]",
}

export default async function AdDetailPage({ params }: Props): Promise<React.JSX.Element> {
  const { id } = await params
  const session = await getCachedSession()
  if (!session) redirect("/dsp/sign-in")
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)

  const creative = await prisma.creative.findFirst({
    where: { id, campaign: { advertiserId: advertiser.id } },
    include: { campaign: { select: { id: true, name: true, status: true } } },
  })
  if (!creative) notFound()

  const { width, height } = FORMAT_DIMS[creative.format]

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <Link href="/dashboard/ads" className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#37322F] transition-colors">
          <ChevronLeftIcon className="size-3" />Ads
        </Link>
        <div className="flex items-start justify-between gap-3 mt-1.5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none truncate">{creative.name}</h1>
              <span className={`inline-flex items-center rounded-full px-1.5 py-px text-[9px] font-medium uppercase tracking-wider ${FORMAT_STYLE[creative.format]}`}>
                {creative.format.toLowerCase()}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Campaign:{" "}
              <Link href={`/dashboard/campaigns/${creative.campaign.id}`} className="hover:underline text-[#37322F] font-medium">
                {creative.campaign.name}
              </Link>
              {" · "}<StatusBadge status={creative.campaign.status} />
            </p>
          </div>
          <AdActions id={creative.id} />
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Preview</p>
          <AdPreview format={creative.format} assetUrl={creative.assetUrl} name={creative.name} walletConnectCta={creative.walletConnectCta} />
        </div>

        <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
          <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
            <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Details</h3>
          </div>
          <CardContent className="p-3.5 grid grid-cols-2 gap-x-6 gap-y-3">
            <Field label="Format" value={creative.format} />
            <Field label="Dimensions" value={`${width} × ${height} px`} />
            <Field label="Wallet CTA" value={creative.walletConnectCta ? "Yes" : "No"} />
            <Field label="Created" value={dateLabel(creative.createdAt)} />
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Asset URL</div>
              <a href={creative.assetUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#37322F] mt-1 truncate block hover:underline font-mono" title={creative.assetUrl}>
                {creative.assetUrl.length > 60 ? `${creative.assetUrl.slice(0, 58)}…` : creative.assetUrl}
              </a>
            </div>
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Click URL</div>
              <a href={creative.clickUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#37322F] mt-1 truncate block hover:underline font-mono" title={creative.clickUrl}>
                {creative.clickUrl.length > 60 ? `${creative.clickUrl.slice(0, 58)}…` : creative.clickUrl}
              </a>
            </div>
            {creative.walletConnectCta && (
              <div className="col-span-2">
                <Badge variant="outline" className="h-4 px-1.5 text-[9px] bg-[#E8F5E9] text-[#15803D] border-[#15803D]/20">
                  Wallet Connect CTA active
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-xs font-medium text-[#37322F] mt-1 truncate">{value}</div>
    </div>
  )
}

function dateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
