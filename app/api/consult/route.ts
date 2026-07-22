import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── 필드별 최대 길이 ────────────────────────────────────────────
const MAX_LEN: Record<string, number> = {
  name: 60, company: 100, phone: 30, industry: 80,
  helpType: 100, preferredTime: 100, website: 300, message: 2000,
  sourcePage: 500, referrer: 500,
  utmSource: 150, utmMedium: 150, utmCampaign: 150,
};

function truncate(val: unknown, key: string): string {
  if (typeof val !== 'string') return '';
  const limit = MAX_LEN[key] ?? 500;
  return val.trim().slice(0, limit);
}

// ── 요청 크기 제한 (약 16 KB) ────────────────────────────────────
const MAX_BODY_BYTES = 16_384;

export async function POST(request: NextRequest) {
  // Content-Type 확인
  const ct = request.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    return NextResponse.json(
      { error: '지원하지 않는 요청 형식입니다.' },
      { status: 415 }
    );
  }

  // 요청 크기 확인
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: '요청이 너무 큽니다.' }, { status: 413 });
  }

  // JSON 파싱
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: '요청이 너무 큽니다.' }, { status: 413 });
    }
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: '요청 본문을 읽을 수 없습니다.' }, { status: 400 });
  }

  // 환경변수 확인
  const gasUrl = process.env.GOOGLE_APPS_SCRIPT_CONSULT_URL;
  if (!gasUrl || !gasUrl.trim()) {
    console.error(
      '[consult] 서버 설정 오류: GOOGLE_APPS_SCRIPT_CONSULT_URL 환경변수가 비어 있거나 없습니다. Vercel/로컬 .env에 Apps Script Web App URL을 설정하세요.'
    );
    return NextResponse.json(
      { error: '서버 설정 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    );
  }

  // 허니팟 확인 — 값이 있으면 봇으로 간주, 외부 전송 없이 성공 응답
  if (typeof body.companyWebsiteFax === 'string' && body.companyWebsiteFax.trim() !== '') {
    return NextResponse.json({ ok: true, accepted: true });
  }

  // 필수 필드 검증
  const name     = truncate(body.name, 'name');
  const company  = truncate(body.company, 'company');
  const phone    = truncate(body.phone, 'phone');
  const industry = truncate(body.industry, 'industry');
  const privacyConsent = body.privacyConsent;

  const missing: string[] = [];
  if (!name)    missing.push('name');
  if (!company) missing.push('company');
  if (!phone)   missing.push('phone');
  if (!industry) missing.push('industry');
  if (privacyConsent !== true) missing.push('privacyConsent');

  if (missing.length > 0) {
    return NextResponse.json(
      { error: '필수 항목이 누락되었습니다.', fields: missing },
      { status: 400 }
    );
  }

  // 선택 필드 — Apps Script 필드명으로 매핑
  const help        = truncate(body.helpType, 'helpType');        // helpType → help
  const contactTime = truncate(body.preferredTime, 'preferredTime'); // preferredTime → contactTime
  const website     = truncate(body.website, 'website');
  const message     = truncate(body.message, 'message');
  const source      = truncate(body.sourcePage, 'sourcePage');    // sourcePage → source

  // Apps Script 전송 payload — 실제 doPost가 사용하는 필드명만
  const gasPayload = {
    name,
    company,
    phone,
    industry,
    help,
    contactTime,
    website,
    message,
    source,
  };

  // Google Apps Script로 서버 대 서버 전송 (application/json)
  let gasResponse: Response;
  try {
    gasResponse = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'User-Agent': 'PAGEONEWORKS-Server/1.0',
      },
      body: JSON.stringify(gasPayload),
      cache: 'no-store',
      redirect: 'follow',
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError';
    console.error('[consult] Apps Script 요청 실패:', isTimeout ? 'timeout' : 'network error');
    return NextResponse.json(
      { error: '접수 요청 전달 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 502 }
    );
  }

  // Apps Script 응답 확인 — result === 'success' 만 성공
  let gasResult: unknown;
  try {
    const text = await gasResponse.text();
    gasResult = JSON.parse(text);
  } catch {
    console.error('[consult] Apps Script 응답 JSON 파싱 실패, status:', gasResponse.status);
    return NextResponse.json(
      { error: '접수 요청 전달 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 502 }
    );
  }

  const isSuccess =
    gasResponse.ok &&
    typeof gasResult === 'object' &&
    gasResult !== null &&
    (gasResult as Record<string, unknown>).result === 'success';

  if (!isSuccess) {
    console.error('[consult] Apps Script 성공 응답 아님, status:', gasResponse.status);
    return NextResponse.json(
      { error: '접수 요청 전달 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    accepted: true,
    message: '상담 신청이 정상적으로 전달되었습니다.',
  });
}
