'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp, signIn } from '@/lib/auth-client'
import { Eye, EyeOff, Loader2, ArrowRight, Check } from 'lucide-react'
import { AuthShell } from '@/components/auth-shell'

export default function DspSignUpPage(): React.JSX.Element {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signUp.email({ name, email, password })
      if (result.error) {
        setError(result.error.message || 'Failed to create account. Please try again.')
      } else {
        router.push('/onboarding')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async (): Promise<void> => {
    setError('')
    setGoogleLoading(true)
    try {
      await signIn.social({ provider: 'google', callbackURL: '/dashboard', newUserCallbackURL: '/onboarding' })
    } catch {
      setError('Google sign-up failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  const disabled = loading || googleLoading
  const passwordOk = password.length >= 8

  return (
    <AuthShell variant="dsp">
      <div className="lg:hidden mb-6">
        <Link href="/dsp" className="flex items-center gap-2 group w-fit">
          <span className="text-xl font-medium text-[#2F3037] tracking-tight group-hover:opacity-70 transition-opacity">
            Vara
          </span>
          <span className="text-[10px] font-medium text-foreground/55 uppercase tracking-[0.12em] border border-foreground/15 rounded-full px-2 py-0.5 bg-white/60 backdrop-blur-sm">
            Web3 DSP
          </span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-[34px] font-normal font-serif text-foreground tracking-tight mb-2 leading-[1.1]">
          Create your advertiser account
        </h1>
        <p className="text-sm text-foreground/55 leading-relaxed">
          Reach the right wallets across every chain.
        </p>
      </div>

      {error && (
        <div className="bg-[rgba(239,68,68,0.07)] border border-[rgba(239,68,68,0.18)] rounded-lg px-4 py-3 mb-5 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        disabled={disabled}
        className="w-full h-11 rounded-xl bg-white border border-border text-foreground text-sm font-medium flex items-center justify-center gap-2.5 hover:bg-[#FAFAF9] hover:border-foreground/[0.22] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(55,50,47,0.04)]"
      >
        {googleLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"
            />
          </svg>
        )}
        Sign up with Google
      </button>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-foreground/10" />
        <span className="text-[10px] font-medium text-foreground/45 uppercase tracking-[0.12em]">
          or sign up with email
        </span>
        <div className="flex-1 h-px bg-foreground/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-foreground/50 uppercase tracking-[0.07em]">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-border text-foreground text-sm outline-none transition-all rounded-md placeholder:text-foreground/[0.28] focus:border-foreground/[0.38] focus:shadow-[0_0_0_3px_rgba(55,50,47,0.05)]"
            placeholder="John Smith"
            required
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-foreground/50 uppercase tracking-[0.07em]">
            Work email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-border text-foreground text-sm outline-none transition-all rounded-md placeholder:text-foreground/[0.28] focus:border-foreground/[0.38] focus:shadow-[0_0_0_3px_rgba(55,50,47,0.05)]"
            placeholder="you@company.com"
            required
            disabled={disabled}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-foreground/50 uppercase tracking-[0.07em]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-border text-foreground text-sm outline-none transition-all rounded-md placeholder:text-foreground/[0.28] focus:border-foreground/[0.38] focus:shadow-[0_0_0_3px_rgba(55,50,47,0.05)]"
              placeholder="Min. 8 characters"
              minLength={8}
              required
              disabled={disabled}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ring hover:text-foreground/65 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {password.length > 0 && (
            <div
              className={`flex items-center gap-1.5 text-xs mt-0.5 ${passwordOk ? 'text-emerald-600' : 'text-foreground/45'}`}
            >
              <Check size={12} className={passwordOk ? 'opacity-100' : 'opacity-30'} />
              At least 8 characters
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full mt-1 h-11 px-6 rounded-full bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset,0_8px_20px_-6px_rgba(55,50,47,0.4)] hover:bg-[#2A2520] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-px active:translate-y-0"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creating account…
            </>
          ) : (
            <>
              Get started as Advertiser <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-foreground/[0.48]">
        Already have an account?{' '}
        <Link
          href="/dsp/sign-in"
          className="text-foreground font-medium hover:text-[#2A2520] transition-colors"
        >
          Sign in
        </Link>
      </p>

      <p className="text-center mt-4 text-xs text-foreground/[0.42]">
        Looking to monetize traffic?{' '}
        <Link href="/ssp/sign-up" className="underline underline-offset-2 hover:text-foreground">
          Publisher sign up (SSP)
        </Link>
      </p>

      <p className="text-center mt-6 text-xs text-foreground/[0.42]">
        By creating an account you agree to our{' '}
        <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
          Terms
        </Link>{' '}
        &{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy
        </Link>
        .
      </p>
    </AuthShell>
  )
}
