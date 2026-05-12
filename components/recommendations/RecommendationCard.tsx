import Link from "next/link"
import type { Recommendation } from "@/lib/recommendations"
import { Button } from "@/components/ui/button"

interface Props {
  rec: Recommendation
}

const SEVERITY_STYLE: Record<Recommendation["severity"], { dot: string; pill: string; label: string }> = {
  warning: {
    dot: "bg-[#C2410C]",
    pill: "bg-[#FFF3E8] text-[#C2410C] border-[rgba(194,65,12,0.2)]",
    label: "Action needed",
  },
  info: {
    dot: "bg-[#0E7490]",
    pill: "bg-[#E8F4F7] text-[#0E7490] border-[rgba(14,116,144,0.2)]",
    label: "Heads up",
  },
  opportunity: {
    dot: "bg-[#65A30D]",
    pill: "bg-[#F0F7E8] text-[#3F6212] border-[rgba(101,163,13,0.2)]",
    label: "Optimization",
  },
}

export function RecommendationCard({ rec }: Props): React.JSX.Element {
  const sev = SEVERITY_STYLE[rec.severity]
  return (
    <div className="rounded-lg border border-[rgba(55,50,47,0.12)] bg-white p-3.5 shadow-[0_1px_0_rgba(255,255,255,0.6),0_4px_12px_-8px_rgba(55,50,47,0.08)] hover:border-[rgba(55,50,47,0.32)] transition-colors">
      <div className="flex items-start gap-2.5">
        <div className={`mt-1 size-1.5 rounded-full shrink-0 ${sev.dot}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider ${sev.pill}`}>
              {sev.label}
            </span>
            {rec.campaignName && (
              <Link
                href={`/dashboard/campaigns/${rec.campaignId}`}
                className="text-[10px] text-muted-foreground hover:text-[#37322F] hover:underline truncate"
              >
                {rec.campaignName}
              </Link>
            )}
          </div>
          <h3 className="mt-1.5 text-[13px] font-medium text-[#37322F] leading-snug">{rec.title}</h3>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{rec.body}</p>
          <div className="mt-2.5">
            <Button asChild size="sm" variant="outline" className="h-7 text-[11px] border-[rgba(55,50,47,0.2)] bg-white">
              <Link href={rec.ctaHref}>{rec.ctaLabel} →</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
