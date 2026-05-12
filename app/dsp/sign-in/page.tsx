"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { signIn } from "@/lib/auth-client"
import { SwissAuthShell } from "@/components/landing/SwissAuthShell"
import {
  SwissAuthHeader,
  SwissDivider,
  SwissError,
  SwissField,
  SwissGoogleButton,
  SwissInput,
  SwissSubmit,
} from "@/components/landing/SwissAuthForm"

export default function DspSignInPage(): React.JSX.Element {
  return (
    <Suspense fallback={<DspSignInShell><div className="h-64" /></DspSignInShell>}>
      <DspSignInForm />
    </Suspense>
  )
}

function DspSignInShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <SwissAuthShell
      eyebrow="DEMAND-SIDE · BUYER CONSOLE"
      panelHeading="Spend with precision, settle with proof"
      panelBody="Run real-time bids, target wallets that convert, and keep a receipt for every settled dollar."
      panelMeta="VARA · DSP · LIVE 2026"
      backHref="/dsp"
      backLabel="Back to DSP"
    >
      {children}
    </SwissAuthShell>
  )
}

function DspSignInForm(): React.JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        setError(result.error.message || "Invalid credentials. Please try again.")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle(): Promise<void> {
    setError(null)
    setGoogleLoading(true)
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
        newUserCallbackURL: "/onboarding",
      })
    } catch {
      setError("Google sign-in failed. Please try again.")
      setGoogleLoading(false)
    }
  }

  const disabled = loading || googleLoading

  return (
    <DspSignInShell>
      <SwissAuthHeader
        eyebrow="DSP · SIGN IN"
        title="Welcome back"
        body="Sign in to launch your next campaign."
      />

      <SwissError message={error} />

      <SwissGoogleButton
        onClick={handleGoogle}
        loading={googleLoading}
        disabled={disabled}
        label="Continue with Google"
      />

      <SwissDivider label="OR CONTINUE WITH EMAIL" />

      <form onSubmit={handleSubmit}>
        <SwissField label="Email address">
          <SwissInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
            disabled={disabled}
          />
        </SwissField>

        <SwissField
          label="Password"
          hint={
            <Link href="/forgot-password" className="hover:text-[#1f40cd] transition-colors">
              Forgot?
            </Link>
          }
        >
          <div className="relative">
            <SwissInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={disabled}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#37322F]/55 hover:text-[#1f40cd]"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </SwissField>

        <SwissSubmit
          loading={loading}
          disabled={disabled}
          label="Sign in"
          loadingLabel="Signing in…"
        />
      </form>

      <p className="mt-6 text-[12px] text-[#37322F]/65">
        Don&apos;t have an account?{" "}
        <Link href="/dsp/sign-up" className="text-[#1f40cd] hover:underline underline-offset-4">
          Create one
        </Link>
      </p>

      <p className="mt-3 text-[12px] text-[#37322F]/55">
        Looking for the publisher console?{" "}
        <Link href="/ssp/sign-in" className="text-[#1f40cd] hover:underline underline-offset-4">
          SSP sign in
        </Link>
      </p>

      <p className="mt-6 text-[11px] tracking-[0.04em] text-[#37322F]/45">
        By signing in you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy
        </Link>
        .
      </p>
    </DspSignInShell>
  )
}
