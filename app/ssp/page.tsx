
import { MarketingNav } from '@/components/marketing-nav'
import { SspCTA } from '@/components/ssp/SspCTA'
import { SspContent } from '@/components/ssp/SspContent'
import { SspFAQ } from '@/components/ssp/SspFAQ'
import { SspFooter } from '@/components/ssp/SspFooter'
import { SspHero } from '@/components/ssp/SspHero'
import { SspStats } from '@/components/ssp/SspStats'

export default function SspPage(): React.JSX.Element {
  return (
    <div className="w-full min-h-screen relative bg-background overflow-x-hidden flex flex-col items-center">
      <MarketingNav variant="ssp" />
      <div className="w-full lg:max-w-[1280px] relative flex flex-col items-start">
        <div className="w-px h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-border shadow-[1px_0px_0px_white] z-0" />
        <div className="w-px h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-border shadow-[1px_0px_0px_white] z-0" />

        <div className="self-stretch flex flex-col items-center gap-0 relative z-10">
          <SspHero />
          <SspContent />
          <SspStats />
          <SspFAQ />
          <SspCTA />
          <SspFooter />
        </div>
      </div>
    </div>
  )
}
