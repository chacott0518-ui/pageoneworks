// components/community/WriteForm.tsx

'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { COMMUNITY_CATEGORIES } from './constants'
import ImageUploader from './ImageUploader'
import { MobileTabBar } from './MobileTabBar'

const BG = '#0d0d0f'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'
const GOLD = '#C9A96E'
const CARD_BG = 'rgba(255,255,255,0.03)'
const CARD_BORDER = '0.5px solid rgba(255,255,255,0.06)'

const WRITE_CATEGORIES = COMMUNITY_CATEGORIES.filter((c) => c.slug !== 'all')

export default function WriteForm({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [category, setCategory] = useState(WRITE_CATEGORIES[0]?.slug ?? '자유게시판')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const addTagsFromInput = () => {
    const parts = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    if (!parts.length) return
    const merged = [...tags]
    for (const p of parts) {
      if (merged.length >= 5) break
      if (!merged.includes(p)) merged.push(p)
    }
    setTags(merged)
    setTagInput('')
  }

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag))

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || submitting) return
    setSubmitting(true)
    setError('')

    const payload: Record<string, unknown> = {
      user_id: userId,
      category_slug: category,
      title: title.trim(),
      content: content.trim(),
      tags: tags.length ? tags : null,
      is_anonymous: isAnonymous,
    }
    if (images.length) payload.images = images

    const { data, error: insertError } = await supabase
      .from('community_posts')
      .insert(payload)
      .select('id')
      .single()

    setSubmitting(false)
    if (insertError || !data) {
      setError(insertError?.message ?? '게시글 등록에 실패했습니다.')
      return
    }
    router.push(`/community/${data.id}`)
  }

  const handleWrite = () => router.push('/community/write')

  return (
    <div style={{ background: BG, minHeight: '100vh', paddingBottom: '72px' }} className="community-write-root">
      <main style={{ paddingTop: '60px', fontFamily: 'Inter, Pretendard, sans-serif' }}>
        <div className="community-write-container" style={{ maxWidth: '720px', margin: '0 auto', padding: '24px 16px' }}>
          <button
            type="button"
            onClick={() => router.push('/community')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: SUB,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: '16px',
              minHeight: '44px',
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            커뮤니티로
          </button>

          <h1 style={{ fontSize: '20px', fontWeight: 500, color: TEXT, margin: '0 0 24px' }}>
            새 글 작성
          </h1>

          <div
            style={{
              background: CARD_BG,
              border: CARD_BORDER,
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: TEXT }}>카테고리</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  minHeight: '44px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: CARD_BORDER,
                  background: 'rgba(255,255,255,0.04)',
                  color: TEXT,
                  fontSize: '14px',
                  fontWeight: 400,
                  outline: 'none',
                }}
              >
                {WRITE_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug} style={{ background: '#141416' }}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: TEXT }}>제목</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                placeholder="제목을 입력하세요"
                maxLength={100}
                style={{
                  minHeight: '44px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: CARD_BORDER,
                  background: 'rgba(255,255,255,0.04)',
                  color: TEXT,
                  fontSize: '14px',
                  fontWeight: 400,
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 400, color: META, textAlign: 'right' }}>
                {title.length}/100
              </span>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: TEXT }}>본문</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, 5000))}
                placeholder="내용을 입력하세요"
                rows={12}
                maxLength={5000}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: CARD_BORDER,
                  background: 'rgba(255,255,255,0.04)',
                  color: TEXT,
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.8,
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: '11px', fontWeight: 400, color: META, textAlign: 'right' }}>
                {content.length}/5000
              </span>
            </label>

            <ImageUploader value={images} onChange={setImages} />

            <div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: TEXT, display: 'block', marginBottom: '8px' }}>
                태그 (쉼표 구분, 최대 5개)
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTagsFromInput()
                    }
                  }}
                  placeholder="예: 부동산, 투자"
                  style={{
                    flex: 1,
                    minHeight: '44px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: CARD_BORDER,
                    background: 'rgba(255,255,255,0.04)',
                    color: TEXT,
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={addTagsFromInput}
                  disabled={tags.length >= 5}
                  style={{
                    minHeight: '44px',
                    padding: '0 16px',
                    borderRadius: '8px',
                    border: CARD_BORDER,
                    background: 'transparent',
                    color: GOLD,
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: tags.length >= 5 ? 'not-allowed' : 'pointer',
                    opacity: tags.length >= 5 ? 0.4 : 1,
                  }}
                >
                  추가
                </button>
              </div>
              {tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        background: 'rgba(201,169,110,0.10)',
                        border: CARD_BORDER,
                        fontSize: '11px',
                        fontWeight: 500,
                        color: GOLD,
                      }}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: SUB,
                          cursor: 'pointer',
                          padding: 0,
                          minHeight: '24px',
                          minWidth: '24px',
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '44px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 400,
                color: TEXT,
              }}
            >
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: GOLD }}
              />
              익명으로 게시
            </label>

            {error && (
              <p style={{ fontSize: '12px', fontWeight: 400, color: '#FC8181', margin: 0 }}>{error}</p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || submitting}
              style={{
                minHeight: '44px',
                width: '100%',
                borderRadius: '8px',
                border: 'none',
                background: GOLD,
                color: BG,
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                opacity: !title.trim() || !content.trim() || submitting ? 0.4 : 1,
              }}
            >
              {submitting ? '게시 중...' : '게시하기'}
            </button>
          </div>
        </div>
      </main>

      <MobileTabBar onWrite={handleWrite} />

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .community-write-root { padding-bottom: 72px !important; }
          .community-write-container { padding: 16px !important; }
        }
      `}} />
    </div>
  )
}
