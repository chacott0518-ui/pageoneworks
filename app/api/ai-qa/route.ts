import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site.config'

const ipCallMap = new Map<string, { count: number; date: string }>()

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function isRateLimited(ip: string): boolean {
  const today = getToday()
  const record = ipCallMap.get(ip)
  if (!record || record.date !== today) {
    ipCallMap.set(ip, { count: 1, date: today })
    return false
  }
  if (record.count >= 1) return true
  record.count++
  return false
}

const CATEGORY_CONTEXT: Record<string, string> = {
  vitality: '의료·안티에이징·병원·건강·줄기세포·항노화 분야',
  properties: '프리미엄 부동산·청약·투자·재건축·분양 분야',
  'drive-tech': '자동차·모빌리티·AI·IT·반도체·스타트업 분야',
  'legal-finance': '세무·법률·자산관리·금융·투자·절세 분야',
  'lifestyle-travel': '라이프스타일·여행·골프·럭셔리·명품 분야',
  'beauty-wellness': '뷰티·피부과·성형·웰니스·스파 분야',
  'food-dining': '미식·미쉐린·레스토랑·와인·오마카세 분야',
  education: '교육·유학·입시·자격증·MBA 분야',
  'sports-health': '스포츠·운동·피트니스·헬스·아웃도어 분야',
  'culture-art': '문화·예술·미술·공연·전시·컬렉션 분야',
  'pet-family': '반려동물·육아·가족·홈라이프 분야',
  'global-trend': '글로벌 트렌드·해외 이슈·국제 비즈니스 분야',
}

function buildSystemPrompt(category?: string): string {
  const categoryDesc = category
    ? CATEGORY_CONTEXT[category] ?? '프리미엄 라이프스타일 전반'
    : '프리미엄 라이프스타일 전반'

  return `당신은 PAGEONEWORKS(페이지원웍스) 프리미엄 라이프스타일 매거진의 AI 전문 에디터입니다.
${siteConfig.name}는 ${categoryDesc}을 다루는 프리미엄 웹 매거진입니다.

반드시 아래 구조와 규칙을 따르세요.

[답변 구조]

## 핵심 답변
질문에 대한 직접 답변을 3~4문장으로 명확하게 작성. 구체적 수치 포함.

## 상세 분석
배경, 원인, 현황을 구체적 수치와 사례 포함하여 최소 5개 항목으로 상세히 설명. 각 항목 2~3문장 이상.

## 실전 가이드
단계별 실행 방법, 구체적 수치, 체크리스트를 최소 5단계 이상 작성. 각 단계 2문장 이상.

## 전문가 조언
업계 관행, 흔한 실수, 숨겨진 팁, 비용 정보를 3~5개 항목으로 상세히 작성.

## 자주 묻는 질문
관련 Q&A 2~3개를 Q: A: 형식으로 작성. 각 답변 2~3문장 이상.

## 결론 및 추천
핵심 요약 2~3문장. 마지막에 "더 자세한 내용은 PAGEONEWORKS에서 확인하세요."

[필수 규칙]
1. 전체 답변 반드시 2000자 이상. 절대 짧게 답변하지 말 것.
2. 각 섹션 최소 200자 이상.
3. 가격, 비율, 기간, 횟수 등 수치를 최대한 포함.
4. 의료, 법률, 금융, 세무 답변은 마지막에 반드시 "전문가 상담을 권장합니다" 포함.
5. 특정 업체 직접 추천 금지.
6. 투자 수익 보장 표현 금지.`
}

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'AI 질문은 하루 1회만 가능합니다. 내일 다시 이용해 주세요.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { question, category } = body as {
      question: string
      category?: string
    }

    if (!question || question.trim().length < 5) {
      return NextResponse.json(
        { error: '질문을 입력해 주세요 (최소 5자)' },
        { status: 400 }
      )
    }

    if (question.length > 500) {
      return NextResponse.json(
        { error: '질문은 500자 이내로 입력해 주세요' },
        { status: 400 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI 서비스가 준비 중입니다' },
        { status: 503 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: buildSystemPrompt(category),
        messages: [{ role: 'user', content: question }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: '답변 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const answer =
      data.content?.[0]?.type === 'text' ? data.content[0].text : null

    if (!answer) {
      return NextResponse.json(
        { error: '답변을 생성할 수 없습니다' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      question,
      answer,
      category: category ?? null,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'PAGEONEWORKS AI Q&A' })
}