import { CampaignStatus } from "@prisma/client"

const STYLE: Record<CampaignStatus, string> = {
  DRAFT: "bg-[#ECEAE2] text-[#0A0A0A]/60",
  ACTIVE: "bg-[#ECEAE2] text-[#1F40CD]",
  PAUSED: "bg-[#ECEAE2] text-[#0A0A0A]/75",
  ENDED: "bg-[#ECEAE2] text-[#0A0A0A]/45",
}

const LABEL: Record<CampaignStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  PAUSED: "Paused",
  ENDED: "Ended",
}

export function StatusBadge({ status }: { status: CampaignStatus }): React.JSX.Element {
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-widest ${STYLE[status]}`}
    >
      {LABEL[status]}
    </span>
  )
}
