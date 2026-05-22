import { CampaignForm } from "@/components/campaigns/components/CampaignForm"

export default function NewCampaignPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3 max-w-6xl">
      <div className="flex items-baseline justify-between border-b border-[rgba(10,10,10,0.12)] pb-2 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#0A0A0A] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px] text-[#1F40CD]">New </span>
          Campaign
        </h1>
        <p className="text-[10px] text-muted-foreground">
          5 steps · auto-saves as you go
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
