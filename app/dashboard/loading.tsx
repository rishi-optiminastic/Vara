import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

const SKELETON = "bg-[rgba(55,50,47,0.06)]"

export default function DashboardLoading(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div className="space-y-2">
          <Skeleton className={`h-6 w-56 ${SKELETON}`} />
          <Skeleton className={`h-3 w-44 ${SKELETON}`} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className={`h-8 w-40 rounded-full ${SKELETON}`} />
          <Skeleton className={`h-8 w-32 rounded-full ${SKELETON}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="py-3 border-[rgba(55,50,47,0.12)]">
            <CardContent className="px-3 space-y-2.5">
              <Skeleton className={`h-3 w-24 ${SKELETON}`} />
              <Skeleton className={`h-7 w-20 ${SKELETON}`} />
              <Skeleton className={`h-2.5 w-28 ${SKELETON}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="gap-0 py-0 border-[rgba(55,50,47,0.12)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3 py-2">
          <Skeleton className={`h-3 w-32 ${SKELETON}`} />
          <Skeleton className={`h-5 w-16 rounded-full ${SKELETON}`} />
        </div>
        <ul className="divide-y divide-[rgba(55,50,47,0.08)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="flex-1 space-y-1.5">
                <Skeleton className={`h-3 w-40 ${SKELETON}`} />
                <Skeleton className={`h-2.5 w-56 ${SKELETON}`} />
              </div>
              <Skeleton className={`h-4 w-14 rounded-full ${SKELETON}`} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
