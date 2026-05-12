"use client"

import Link from "next/link"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SwissAuthShell } from "@/components/landing/SwissAuthShell"
import {
  SwissAuthHeader,
  SwissError,
  SwissField,
  SwissInput,
  SwissSubmit,
  SwissTextarea,
} from "@/components/landing/SwissAuthForm"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email"),
  company: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EarlyAccessPage(): React.JSX.Element {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  })

  async function onSubmit(values: FormValues): Promise<void> {
    setServerError(null)
    const res = await fetch("/api/early-access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        company: values.company?.trim() || undefined,
        message: values.message?.trim() || undefined,
      }),
    })
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    if (!res.ok) {
      setServerError(data.error ?? "Something went wrong. Try again.")
      return
    }
    setSubmitted(true)
  }

  return (
    <SwissAuthShell
      eyebrow="VARA · BUILT IN PUBLIC · 2025—2026"
      panelHeading="Request early access"
      panelBody="Vara is rolling out by team. Share where you'd like to start — DSP, SSP, or both — and we'll match the cadence."
      panelMeta="NOV 2025 — Q2 2026 · MONTREAL · REMOTE FIRST"
      backHref="/"
      backLabel="Back to Vara"
    >
      {submitted ? (
        <div>
          <SwissAuthHeader
            eyebrow="EARLY ACCESS · CONFIRMED"
            title="You're on the list"
            body="Thanks for your interest. We'll reach out when early access opens."
          />
          <Link
            href="/"
            className="inline-flex h-12 items-center px-6 bg-[#1f40cd] text-white text-xs font-medium tracking-[0.14em]"
          >
            RETURN HOME
          </Link>
        </div>
      ) : (
        <>
          <SwissAuthHeader
            eyebrow="EARLY ACCESS · REQUEST"
            title="Get in touch"
            body="Share your details and we'll notify you when spots open."
          />

          <SwissError message={serverError} />

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SwissField label="Name">
              <SwissInput
                {...form.register("name")}
                placeholder="Jane Doe"
                autoComplete="name"
                invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <p className="text-[11px] text-[#c2410c] mt-1">{form.formState.errors.name.message}</p>
              )}
            </SwissField>

            <SwissField label="Work email">
              <SwissInput
                {...form.register("email")}
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                invalid={!!form.formState.errors.email}
              />
              {form.formState.errors.email && (
                <p className="text-[11px] text-[#c2410c] mt-1">{form.formState.errors.email.message}</p>
              )}
            </SwissField>

            <SwissField label="Company" hint={<>Optional</>}>
              <SwissInput
                {...form.register("company")}
                placeholder="Acme"
                autoComplete="organization"
              />
            </SwissField>

            <SwissField label="Anything we should know?" hint={<>Optional</>}>
              <SwissTextarea
                {...form.register("message")}
                placeholder="Use case, volume, timeline…"
                rows={4}
              />
            </SwissField>

            <SwissSubmit
              loading={form.formState.isSubmitting}
              label="Join waitlist"
              loadingLabel="Submitting…"
            />
          </form>

          <p className="mt-6 text-[11px] tracking-[0.04em] text-[#37322F]/45">
            By submitting you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy
            </Link>
            .
          </p>
        </>
      )}
    </SwissAuthShell>
  )
}
