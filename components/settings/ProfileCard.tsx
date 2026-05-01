import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleCheckIcon, CircleXmarkIcon, IdBadgeIcon } from "@/icons"

interface Props {
  name: string
  email: string
  image: string | null
  emailVerified: boolean
  createdAt: Date
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
}

function dateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function ProfileCard({ name, email, image, emailVerified, createdAt }: Props): React.JSX.Element {
  return (
    <Card className="h-full py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
        <IdBadgeIcon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Profile</h3>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="size-12 rounded-full border border-[rgba(55,50,47,0.12)] object-cover"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-full bg-[#F0ECE6] border border-[rgba(55,50,47,0.12)] text-[14px] font-medium text-[#37322F]">
              {initials(name) || "·"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium tracking-tight text-[#37322F] leading-tight truncate">
              {name}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
              <span className="truncate">{email}</span>
              {emailVerified ? (
                <Badge
                  variant="outline"
                  className="h-3.5 px-1 gap-0.5 text-[8px] uppercase tracking-widest bg-[#E8F5E9] text-[#15803D] border-[rgba(21,128,61,0.2)]"
                >
                  <CircleCheckIcon className="size-2.5" />
                  Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="h-3.5 px-1 gap-0.5 text-[8px] uppercase tracking-widest bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]"
                >
                  <CircleXmarkIcon className="size-2.5" />
                  Unverified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-[rgba(55,50,47,0.1)] pt-3">
          <Field label="Member since" value={dateLabel(createdAt)} />
          <Field label="Login method" value="Email" />
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-xs font-medium text-[#37322F] tabular-nums truncate">{value}</div>
    </div>
  )
}
