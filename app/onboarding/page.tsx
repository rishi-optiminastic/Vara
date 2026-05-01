import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getOrCreateAdvertiser } from '@/lib/advertiser'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default async function OnboardingPage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/')
  const advertiser = await getOrCreateAdvertiser(session.user.id, session.user.name)
  if (advertiser.onboardedAt) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-sans relative">
      <div className="relative z-10 max-w-[640px] mx-auto px-4 py-10 sm:py-14">
        <Link href="/" className="flex items-center gap-2 group w-fit mb-10">
          <span className="text-xl font-medium text-[#2F3037] tracking-tight group-hover:opacity-70 transition-opacity">
            Vara
          </span>
        </Link>

        <header className="mb-10 flex items-start gap-5">
          <div className="hidden sm:flex shrink-0 size-12 items-center justify-center rounded-xl bg-white border border-foreground/[0.08] shadow-[0_2px_6px_-1px_rgba(55,50,47,0.06)]">
            <span className="text-[18px]"></span>
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground/50">
              Step 1 of 2 · Workspace
            </span>
            <h1 className="text-[32px] sm:text-[36px] font-normal font-serif text-foreground tracking-tight leading-[1.1] mt-1.5 mb-2">
              Set up your workspace
            </h1>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-[480px]">
              A couple of details so we can target the right wallets, attribute conversions
              on-chain, and keep your campaigns clean.
            </p>
          </div>
        </header>

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
