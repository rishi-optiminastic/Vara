// Server-side session access, backed by the Rust backend.
//
// Previously this wired up better-auth (with a Prisma adapter). Auth issuance
// and session validation now live entirely in the Rust backend; this module is
// a thin compatibility shim that preserves the `auth.api.getSession({ headers })`
// interface the rest of the app already calls, so server components and route
// handlers need no changes.

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

export interface SessionUser {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  activeAdvertiserId: string | null
  createdAt: string
  updatedAt: string
}

export interface Session {
  user: SessionUser
  session: { expiresAt: string }
}

interface GetSessionArgs {
  headers: Headers
}

async function getSession({ headers }: GetSessionArgs): Promise<Session | null> {
  const cookie = headers.get('cookie') ?? ''
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/session`, {
      headers: { cookie },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = (await res.json()) as { user: SessionUser | null; session?: { expiresAt: string } }
    if (!json?.user) return null
    return { user: json.user, session: json.session ?? { expiresAt: '' } }
  } catch {
    return null
  }
}

export const auth = {
  api: { getSession },
}
