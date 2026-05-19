const INDEXNOW_HOST = 'www.pageoneworks.com'

export async function notifyIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    console.warn('[IndexNow] INDEXNOW_KEY 없음 — 빙 자동 제출 스킵')
    return
  }

  // 100개씩 나눠서 전송
  const chunks: string[][] = []
  for (let i = 0; i < urls.length; i += 100) {
    chunks.push(urls.slice(i, i + 100))
  }

  for (const chunk of chunks) {
    try {
      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: INDEXNOW_HOST,
          key,
          keyLocation: `https://${INDEXNOW_HOST}/${key}.txt`,
          urlList: chunk,
        }),
      })
      console.log(`[IndexNow] 제출 완료 — ${chunk.length}개, 상태: ${res.status}`)
    } catch (e) {
      console.error('[IndexNow] 제출 실패:', e)
    }
  }
}