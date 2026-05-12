"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Check } from "lucide-react"
import { signIn, signUp } from "@/lib/auth-client"
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

export default function DspSignUpPage(): React.JSX.Element {
  const router = useRouter()

  const [name, setName] = useState("")
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
      const result = await signUp.email({ name, email, password })
      if (result.error) {
        setError(result.error.message || "Failed to create account. Please try again.")
      } else {
        router.push("/onboarding")
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
        callbackURL: "/dashboard",
        newUserCallbackURL: "/onboarding",
      })
    } catch {
      setError("Google sign-up failed. Please try again.")
      setGoogleLoading(false)
    }
  }

  const disabled = loading || googleLoading
  const passwordOk = password.length >= 8

  return (
    <SwissAuthShell
      eyebrow="DEMAND-SIDE · BUYER CONSOLE"
      panelHeading="Spend with precision, settle with proof"
      panelBody="Run real-time bids, target wallets that convert, and keep a receipt for every settled dollar."
      panelMeta="VARA · DSP · LIVE 2026"
      backHref="/dsp"
      backLabel="Back to DSP"
    >
      <SwissAuthHeader
        eyebrow="DSP · CREATE ACCOUNT"
        title="Create your advertiser account"
        body="Reach the right wallets across every chain."
      />

      <SwissError message={error} />

      <SwissGoogleButton
        onClick={handleGoogle}
        loading={googleLoading}
        disabled={disabled}
        label="Continue with Google"
      />

      <SwissDivider label="OR SIGN UP WITH EMAIL" />

      <form onSubmit={handleSubmit}>
        <SwissField label="Full name">
          <SwissInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
            required
            disabled={disabled}
          />
        </SwissField>

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
            passwordOk ? (
              <span className="inline-flex items-center gap-1 text-[#1f40cd]">
                <Check size={12} /> 8+ chars
              </span>
            ) : (
              <>Min 8 chars</>
            )
          }
        >
          <div className="relative">
            <SwissInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
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
          disabled={disabled || !passwordOk}
          label="Create account"
          loadingLabel="Creating…"
        />
      </form>

      <p className="mt-6 text-[12px] text-[#37322F]/65">
        Already have an account?{" "}
        <Link href="/dsp/sign-in" className="text-[#1f40cd] hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>

      <p className="mt-3 text-[12px] text-[#37322F]/55">
        Looking for the publisher console?{" "}
        <Link href="/ssp/sign-up" className="text-[#1f40cd] hover:underline underline-offset-4">
          SSP sign up
        </Link>
      </p>

      <p className="mt-6 text-[11px] tracking-[0.04em] text-[#37322F]/45">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-4">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="underline underline-offset-4">
          Privacy
        </Link>
        .
      </p>
    </SwissAuthShell>
  )
}
