import { NextResponse } from 'next/server';
import { articles } from '@/lib/data';
import { searchHomeArticles, HOME_SEARCH_RESULT_LIMIT } from '@/lib/home-search';

/**
 * GET /api/home-search?q=
 * 홈 검색 섹션 전용 — 최대 HOME_SEARCH_RESULT_LIMIT건, 검색어 저장 없음.
 * 응답은 body를 제외한 경량 필드만 포함한다.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').replace(/\s+/g, ' ').trim();

  if (!q) {
    return NextResponse.json(
      { results: [] },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  try {
    const results = searchHomeArticles(q, articles).slice(0, HOME_SEARCH_RESULT_LIMIT);
    return NextResponse.json(
      { results },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  } catch {
    return NextResponse.json(
      { error: 'search_failed' },
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }
}
