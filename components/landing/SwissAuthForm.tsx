"use client"

import type { JSX, ReactNode } from "react"

export interface SwissAuthHeaderProps {
  eyebrow: string
  title: string
  body?: string
}

export function SwissAuthHeader({ eyebrow, title, body }: SwissAuthHeaderProps): JSX.Element {
  return (
    <div className="mb-8">
      <div className="text-[11px] tracking-[0.18em] text-[#37322F]/55">{eyebrow}</div>
      <h1 className="mt-3 text-[#1f40cd] uppercase tracking-[-0.01em] leading-[0.95] text-[28px] sm:text-[32px] font-medium">
        {title}
      </h1>
      {body && <p className="mt-3 text-[13px] text-[#37322F]/70">{body}</p>}
    </div>
  )
}

export function SwissError({ message }: { message: string | null }): JSX.Element | null {
  if (!message) return null
  return (
    <div
      role="alert"
      className="border border-[#c2410c] bg-[#c2410c]/5 text-[#c2410c] text-[12px] tracking-[0.04em] px-3 py-2 mb-5"
    >
      {message}
    </div>
  )
}

export interface SwissFieldProps {
  label: string
  hint?: ReactNode
  children: ReactNode
}

export function SwissField({ label, hint, children }: SwissFieldProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2 mb-5">
      <div className="flex items-baseline justify-between">
        <label className="text-[10px] font-medium text-[#1f40cd] tracking-[0.14em]">
          {label.toUpperCase()}
        </label>
        {hint && <div className="text-[11px] text-[#37322F]/55">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

export interface SwissInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  invalid?: boolean
}

export function SwissInput({ invalid, ...props }: SwissInputProps): JSX.Element {
  return (
    <input
      {...props}
      className={`w-full h-11 px-3 bg-transparent text-[#37322F] text-[14px] outline-none border-b ${
        invalid ? "border-[#c2410c]" : "border-[#37322F]/25"
      } focus:border-[#1f40cd] transition-colors placeholder:text-[#37322F]/35`}
    />
  )
}

export interface SwissTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  invalid?: boolean
}

export function SwissTextarea({ invalid, ...props }: SwissTextareaProps): JSX.Element {
  return (
    <textarea
      {...props}
      className={`w-full px-3 py-3 bg-transparent text-[#37322F] text-[14px] outline-none border ${
        invalid ? "border-[#c2410c]" : "border-[#37322F]/25"
      } focus:border-[#1f40cd] transition-colors placeholder:text-[#37322F]/35 resize-y min-h-[100px]`}
    />
  )
}

export interface SwissSubmitProps {
  loading?: boolean
  label: string
  loadingLabel: string
  disabled?: boolean
}

export function SwissSubmit({
  loading,
  label,
  loadingLabel,
  disabled,
}: SwissSubmitProps): JSX.Element {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full h-12 mt-2 bg-[#1f40cd] text-white text-xs font-medium tracking-[0.14em] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
    >
      {loading ? loadingLabel.toUpperCase() : label.toUpperCase()}
    </button>
  )
}

export interface SwissGoogleButtonProps {
  loading?: boolean
  onClick: () => void
  disabled?: boolean
  label: string
}

export function SwissGoogleButton({
  loading,
  onClick,
  disabled,
  label,
}: SwissGoogleButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-12 mb-5 border border-[#37322F]/25 text-[#37322F] text-xs font-medium tracking-[0.14em] flex items-center justify-center gap-3 hover:bg-[#37322F]/[0.04] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden>
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
      {loading ? "CONNECTING…" : label.toUpperCase()}
    </button>
  )
}

export function SwissDivider({ label }: { label: string }): JSX.Element {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[#37322F]/12" />
      <span className="text-[10px] font-medium text-[#37322F]/45 uppercase tracking-[0.14em]">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#37322F]/12" />
    </div>
  )
}
