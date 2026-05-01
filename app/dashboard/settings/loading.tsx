import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

const SKELETON = "bg-[rgba(55,50,47,0.06)]"

export default function SettingsLoading(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-end justify-between border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <div className="space-y-2">
          <Skeleton className={`h-6 w-56 ${SKELETON}`} />
          <Skeleton className={`h-3 w-72 ${SKELETON}`} />
        </div>
        <Skeleton className={`h-5 w-20 rounded-full ${SKELETON}`} />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="py-3 border-[rgba(55,50,47,0.12)]">
            <CardContent className="px-3 space-y-2.5">
              <Skeleton className={`h-3 w-24 ${SKELETON}`} />
              <Skeleton className={`h-7 w-16 ${SKELETON}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Card className="lg:col-span-2 py-0 gap-0 border-[rgba(55,50,47,0.12)]">
          <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
            <Skeleton className={`h-3 w-20 ${SKELETON}`} />
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className={`size-12 rounded-full ${SKELETON}`} />
              <div className="flex-1 space-y-2">
                <Skeleton className={`h-4 w-40 ${SKELETON}`} />
                <Skeleton className={`h-3 w-56 ${SKELETON}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-[rgba(55,50,47,0.1)]">
              <div className="space-y-1.5">
                <Skeleton className={`h-2.5 w-20 ${SKELETON}`} />
                <Skeleton className={`h-3 w-24 ${SKELETON}`} />
              </div>
              <div className="space-y-1.5">
                <Skeleton className={`h-2.5 w-20 ${SKELETON}`} />
                <Skeleton className={`h-3 w-24 ${SKELETON}`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3 py-0 gap-0 border-[rgba(55,50,47,0.12)]">
          <div className="border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
            <Skeleton className={`h-3 w-24 ${SKELETON}`} />
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className={`size-12 rounded-xl ${SKELETON}`} />
              <div className="flex-1 space-y-2">
                <Skeleton className={`h-4 w-40 ${SKELETON}`} />
                <Skeleton className={`h-3 w-44 ${SKELETON}`} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 pt-2 border-t border-dashed border-[rgba(55,50,47,0.1)]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className={`h-2.5 w-16 ${SKELETON}`} />
                  <Skeleton className={`h-3 w-20 ${SKELETON}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="py-0 gap-0 border-[rgba(55,50,47,0.12)]">
        <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
          <Skeleton className={`h-3 w-32 ${SKELETON}`} />
          <Skeleton className={`h-2.5 w-20 ${SKELETON}`} />
        </div>
        <CardContent className="p-3.5">
          <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <Skeleton className={`h-7 w-full rounded-full ${SKELETON}`} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
