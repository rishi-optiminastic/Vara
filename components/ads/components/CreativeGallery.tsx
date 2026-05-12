import Link from "next/link"
import type { Creative } from "@prisma/client"
import { AdPreview } from "@/components/ads/components/AdPreview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ImageSparkleIcon, BoxPlusIcon } from "@/icons"

interface Props {
  creatives: Pick<Creative, "id" | "name" | "format" | "assetUrl" | "walletConnectCta" | "width" | "height">[]
  newAdHref: string
  emptyTitle?: string
}

export function CreativeGallery({ creatives, newAdHref, emptyTitle = "No ads yet" }: Props): React.JSX.Element {
  if (creatives.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[rgba(55,50,47,0.18)] bg-white/50 p-10 text-center">
        <div className="mx-auto mb-3 flex size-9 items-center justify-center rounded-full bg-[#F0ECE6]">
          <ImageSparkleIcon className="size-4 text-muted-foreground" />
        </div>
        <p className="text-xs font-medium text-[#37322F]">{emptyTitle}</p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Upload a creative to start serving impressions.
        </p>
        <Button asChild size="sm" className="mt-4 h-8 gap-1.5 text-xs rounded-full px-4 bg-[#37322F] text-[#FAFAF8] hover:bg-[#2A2520]">
          <Link href={newAdHref}>
            <BoxPlusIcon className="size-3" />New Ad
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
      {creatives.map((cr) => (
        <Link
          key={cr.id}
          href={`/dashboard/ads/${cr.id}`}
          className="group block rounded-lg border border-[rgba(55,50,47,0.12)] bg-white p-2 transition-all hover:border-[rgba(55,50,47,0.32)] hover:shadow-[0_4px_12px_-6px_rgba(55,50,47,0.18)]"
        >
          <div className="overflow-hidden rounded-md">
            <AdPreview
              format={cr.format}
              assetUrl={cr.assetUrl}
              name={cr.name}
              walletConnectCta={cr.walletConnectCta}
              compact
            />
          </div>
          <div className="mt-2 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[#37322F] truncate group-hover:underline underline-offset-2">
                {cr.name}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground tabular-nums">
                {cr.width}×{cr.height}
              </div>
            </div>
            <Badge
              variant="outline"
              className="h-4 px-1.5 text-[9px] uppercase tracking-wider bg-white/60 border-[rgba(55,50,47,0.16)] text-[#37322F] shrink-0"
            >
              {cr.format.toLowerCase()}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  )
}
