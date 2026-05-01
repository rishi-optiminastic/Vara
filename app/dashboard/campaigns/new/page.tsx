import { CampaignForm } from "@/components/campaigns/components/CampaignForm"

export default function NewCampaignPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3 max-w-6xl">
      <div className="flex items-baseline justify-between border-b border-[rgba(55,50,47,0.12)] pb-2 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">New </span>
          Campaign
        </h1>
        <p className="text-[10px] text-muted-foreground">
          Campaign → Budget → Ad Group → Ads → Review
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
