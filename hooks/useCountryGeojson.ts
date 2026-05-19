"use client"

import { useEffect, useState } from "react"
import type { FeatureCollection, Geometry } from "geojson"
import { COUNTRIES_GEOJSON_URL } from "@/lib/geo/mapStyle"

export interface CountryProps {
  ISO_A2: string
  NAME: string
  [key: string]: unknown
}

export type CountryFC = FeatureCollection<Geometry, CountryProps>

interface State {
  data: CountryFC | null
  loading: boolean
  error: string | null
}

let cache: CountryFC | null = null
let pending: Promise<CountryFC> | null = null

async function fetchCountries(): Promise<CountryFC> {
  if (cache) return cache
  if (pending) return pending
  pending = fetch(COUNTRIES_GEOJSON_URL)
    .then(async (r) => {
      if (!r.ok) throw new Error(`Countries GeoJSON ${r.status}`)
      const json = (await r.json()) as CountryFC
      cache = json
      return json
    })
    .finally(() => {
      pending = null
    })
  return pending
}

export function useCountryGeojson(): State {
  const [state, setState] = useState<State>({
    data: cache,
    loading: cache === null,
    error: null,
  })

  useEffect(() => {
    if (cache) {
      setState({ data: cache, loading: false, error: null })
      return
    }
    let alive = true
    fetchCountries()
      .then((data) => {
        if (alive) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load map data"
        if (alive) setState({ data: null, loading: false, error: msg })
      })
    return () => {
      alive = false
    }
  }, [])

  return state
}
