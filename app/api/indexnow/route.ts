import { NextResponse } from 'next/server';
import { articles } from '@/lib/data';

const KEY = process.env.INDEXNOW_KEY ?? '';
const SECRET = process.env.DEPLOY_SECRET ?? '';
const BASE = 'https://www.pageoneworks.com';

export async function POST(request: Request) {
  // 보안 체크 — DEPLOY_SECRET이 맞아야만 실행
  const auth = request.headers.get('authorization');
  if (!SECRET || auth !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!KEY) {
    return NextResponse.json({ error: 'INDEXNOW_KEY not configured' }, { status: 500 });
  }

  // 최신 15개 아티클 + 주요 페이지
  const articleUrls = articles
    .slice(0, 15)
    .map((a) => `${BASE}/article/${a.slug}`);

  const staticUrls = [
    BASE,
    `${BASE}/archive`,
    `${BASE}/category/legal-finance`,
    `${BASE}/category/properties`,
    `${BASE}/category/vitality`,
    `${BASE}/category/beauty-wellness`,
    `${BASE}/category/drive-tech`,
    `${BASE}/category/lifestyle-travel`,
    `${BASE}/category/food-dining`,
    `${BASE}/category/education`,
  ];

  const urlList = [...articleUrls, ...staticUrls];

  // Bing IndexNow API 호출
  const payload = {
    host: 'www.pageoneworks.com',
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList,
  };

  let bingStatus = 0;
  let bingOk = false;

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });
    bingStatus = res.status;
    // 200 또는 202면 성공
    bingOk = bingStatus === 200 || bingStatus === 202;
  } catch (err) {
    return NextResponse.json(
      { error: 'Bing API call failed', detail: String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: bingOk,
    bingStatus,
    submittedCount: urlList.length,
    urls: urlList,
    timestamp: new Date().toISOString(),
  });
}

// GET: 키 설정 확인용 (브라우저에서 /api/indexnow 접속 시)
export async function GET() {
  return NextResponse.json({
    route: '/api/indexnow',
    keyConfigured: KEY ? `✅ ${KEY.slice(0, 8)}...` : '❌ 미설정',
    secretConfigured: SECRET ? '✅ 설정됨' : '❌ 미설정',
    usage: 'POST with Authorization: Bearer <DEPLOY_SECRET>',
  });
}