// components/community/utils.ts

export function getKstTodayStartISO() {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET_MS)
  kstNow.setUTCHours(0, 0, 0, 0)
  const utcAtKstMidnight = new Date(kstNow.getTime() - KST_OFFSET_MS)
  return utcAtKstMidnight.toISOString()
}

export function timeAgoKorean(iso: string) {
  const diffSec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (diffSec < 60) return '방금'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분전`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간전`
  return `${Math.floor(diffSec / 86400)}일전`
}

export function levelLabel(level: number) {
  if (level >= 10) return { short: '전문가', emoji: '✦' }
  if (level >= 7) return { short: '숲', emoji: '✦' }
  if (level >= 5) return { short: '나무', emoji: '✦' }
  if (level >= 3) return { short: '새싹', emoji: '✦' }
  return { short: '시드', emoji: '✦' }
}

export function parseSort(v: string | null | undefined): 'latest' | 'popular' | 'comment' {
  if (v === 'popular' || v === 'comment') return v
  return 'latest'
}

export function parsePage(v: string | null | undefined) {
  const n = Number(v ?? '1')
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}
