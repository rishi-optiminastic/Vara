import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

const SKELETON = "bg-[rgba(55,50,47,0.06)]"

export default function CampaignsLoading(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between gap-2 border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div className="space-y-2">
          <Skeleton className={`h-6 w-40 ${SKELETON}`} />
          <Skeleton className={`h-3 w-20 ${SKELETON}`} />
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Skeleton className={`h-8 w-40 rounded-full ${SKELETON}`} />
          <Skeleton className={`h-8 w-40 rounded-full ${SKELETON}`} />
          <Skeleton className={`h-8 w-40 rounded-full ${SKELETON}`} />
          <Skeleton className={`h-8 w-40 rounded-full ${SKELETON}`} />
          <Skeleton className={`h-8 w-20 rounded-full ${SKELETON}`} />
          <Skeleton className={`h-8 w-32 rounded-full ${SKELETON}`} />
        </div>
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
          <Skeleton className={`h-3 w-28 ${SKELETON}`} />
          <Skeleton className={`h-2.5 w-20 ${SKELETON}`} />
        </div>
        <div className="px-3">
          <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr] items-center gap-3 border-b border-[rgba(55,50,47,0.12)] py-2">
            {Array.from({ length: 11 }).map((_, i) => (
              <Skeleton key={i} className={`h-2.5 w-full ${SKELETON}`} />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, r) => (
            <div
              key={r}
              className="grid grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr_0.6fr] items-center gap-3 border-b border-[rgba(55,50,47,0.06)] py-2.5"
            >
              {Array.from({ length: 11 }).map((_, c) => (
                <Skeleton key={c} className={`h-3 ${c === 0 ? "w-32" : "w-full"} ${SKELETON}`} />
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
