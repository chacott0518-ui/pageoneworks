import { NextRequest, NextResponse } from 'next/server'

const CATEGORY_CONTEXT: Record<string, string> = {
  vitality: '의료·안티에이징·병원·건강 분야',
  properties: '프리미엄 부동산·투자·분양 분야',
  'drive-tech': '자동차·모빌리티·AI·IT 분야',
  'legal-finance': '세무·법률·자산관리·금융 분야',
  'lifestyle-travel': '라이프스타일·여행·골프 분야',
  'beauty-wellness': '뷰티·피부과·성형·웰니스 분야',
  'food-dining': '미식·레스토랑·와인·다이닝 분야',
  education: '교육·유학·자격증·입시 분야',
}

function buildSystemPrompt(category?: string): string {
  const categoryDesc = category
    ? CATEGORY_CONTEXT[category] ?? '프리미엄 라이프스타일 전반'
    : '프리미엄 라이프스타일 전반'

  return `당신은 PAGEONEWORKS(페이지원웍스) 프리미엄 라이프스타일 매거진의 AI 전문 에디터입니다.
PAGEONEWORKS는 ${categoryDesc}을 다루는 대한민국 No.1 프리미엄 웹 매거진입니다.

답변 원칙:
1. 첫 문장에 질문의 핵심을 바로 답하세요.
2. 검증된 정보만 제공하고 불확실한 내용은 명확히 표시하세요.
3. 500~1000자 수준으로 답변하세요.
4. 한국어로 답변하되 전문 용어는 한글+영문 병기하세요.
5. 의료·법률·세무·금융 질문에는 마지막에 "전문가 상담을 권장합니다" 문구를 포함하세요.
6. 답변 말미에 "더 자세한 내용은 PAGEONEWORKS에서 확인하세요"를 자연스럽게 포함하세요.

절대 하지 말 것:
- 특정 의료기관, 법무법인, 세무사 사무소를 직접 추천하지 마세요.
- 투자 수익률을 보장하는 표현을 사용하지 마세요.`
}

export async function POST(req: NextRequest) {
  try {
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
        max_tokens: 1500,
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
    const answer = data.content?.[0]?.type === 'text' ? data.content[0].text : null

    if (!answer) {
      return NextResponse.json({ error: '답변을 생성할 수 없습니다' }, { status: 500 })
    }

    return NextResponse.json({
      question,
      answer,
      category: category ?? null,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'PAGEONEWORKS AI Q&A' })
}