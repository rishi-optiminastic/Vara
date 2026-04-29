"use client"

import Link from "next/link"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Enter a valid email"),
  company: z.string().max(200).optional(),
  message: z.string().max(2000).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EarlyAccessPage() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  })

  async function onSubmit(values: FormValues) {
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
    <div className="min-h-screen w-full bg-[#F7F5F3] flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[520px] flex flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-[#37322F] text-sm font-medium font-sans hover:opacity-80 transition-opacity"
          >
            ← Back
          </Link>
          <div className="text-[#2F3037] text-base font-medium font-sans">Varaads</div>
        </div>

        <div className="rounded-[9px] border border-[rgba(55,50,47,0.12)] bg-white shadow-[0px_0px_0px_0.9px_rgba(0,0,0,0.06)] p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-[#49423D] text-2xl sm:text-3xl font-semibold font-sans tracking-tight">
                You&apos;re on the list
              </h1>
              <p className="text-[#605A57] text-sm sm:text-base leading-relaxed font-sans">
                Thanks for your interest. We&apos;ll reach out when early access opens.
              </p>
              <Button
                asChild
                className="mt-2 rounded-full bg-[#37322F] hover:bg-[#2A2520] text-white"
              >
                <Link href="/">Return home</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 mb-6">
                <h1 className="text-[#49423D] text-2xl sm:text-3xl font-semibold font-sans tracking-tight">
                  Request early access
                </h1>
                <p className="text-[#605A57] text-sm sm:text-base leading-relaxed font-sans">
                  Share your details and we&apos;ll notify you when spots open.
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#37322F]">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane Doe"
                            autoComplete="name"
                            className="border-[rgba(55,50,47,0.15)] bg-[#F7F5F3]/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#37322F]">Work email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            autoComplete="email"
                            className="border-[rgba(55,50,47,0.15)] bg-[#F7F5F3]/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#37322F]">Company (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Acme"
                            autoComplete="organization"
                            className="border-[rgba(55,50,47,0.15)] bg-[#F7F5F3]/50"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#37322F]">Anything we should know? (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Use case, volume, timeline…"
                            rows={4}
                            className="border-[rgba(55,50,47,0.15)] bg-[#F7F5F3]/50 resize-y min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {serverError ? (
                    <p className="text-destructive text-sm" role="alert">
                      {serverError}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full sm:w-auto rounded-full h-11 px-10 bg-[#37322F] hover:bg-[#2A2520] text-white shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset]"
                  >
                    {form.formState.isSubmitting ? "Submitting…" : "Join waitlist"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
