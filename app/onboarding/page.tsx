import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { getOrCreateAdvertiser } from '@/lib/advertiser'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default async function OnboardingPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/')
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)
  if (advertiser.onboardedAt) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#ECEAE2] font-sans">
      <header className="border-b border-[rgba(10,10,10,0.08)] bg-[#ECEAE2]/85 backdrop-blur sticky top-0 z-10">
        <div className="max-w-275 mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/VaraAd.png"
              alt="Vara"
              width={1080}
              height={1080}
              className="h-7 w-7 group-hover:opacity-75 transition-opacity"
              priority
            />
            <span className="text-[15px] font-medium text-[#0A0A0A] tracking-tight">
              Vara <span className="text-[#0A0A0A]/45">Ads</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-[12px] text-[#0A0A0A]/55 hover:text-[#1F40CD] transition-colors"
          >
            Save &amp; exit
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <OnboardingFlow
          initial={{
            projectName: advertiser.projectName,
            websiteUrl: advertiser.websiteUrl,
          }}
        />
      </div>
    </div>
  )
}
