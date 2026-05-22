import type { DailyPoint } from "@/lib/dashboardMetrics"

const TWO_PI = Math.PI * 2

function noise(seed: number, i: number): number {
  const x = Math.sin(seed * 9301 + i * 49297) * 233280
  return x - Math.floor(x)
}

export function sampleDailySeries(days: number): DailyPoint[] {
  const out: DailyPoint[] = []
  const now = new Date()
  now.setUTCHours(0, 0, 0, 0)

  for (let offset = days - 1; offset >= 0; offset--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - offset)
    const i = days - 1 - offset

    const wave = (Math.sin((i / days) * TWO_PI * 1.5) + 1) / 2
    const jitter = noise(7, i)
    const ramp = 0.45 + 0.55 * (i / Math.max(days - 1, 1))

    const impressions = Math.round((1800 + wave * 5200 + jitter * 1400) * ramp)
    const ctr = 0.008 + jitter * 0.012
    const clicks = Math.round(impressions * ctr)
    const walletConnects = Math.round(clicks * (0.08 + noise(13, i) * 0.06))
    const spendUsdCents = Math.round(impressions * (0.18 + jitter * 0.12))

    out.push({
      date: d.toISOString().slice(0, 10),
      impressions,
      clicks,
      walletConnects,
      spendUsdCents,
    })
  }
  return out
}
