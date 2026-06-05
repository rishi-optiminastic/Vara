// Client-side auth, backed by the Rust backend (`/api/auth/*`, proxied via
// next.config rewrites). Drop-in replacement for the previous better-auth React
// client: it preserves the `signIn.email` / `signIn.social` / `signUp.email` /
// `signOut` / `useSession` surface the auth pages already use.
'use client'

import { useEffect, useState } from 'react'

interface AuthError {
  message: string
}

interface AuthResult<T = unknown> {
  data: T | null
  error: AuthError | null
}

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<AuthResult<T>> {
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'same-origin',
    })
    const json = (await res.json().catch(() => ({}))) as { error?: string } & Record<string, unknown>
    if (!res.ok) {
      return { data: null, error: { message: json.error ?? 'Request failed' } }
    }
    return { data: json as T, error: null }
  } catch {
    return { data: null, error: { message: 'Network error' } }
  }
}

interface EmailCredentials {
  email: string
  password: string
}

interface SignUpCredentials extends EmailCredentials {
  name: string
}

interface SocialOptions {
  provider: string
  callbackURL?: string
  newUserCallbackURL?: string
}

export const signIn = {
  email: (creds: EmailCredentials): Promise<AuthResult> =>
    postJson('/api/auth/sign-in', { ...creds }),
  // OAuth: full-page redirect to the backend, which bounces to the provider's
  // consent screen and back to /api/auth/callback/<provider>.
  social: async (opts: SocialOptions): Promise<AuthResult> => {
    window.location.href = `/api/auth/${opts.provider}`
    return { data: null, error: null }
  },
}

export const signUp = {
  email: (creds: SignUpCredentials): Promise<AuthResult> =>
    postJson('/api/auth/sign-up', { ...creds }),
}

export async function signOut(): Promise<void> {
  await fetch('/api/auth/sign-out', { method: 'POST', credentials: 'same-origin' })
}

interface SessionData {
  user: {
    id: string
    name: string
    email: string
    image: string | null
    emailVerified: boolean
    activeAdvertiserId: string | null
  }
  session?: { expiresAt: string }
}

interface UseSessionResult {
  data: SessionData | null
  isPending: boolean
}

export function useSession(): UseSessionResult {
  const [data, setData] = useState<SessionData | null>(null)
  const [isPending, setIsPending] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((j: { user: SessionData['user'] | null } & SessionData) => {
        if (!active) return
        setData(j?.user ? j : null)
        setIsPending(false)
      })
      .catch(() => {
        if (!active) return
        setData(null)
        setIsPending(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { data, isPending }
}

export const authClient = { signIn, signUp, signOut, useSession }
