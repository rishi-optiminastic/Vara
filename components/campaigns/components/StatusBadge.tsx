import { CampaignStatus } from "@prisma/client"

const STYLE: Record<CampaignStatus, string> = {
  DRAFT: "border border-dashed border-[#37322F]/35 text-[#37322F]/65",
  ACTIVE: "bg-[#1f40cd] text-white",
  PAUSED: "border border-[#c2410c] text-[#c2410c]",
  ENDED: "border border-[#37322F]/25 text-[#37322F]/55",
}

const LABEL: Record<CampaignStatus, string> = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  ENDED: "ENDED",
}

export function StatusBadge({ status }: { status: CampaignStatus }): React.JSX.Element {
  return (
    <span
      className={`inline-flex h-5 items-center px-2 text-[10px] font-medium tracking-[0.14em] ${STYLE[status]}`}
    >
      {LABEL[status]}
    </span>
  )
}
