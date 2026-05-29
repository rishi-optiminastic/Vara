import { CampaignForm } from "@/components/campaigns/components/CampaignForm"
import { DashedGridShell } from "@/components/dashboard/DashedGridShell"

export default function NewCampaignPage(): React.JSX.Element {
  return (
    <DashedGridShell>
      <div className="flex items-end justify-between gap-2">
        <div className="shrink-0 flex items-baseline gap-2">
          <h1 className="text-[#0A0A0A] tracking-[-0.02em] text-[20px] font-medium leading-none">
            New campaign
          </h1>
          <span className="text-[10.5px] font-semibold uppercase tracking-widest text-muted-foreground tabular-nums">
            5 steps<span className="mx-1.5 text-[#0A0A0A]/30">·</span>Auto-saves as you go
          </span>
        </div>
      </div>

      <CampaignForm />
    </DashedGridShell>
  )
}
