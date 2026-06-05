// Server-side fetch helper for React Server Components.
//
// Forwards the incoming session cookie (and active-advertiser header, if the
// caller has one) to the Rust backend, so server components can read data from
// the single backend instead of querying the database directly. Pairs with the
// `/api/*` rewrite proxy used on the client side.

import { headers } from 'next/headers'

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'

interface ServerFetchOptions {
  method?: string
  body?: unknown
  // When true, a non-2xx response throws; otherwise null is returned.
  throwOnError?: boolean
}

/**
 * GET/POST the Rust backend with the current request's auth cookie attached.
 * Returns parsed JSON as `T`, or `null` on a non-OK response (unless
 * `throwOnError`).
 */
export async function serverApi<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T | null> {
  const h = await headers()
  const cookie = h.get('cookie') ?? ''
  const activeAdvertiser = h.get('x-vara-advertiser-id') ?? ''

  const requestHeaders: Record<string, string> = { cookie }
  if (activeAdvertiser) requestHeaders['x-vara-advertiser-id'] = activeAdvertiser
  if (options.body !== undefined) requestHeaders['content-type'] = 'application/json'

  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: requestHeaders,
    body: options.body !== undefined ? JSON.stringify(options.body) : null,
    cache: 'no-store',
  })

  if (!res.ok) {
    if (options.throwOnError) {
      throw new Error(`Backend ${path} failed: ${res.status}`)
    }
    return null
  }
  return (await res.json()) as T
}
