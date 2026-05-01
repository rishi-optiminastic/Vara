import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

const SKELETON = "bg-[rgba(55,50,47,0.06)]"

export default function CampaignDetailLoading(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <Skeleton className={`h-3 w-24 ${SKELETON}`} />
        <div className="flex items-start justify-between gap-3 mt-2">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className={`h-6 w-56 ${SKELETON}`} />
              <Skeleton className={`h-4 w-14 rounded-full ${SKELETON}`} />
              <Skeleton className={`h-4 w-20 rounded-full ${SKELETON}`} />
            </div>
            <Skeleton className={`h-3 w-72 ${SKELETON}`} />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className={`h-8 w-40 rounded-full ${SKELETON}`} />
            <Skeleton className={`h-8 w-24 rounded-full ${SKELETON}`} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.08)] pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={`h-7 w-20 rounded-full ${SKELETON}`} />
        ))}
      </div>

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.08)] px-3 py-1.5">
          <Skeleton className={`h-2.5 w-24 ${SKELETON}`} />
          <Skeleton className={`h-2.5 w-20 ${SKELETON}`} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(55,50,47,0.08)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-3 py-3 space-y-2">
              <Skeleton className={`h-3 w-20 ${SKELETON}`} />
              <Skeleton className={`h-6 w-16 ${SKELETON}`} />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="py-3 border-[rgba(55,50,47,0.12)]">
            <CardContent className="px-3.5 space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className={`h-3 w-24 ${SKELETON}`} />
                <Skeleton className={`h-3 w-16 ${SKELETON}`} />
              </div>
              <Skeleton className={`h-5 w-44 ${SKELETON}`} />
              <Skeleton className={`h-2 w-full rounded-full ${SKELETON}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
