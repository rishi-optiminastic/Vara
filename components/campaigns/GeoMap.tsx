"use client"

import { useMemo, useRef, useCallback, useEffect } from "react"
import {
  Map as MapLibreMap,
  Source,
  Layer,
  type MapRef,
  type MapLayerMouseEvent,
} from "react-map-gl/maplibre"
import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { MAP_STYLE, INITIAL_VIEW } from "@/lib/geo/mapStyle"
import { useCountryGeojson } from "@/hooks/useCountryGeojson"
import { getCountry } from "@/lib/geo/countries"
import { getRegion } from "@/lib/geo/regions"
import type { GeoSelection } from "@/lib/geo/encoding"

interface Props {
  selection: GeoSelection
  onToggleCountry: (code: string) => void
  focus?: { center: [number, number]; zoom: number } | null
}

function selectedCountries(sel: GeoSelection): Set<string> {
  const set = new Set<string>(sel.countries)
  for (const r of sel.regions) {
    const region = getRegion(r)
    if (region) region.countries.forEach((c) => set.add(c))
  }
  for (const s of sel.states) {
    const parent = s.split("-")[0]
    if (parent) set.add(parent)
  }
  return set
}

function fillLayer(selected: string[]): FillLayerSpecification {
  return {
    id: "countries-fill",
    type: "fill",
    source: "countries",
    paint: {
      "fill-color": [
        "case",
        ["in", ["get", "ISO_A2"], ["literal", selected]],
        "#37322F",
        "#FFFFFF",
      ],
      "fill-opacity": [
        "case",
        ["in", ["get", "ISO_A2"], ["literal", selected]],
        0.55,
        0.0,
      ],
    },
  }
}

const HOVER_LAYER: FillLayerSpecification = {
  id: "countries-hover",
  type: "fill",
  source: "countries",
  filter: ["==", ["get", "ISO_A2"], ""],
  paint: {
    "fill-color": "#37322F",
    "fill-opacity": 0.18,
  },
}

const BORDER_LAYER: LineLayerSpecification = {
  id: "countries-border",
  type: "line",
  source: "countries",
  paint: {
    "line-color": "rgba(55,50,47,0.35)",
    "line-width": 0.5,
  },
}

export function GeoMap({ selection, onToggleCountry, focus }: Props): React.JSX.Element {
  const { data, loading, error } = useCountryGeojson()
  const mapRef = useRef<MapRef | null>(null)
  const hoveredRef = useRef<string>("")

  const selectedList = useMemo(() => [...selectedCountries(selection)], [selection])

  useEffect(() => {
    if (focus && mapRef.current) {
      mapRef.current.flyTo({ center: focus.center, zoom: focus.zoom, duration: 700 })
    }
  }, [focus])

  const onClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feat = e.features?.[0]
      if (!feat) return
      const iso = (feat.properties as { ISO_A2?: string } | null)?.ISO_A2
      if (!iso || iso === "-99") return
      if (!getCountry(iso)) return
      onToggleCountry(iso)
    },
    [onToggleCountry],
  )

  const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const feat = e.features?.[0]
    const iso = (feat?.properties as { ISO_A2?: string } | null)?.ISO_A2 ?? ""
    if (iso === hoveredRef.current) return
    hoveredRef.current = iso
    if (map.getLayer("countries-hover")) {
      map.setFilter("countries-hover", ["==", ["get", "ISO_A2"], iso])
    }
    map.getCanvas().style.cursor = iso ? "pointer" : ""
  }, [])

  const onMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    hoveredRef.current = ""
    if (map.getLayer("countries-hover")) {
      map.setFilter("countries-hover", ["==", ["get", "ISO_A2"], ""])
    }
    map.getCanvas().style.cursor = ""
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border border-[rgba(55,50,47,0.12)] bg-[#F0ECE6]">
      <MapLibreMap
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        mapStyle={MAP_STYLE}
        interactiveLayerIds={data ? ["countries-fill"] : []}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        attributionControl={false}
      >
        {data && (
          <Source id="countries" type="geojson" data={data}>
            <Layer {...fillLayer(selectedList)} />
            <Layer {...HOVER_LAYER} />
            <Layer {...BORDER_LAYER} />
          </Source>
        )}
      </MapLibreMap>
      {loading && <MapBadge>Loading countries…</MapBadge>}
      {error && <MapBadge tone="error">{error}</MapBadge>}
      <Legend selectedCount={selectedList.length} />
    </div>
  )
}

function MapBadge({ children, tone }: { children: React.ReactNode; tone?: "error" }): React.JSX.Element {
  return (
    <div
      className={`absolute top-2 left-2 rounded-md border px-2 py-1 text-[10px] font-medium shadow-sm ${
        tone === "error"
          ? "bg-red-50 border-red-200 text-red-700"
          : "bg-white/95 border-[rgba(55,50,47,0.16)] text-[#37322F]"
      }`}
    >
      {children}
    </div>
  )
}

function Legend({ selectedCount }: { selectedCount: number }): React.JSX.Element {
  return (
    <div className="absolute bottom-2 right-2 rounded-md border border-[rgba(55,50,47,0.16)] bg-white/95 px-2.5 py-1.5 text-[10px] text-[#37322F] shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className="inline-block size-2 rounded-sm bg-[#37322F]/55" />
        <span>{selectedCount === 0 ? "Click a country to target" : `${selectedCount} ${selectedCount === 1 ? "country" : "countries"} targeted`}</span>
      </div>
    </div>
  )
}

