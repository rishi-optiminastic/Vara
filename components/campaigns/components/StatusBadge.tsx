import { CampaignStatus } from "@prisma/client"
import { Badge } from "@/components/ui/badge"

const VARIANT: Record<CampaignStatus, "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "outline",
  ACTIVE: "default",
  PAUSED: "secondary",
  ENDED: "outline",
}

const LABEL: Record<CampaignStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  PAUSED: "Paused",
  ENDED: "Ended",
}

export function StatusBadge({ status }: { status: CampaignStatus }): React.JSX.Element {
  return (
    <Badge variant={VARIANT[status]} className="h-4 px-1.5 text-[9px] uppercase tracking-wider">
      {LABEL[status]}
    </Badge>
  )
}
