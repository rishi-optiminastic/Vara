import { CampaignStatus } from "@prisma/client"

const COLOR: Record<CampaignStatus, string> = {
  ACTIVE: "bg-[#15803D] shadow-[0_0_0_2px_rgba(21,128,61,0.18)]",
  PAUSED: "bg-[#D97706] shadow-[0_0_0_2px_rgba(217,119,6,0.18)]",
  DRAFT: "bg-[rgba(55,50,47,0.35)]",
  ENDED: "bg-[rgba(55,50,47,0.25)]",
}

const LABEL: Record<CampaignStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  DRAFT: "Draft",
  ENDED: "Ended",
}

export function StatusDot({ status }: { status: CampaignStatus }): React.JSX.Element {
  return (
    <span
      title={LABEL[status]}
      aria-label={LABEL[status]}
      className={`inline-block size-1.5 rounded-full ${COLOR[status]}`}
    />
  )
}
