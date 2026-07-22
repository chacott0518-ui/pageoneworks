import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'AI 에디터 기능을 업데이트하고 있습니다.' },
    { status: 503 },
  )
}

export async function GET() {
  return NextResponse.json({
    status: 'unavailable',
    service: 'PAGEONEWORKS AI Q&A',
    message: 'AI 에디터 기능을 업데이트하고 있습니다.',
  })
}
