import { MarketingNav } from '@/components/marketing-nav'
import { DspCTA } from '@/components/dsp/DspCTA'
import { DspContent } from '@/components/dsp/DspContent'
import { DspFAQ } from '@/components/dsp/DspFAQ'
import { DspFooter } from '@/components/dsp/DspFooter'
import { DspHero } from '@/components/dsp/DspHero'
import { DspStats } from '@/components/dsp/DspStats'

export default function DspPage(): React.JSX.Element {
  return (
    <div className="w-full min-h-screen relative bg-background overflow-x-hidden flex flex-col items-center">
      <MarketingNav variant="dsp" />
      <div className="w-full lg:max-w-[1280px] relative flex flex-col items-start">
        <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-border shadow-[1px_0px_0px_white] z-0" />
        <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-border shadow-[1px_0px_0px_white] z-0" />

        <div className="self-stretch flex flex-col items-center gap-0 relative z-10">
          <DspHero />
          <DspContent />
          <DspStats />
          <DspFAQ />
          <DspCTA />
          <DspFooter />
        </div>
      </div>
    </div>
  )
}
