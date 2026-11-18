// Base URL of the Rust backend for server-side fetches (RSC + auth shim).
// Must stay in sync with the fallback in next.config.mjs, which also refuses
// to build on Vercel when BACKEND_URL is unset.
export const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000'
