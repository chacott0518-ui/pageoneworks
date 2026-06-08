// lib/admin/dates.ts

export function getKstTodayStartISO() {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET_MS)
  kstNow.setUTCHours(0, 0, 0, 0)
  return new Date(kstNow.getTime() - KST_OFFSET_MS).toISOString()
}

export function getKstYesterdayStartISO() {
  const today = new Date(getKstTodayStartISO())
  return new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString()
}
