import { CampaignForm } from "@/features/campaigns/components/CampaignForm"

export default function NewCampaignPage(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3 p-3 max-w-2xl">
      <div className="border-b border-[rgba(55,50,47,0.12)] pb-3 shadow-[0_1px_0_rgba(255,255,255,0.6)]">
        <h1 className="text-[22px] font-medium tracking-tight text-[#37322F] leading-none">
          <span className="font-instrument-serif italic font-normal text-[26px]">New </span>
          Campaign
        </h1>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          Configure the basics. You can refine targeting and add creatives after saving.
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
