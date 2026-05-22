import { prisma } from "@/lib/prisma"

export interface DailyPoint {
  date: string
  spendUsdCents: number
  impressions: number
  clicks: number
  walletConnects: number
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function fillRange(rawRows: DailyPoint[], from: Date, to: Date): DailyPoint[] {
  const map = new Map(rawRows.map((r) => [r.date, r]))
  const out: DailyPoint[] = []
  const cursor = new Date(from)
  cursor.setUTCHours(0, 0, 0, 0)
  const end = new Date(to)
  end.setUTCHours(0, 0, 0, 0)
  while (cursor <= end) {
    const key = isoDate(cursor)
    out.push(
      map.get(key) ?? {
        date: key,
        spendUsdCents: 0,
        impressions: 0,
        clicks: 0,
        walletConnects: 0,
      },
    )
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return out
}

export async function fetchAdvertiserDailySeries(
  advertiserId: string,
  since: Date,
): Promise<DailyPoint[]> {
  const grouped = await prisma.metricDaily.groupBy({
    by: ["date"],
    where: { campaign: { advertiserId }, date: { gte: since } },
    _sum: {
      spendUsdCents: true,
      impressions: true,
      clicks: true,
      walletConnects: true,
    },
    orderBy: { date: "asc" },
  })
  const rows: DailyPoint[] = grouped.map((g) => ({
    date: isoDate(g.date),
    spendUsdCents: g._sum.spendUsdCents ?? 0,
    impressions: g._sum.impressions ?? 0,
    clicks: g._sum.clicks ?? 0,
    walletConnects: g._sum.walletConnects ?? 0,
  }))
  return fillRange(rows, since, new Date())
}
