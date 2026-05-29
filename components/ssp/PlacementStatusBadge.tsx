import type { PlacementStatus } from "@prisma/client"

const STYLE: Record<PlacementStatus, string> = {
  DRAFT: "bg-[#ECEAE2] text-[#0A0A0A]/60",
  LIVE: "bg-[#ECEAE2] text-[#B45309]",
  PAUSED: "bg-[#ECEAE2] text-[#0A0A0A]/75",
}

const LABEL: Record<PlacementStatus, string> = {
  DRAFT: "Draft",
  LIVE: "Live",
  PAUSED: "Paused",
}

export function PlacementStatusBadge({ status }: { status: PlacementStatus }): React.JSX.Element {
  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-widest ${STYLE[status]}`}
    >
      {LABEL[status]}
    </span>
  )
}
