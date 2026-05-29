import Link from "next/link"
import type { Recommendation } from "@/lib/recommendations"

interface Props {
  rec: Recommendation
}

const SEVERITY_LABEL: Record<Recommendation["severity"], string> = {
  warning: "Action needed",
  info: "Heads up",
  opportunity: "Optimization",
}

export function RecommendationRow({ rec }: Props): React.JSX.Element {
  const label = SEVERITY_LABEL[rec.severity]
  return (
    <div className="group relative flex items-start gap-3 bg-white px-3 py-2.5 transition-colors hover:bg-[#0A0A0A]/[0.015]">
      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1F40CD]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-[#1F40CD]">
            {label}
          </span>
          {rec.campaignName && (
            <>
              <span className="text-[#0A0A0A]/25 text-[10px]" aria-hidden>·</span>
              <Link
                href={`/dashboard/campaigns/${rec.campaignId}`}
                className="text-[10px] text-muted-foreground hover:text-[#0A0A0A] hover:underline truncate"
              >
                {rec.campaignName}
              </Link>
            </>
          )}
        </div>
        <h3 className="mt-1 text-[12.5px] font-medium text-[#0A0A0A] leading-snug">{rec.title}</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">{rec.body}</p>
      </div>
      <Link
        href={rec.ctaHref}
        className="shrink-0 self-center rounded-full border border-[rgba(10,10,10,0.18)] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#0A0A0A] hover:border-[#1F40CD] hover:text-[#1F40CD] transition-colors"
      >
        {rec.ctaLabel} →
      </Link>
    </div>
  )
}
