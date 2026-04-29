import type { MetricDaily } from "@prisma/client"

export async function listMetrics(
  campaignId: string,
  days = 30,
): Promise<{ metrics: MetricDaily[] }> {
  const res = await fetch(`/api/campaigns/${campaignId}/metrics?days=${days}`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to load metrics")
  return res.json()
}
