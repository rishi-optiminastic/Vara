import { Card, CardContent } from "@/components/ui/card"
import { GearIcon, CircleOpenArrowRight } from "@/icons"

interface Props {
  advertiserId: string
  projectName: string
  websiteUrl: string | null
  primaryChain: string
  createdAt: Date
  updatedAt: Date
}

function dateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function hostFromUrl(url: string | null): string {
  if (!url) return "—"
  try {
    return new URL(url).host.replace(/^www\./, "")
  } catch {
    return url
  }
}

export function WorkspaceCard({
  advertiserId,
  projectName,
  websiteUrl,
  primaryChain,
  createdAt,
  updatedAt,
}: Props): React.JSX.Element {
  return (
    <Card className="h-full py-0 gap-0 border-[rgba(55,50,47,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)]">
      <div className="flex items-center gap-1.5 border-b border-[rgba(55,50,47,0.12)] px-3.5 py-2">
        <GearIcon className="size-3 text-muted-foreground" />
        <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Workspace</h3>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[rgba(55,50,47,0.12)] shadow-[0_2px_6px_-1px_rgba(55,50,47,0.06)]">
            <span className="font-instrument-serif italic text-[20px] text-[#37322F] leading-none">
              {projectName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-medium tracking-tight text-[#37322F] leading-tight truncate">
              {projectName}
            </div>
            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#37322F] transition-colors group"
              >
                <span className="truncate">{hostFromUrl(websiteUrl)}</span>
                <CircleOpenArrowRight className="size-2.5 opacity-60 group-hover:opacity-100" />
              </a>
            ) : (
              <p className="mt-0.5 text-[11px] text-muted-foreground italic">No website set</p>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-[rgba(55,50,47,0.1)] pt-3 lg:grid-cols-4">
          <Field label="Workspace ID" value={advertiserId.slice(0, 12)} mono />
          <Field label="Primary chain" value={primaryChain} />
          <Field label="Created" value={dateLabel(createdAt)} />
          <Field label="Last updated" value={dateLabel(updatedAt)} />
        </div>
      </CardContent>
    </Card>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }): React.JSX.Element {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-1 text-xs font-medium text-[#37322F] tabular-nums truncate ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  )
}
