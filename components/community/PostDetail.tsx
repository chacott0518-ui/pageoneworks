// components/community/PostDetail.tsx

'use client'

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { MobileTabBar } from './MobileTabBar'
import { timeAgoKorean, levelLabel } from './utils'
import type { TrendingPost } from './types'
import { ArrowLeft } from 'lucide-react'

const BG = '#0d0d0f'
const TEXT = 'rgba(255,255,255,0.82)'
const SUB = 'rgba(255,255,255,0.4)'
const META = 'rgba(255,255,255,0.25)'
const GOLD = '#C9A96E'
const CARD_BG = 'rgba(255,255,255,0.03)'
const CARD_BORDER = '0.5px solid rgba(255,255,255,0.06)'
const VIEW_CACHE_MS = 60 * 60 * 1000

export type PostDetailData = {
  id: string
  user_id: string | null
  title: string
  content: string
  category_slug: string
  tags?: string[] | null
  images?: string[] | null
  is_anonymous?: boolean | null
  view_count: number | null
  like_count: number | null
  comment_count: number | null
  created_at: string
  profiles: { nickname: string; level: number; avatar_url: string | null } | null
}

export type RelatedPostItem = {
  id: string
  title: string
  category_slug: string
  view_count: number | null
}

type Comment = {
  id: string
  user_id: string
  content: string
  is_anonymous: boolean
  created_at: string
  parent_id: string | null
  profiles: { nickname: string; level: number; avatar_url: string | null } | null
  replies?: Comment[]
}

const REACTIONS = [
  { key: 'like', label: '👍좋아요' },
  { key: 'empathy', label: '🔥공감' },
  { key: 'insight', label: '💡인사이트' },
  { key: 'wow', label: '😮놀라워' },
  { key: 'sad', label: '😢슬퍼요' },
] as const

type ReactionKey = (typeof REACTIONS)[number]['key']

const POST_DETAIL_CSS = `
@media (max-width: 768px) {
  .post-detail-root { padding-bottom: 72px !important; }
  .post-detail-container { padding: 16px !important; }
  .post-detail-layout { flex-direction: column !important; }
  .post-detail-main { flex: 1 1 100% !important; width: 100% !important; }
  .post-detail-sidebar { flex: 1 1 100% !important; max-width: 100% !important; width: 100% !important; }
  .post-detail-card { padding: 16px !important; }
  .post-detail-title { font-size: 20px !important; }
  .post-detail-body { font-size: 13px !important; }
  .post-detail-meta { font-size: 10px !important; }
}
@media (min-width: 769px) {
  .post-detail-root { padding-bottom: 0 !important; }
}
`

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function AvatarInitial({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(201,169,110,0.12)',
        border: '0.5px solid rgba(201,169,110,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size <= 28 ? '11px' : '13px',
        fontWeight: 500,
        color: GOLD,
        flexShrink: 0,
      }}
    >
      {name?.[0] ?? '?'}
    </div>
  )
}

function CommentSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        background: CARD_BG,
        border: CARD_BORDER,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: '80px', height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
          <div style={{ width: '100%', height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
    </div>
  )
}

export default function PostDetail({
  postId,
  initialPost,
  relatedPosts,
  trendingPosts,
}: {
  postId: string
  initialPost: PostDetailData
  relatedPosts: RelatedPostItem[]
  trendingPosts: TrendingPost[]
}) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [post] = useState<PostDetailData>(initialPost)
  const [viewCount, setViewCount] = useState(initialPost.view_count ?? 0)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(true)
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({})
  const [myReaction, setMyReaction] = useState<ReactionKey | null>(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)

  const authorName = post.is_anonymous ? '익명' : post.profiles?.nickname ?? '회원'
  const lv = levelLabel(post.profiles?.level ?? 1)

  const loadReactions = useCallback(async (userId?: string) => {
    const { data } = await supabase
      .from('post_reactions')
      .select('reaction_type, user_id')
      .eq('post_id', postId)

    const counts: Record<string, number> = {}
    let mine: ReactionKey | null = null
    for (const row of data ?? []) {
      const type = row.reaction_type as string
      counts[type] = (counts[type] ?? 0) + 1
      if (userId && row.user_id === userId) mine = type as ReactionKey
    }
    setReactionCounts(counts)
    setMyReaction(mine)
  }, [postId, supabase])

  const loadBookmark = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from('bookmarks')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle()
      setBookmarked(Boolean(data))
    },
    [postId, supabase]
  )

  const loadComments = useCallback(async () => {
    setLoadingComments(true)
    const { data } = await supabase
      .from('community_comments')
      .select('id, content, user_id, parent_id, created_at, is_anonymous, profiles(nickname, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (data) {
      const top = data.filter((c) => !c.parent_id)
      const withReplies = top.map((c) => ({
        ...c,
        replies: data.filter((r) => r.parent_id === c.id),
      }))
      setComments(withReplies as unknown as Comment[])
    }
    setLoadingComments(false)
  }, [postId, supabase])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUser({ id: user.id })
        void loadReactions(user.id)
        void loadBookmark(user.id)
      } else {
        void loadReactions()
      }
    })
    void loadComments()
  }, [loadBookmark, loadComments, loadReactions, supabase])

  useEffect(() => {
    const key = `community_view_${postId}`
    const raw = localStorage.getItem(key)
    const now = Date.now()
    if (raw) {
      const ts = Number(raw)
      if (Number.isFinite(ts) && now - ts < VIEW_CACHE_MS) return
    }

    setViewCount((v) => v + 1)
    localStorage.setItem(key, String(now))
    fetch(`/api/community/views/${postId}`, { method: 'POST' }).catch(() => {})
  }, [postId])

  const handleReaction = async (type: ReactionKey) => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    setSubmitting(true)
    if (myReaction === type) {
      await supabase
        .from('post_reactions')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('post_id', postId)
        .eq('reaction_type', type)
    } else {
      if (myReaction) {
        await supabase.from('post_reactions').delete().eq('user_id', currentUser.id).eq('post_id', postId)
      }
      await supabase.from('post_reactions').insert({
        user_id: currentUser.id,
        post_id: postId,
        reaction_type: type,
      })
    }
    await loadReactions(currentUser.id)
    setSubmitting(false)
  }

  const handleBookmark = async () => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    setSubmitting(true)
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', currentUser.id).eq('post_id', postId)
      setBookmarked(false)
    } else {
      await supabase.from('bookmarks').insert({ user_id: currentUser.id, post_id: postId })
      setBookmarked(true)
    }
    setSubmitting(false)
  }

  const handleReport = async () => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    if (!confirm('이 글을 신고하시겠습니까?')) return
    setSubmitting(true)
    const { error } = await supabase.from('reports').insert({
      user_id: currentUser.id,
      post_id: postId,
      reason: 'user_report',
    })
    setSubmitting(false)
    if (error) alert('신고 처리 중 오류가 발생했습니다.')
    else alert('신고가 접수되었습니다.')
  }

  const handleComment = async () => {
    if (!currentUser || !commentText.trim() || submitting) return
    setSubmitting(true)
    const { error } = await supabase.from('community_comments').insert({
      post_id: postId,
      user_id: currentUser.id,
      content: commentText.trim(),
      is_anonymous: false,
    })
    if (!error) {
      setCommentText('')
      await loadComments()
    }
    setSubmitting(false)
  }

  const handleReply = async (parentId: string) => {
    if (!currentUser || !replyText[parentId]?.trim() || submitting) return
    setSubmitting(true)
    await supabase.from('community_comments').insert({
      post_id: postId,
      user_id: currentUser.id,
      content: replyText[parentId].trim(),
      parent_id: parentId,
      is_anonymous: false,
    })
    setReplyText((prev) => ({ ...prev, [parentId]: '' }))
    setReplyOpen((prev) => ({ ...prev, [parentId]: false }))
    await loadComments()
    setSubmitting(false)
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser || submitting) return
    if (!confirm('댓글을 삭제할까요?')) return
    setSubmitting(true)
    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', currentUser.id)
    if (!error) await loadComments()
    setSubmitting(false)
  }

  const handleWrite = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) router.push('/community/write')
    else router.push('/login')
  }

  const totalComments = comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)

  return (
    <div style={{ background: BG, minHeight: '100vh', paddingBottom: '72px' }} className="post-detail-root">
      <Header />

      <main style={{ paddingTop: '60px', fontFamily: 'Inter, Pretendard, sans-serif' }}>
        <div className="post-detail-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
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
            커뮤니티로 돌아가기
          </button>

          <div className="post-detail-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div className="post-detail-main" style={{ flex: '1 1 70%', minWidth: 0 }}>
              <article
                className="post-detail-card"
                style={{
                  background: CARD_BG,
                  border: CARD_BORDER,
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '10px',
                    fontWeight: 500,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    color: TEXT,
                    marginBottom: '12px',
                  }}
                >
                  {post.category_slug}
                </span>

                <h1
                  className="post-detail-title speakable-summary"
                  style={{
                    fontSize: '22px',
                    fontWeight: 500,
                    color: TEXT,
                    lineHeight: 1.4,
                    margin: '0 0 12px',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {post.title}
                </h1>

                <div
                  className="post-detail-meta"
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: META,
                    marginBottom: '24px',
                  }}
                >
                  <span>{authorName}</span>
                  <span>·</span>
                  <span>{formatDate(post.created_at)}</span>
                  <span>·</span>
                  <span>조회 {viewCount.toLocaleString()}</span>
                </div>

                <div
                  className="post-detail-body"
                  style={{
                    fontSize: '15px',
                    fontWeight: 400,
                    color: TEXT,
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    marginBottom: '24px',
                  }}
                >
                  {post.content}
                </div>

                {post.images && post.images.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                    {post.images.map((src, i) => (
                      <div
                        key={src}
                        style={{
                          position: 'relative',
                          width: '100%',
                          minHeight: '200px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: CARD_BORDER,
                        }}
                      >
                        <Image
                          src={src}
                          alt={`${post.title} 이미지 ${i + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 70vw"
                          loading="lazy"
                          style={{ objectFit: 'contain', background: 'rgba(0,0,0,0.2)' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {post.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: '11px', fontWeight: 400, color: GOLD }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    paddingTop: '16px',
                    borderTop: CARD_BORDER,
                    marginBottom: '16px',
                  }}
                >
                  {REACTIONS.map((r) => {
                    const active = myReaction === r.key
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => handleReaction(r.key)}
                        disabled={submitting}
                        style={{
                          minHeight: '44px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: active ? `0.5px solid ${GOLD}` : '0.5px solid rgba(255,255,255,0.08)',
                          background: active ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)',
                          color: active ? GOLD : SUB,
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                            e.currentTarget.style.transform = 'translateY(-1px)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }
                        }}
                      >
                        {r.label}
                        {(reactionCounts[r.key] ?? 0) > 0 ? (
                          <span style={{ color: active ? GOLD : SUB }}> {reactionCounts[r.key]}</span>
                        ) : null}
                      </button>
                    )
                  })}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: SUB,
                  }}
                >
                  <ActionTextButton label="공유하기" onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('링크가 복사되었습니다.')
                  }} />
                  <span style={{ color: META }}>·</span>
                  <ActionTextButton
                    label={bookmarked ? '북마크됨' : '북마크'}
                    active={bookmarked}
                    onClick={handleBookmark}
                    disabled={submitting}
                  />
                  <span style={{ color: META }}>·</span>
                  <ActionTextButton label="신고하기" onClick={handleReport} disabled={submitting} />
                </div>
              </article>

              <section style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: TEXT, marginBottom: '12px' }}>
                  댓글 {totalComments}개
                </p>

                <div
                  style={{
                    background: CARD_BG,
                    border: CARD_BORDER,
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  {currentUser ? (
                    <>
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="댓글을 입력하세요"
                        className="post-comment-input"
                        style={{
                          width: '100%',
                          height: '80px',
                          background: 'transparent',
                          border: '0.5px solid rgba(255,255,255,0.06)',
                          borderRadius: '8px',
                          outline: 'none',
                          resize: 'none',
                          fontSize: '14px',
                          fontWeight: 400,
                          color: TEXT,
                          lineHeight: 1.6,
                          marginBottom: '12px',
                          padding: '8px 12px',
                          transition: 'all 150ms ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: META }}>{commentText.length}/500</span>
                        <button
                          type="button"
                          onClick={handleComment}
                          disabled={!commentText.trim() || submitting}
                          style={{
                            minHeight: '44px',
                            padding: '0 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: GOLD,
                            color: BG,
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            opacity: !commentText.trim() || submitting ? 0.4 : 1,
                          }}
                        >
                          등록
                        </button>
                      </div>
                    </>
                  ) : (
                    <p style={{ fontSize: '13px', fontWeight: 400, color: SUB, textAlign: 'center', padding: '8px 0' }}>
                      댓글을 작성하려면{' '}
                      <Link href="/login" style={{ color: GOLD, textDecoration: 'underline' }}>
                        로그인
                      </Link>
                      이 필요합니다
                    </p>
                  )}
                </div>

                {loadingComments ? (
                  <div>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <CommentSkeleton key={i} />
                    ))}
                  </div>
                ) : comments.length === 0 ? (
                  <div
                    style={{
                      background: CARD_BG,
                      border: CARD_BORDER,
                      borderRadius: '8px',
                      padding: '32px',
                      textAlign: 'center',
                      fontSize: '13px',
                      color: SUB,
                    }}
                  >
                    첫 번째 댓글을 작성해보세요
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {comments.map((comment) => (
                      <CommentBlock
                        key={comment.id}
                        comment={comment}
                        currentUserId={currentUser?.id}
                        postAuthorNickname={post.profiles?.nickname}
                        replyOpen={replyOpen[comment.id]}
                        replyText={replyText[comment.id] ?? ''}
                        submitting={submitting}
                        onToggleReply={() =>
                          setReplyOpen((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))
                        }
                        onReplyTextChange={(v) => setReplyText((prev) => ({ ...prev, [comment.id]: v }))}
                        onSubmitReply={() => handleReply(comment.id)}
                        onDeleteComment={handleDeleteComment}
                        hasUser={Boolean(currentUser)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="post-detail-sidebar" style={{ flex: '0 0 30%', minWidth: 0, maxWidth: '320px' }}>
              <SidebarCard title="작성자">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AvatarInitial name={authorName} size={44} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: TEXT, margin: 0 }}>
                      {authorName}
                    </p>
                    <p style={{ fontSize: '11px', fontWeight: 400, color: GOLD, margin: '4px 0 0' }}>
                      {lv.emoji} Lv.{post.profiles?.level ?? 1} {lv.short}
                    </p>
                  </div>
                </div>
              </SidebarCard>

              {relatedPosts.length > 0 && (
                <SidebarCard title="관련글">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {relatedPosts.map((r) => (
                      <Link
                        key={r.id}
                        href={`/community/${r.id}`}
                        style={{ display: 'block', textDecoration: 'none', padding: '8px', borderRadius: '6px' }}
                      >
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: TEXT,
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {r.title}
                        </p>
                        <p style={{ fontSize: '10px', color: META, margin: '4px 0 0' }}>
                          {r.category_slug} · 조회 {(r.view_count ?? 0).toLocaleString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                </SidebarCard>
              )}

              <SidebarCard title="🔥 인기글 TOP5">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {trendingPosts.map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/community/${p.id}`}
                      style={{ display: 'flex', gap: '8px', textDecoration: 'none', padding: '4px 0' }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          color: i === 0 ? GOLD : META,
                          width: '20px',
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: TEXT,
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {p.title}
                        </p>
                        <p style={{ fontSize: '10px', color: META, margin: '2px 0 0' }}>
                          조회 {(p.view_count ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </SidebarCard>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <MobileTabBar onWrite={handleWrite} />
      <style dangerouslySetInnerHTML={{ __html: `${POST_DETAIL_CSS}
@media (max-width: 768px) {
  .post-comment-input { height: 72px !important; }
  .post-reply-input { height: 64px !important; }
}
`}} />
    </div>
  )
}

function ActionTextButton({
  label,
  onClick,
  active,
  disabled,
}: {
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'transparent',
        border: 'none',
        color: active ? GOLD : SUB,
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: '44px',
        padding: '0 8px',
        borderRadius: '4px',
        transition: 'all 150ms ease',
        opacity: disabled ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = SUB
        }
      }}
    >
      {label}
    </button>
  )
}

function SidebarCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      style={{
        background: CARD_BG,
        border: CARD_BORDER,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
      }}
    >
      <p style={{ fontSize: '11px', fontWeight: 500, color: SUB, margin: '0 0 12px' }}>{title}</p>
      {children}
    </div>
  )
}

function CommentBlock({
  comment,
  currentUserId,
  postAuthorNickname,
  replyOpen,
  replyText,
  submitting,
  onToggleReply,
  onReplyTextChange,
  onSubmitReply,
  onDeleteComment,
  hasUser,
  isReply = false,
}: {
  comment: Comment
  currentUserId?: string
  postAuthorNickname?: string
  replyOpen?: boolean
  replyText?: string
  submitting?: boolean
  onToggleReply?: () => void
  onReplyTextChange?: (v: string) => void
  onSubmitReply?: () => void
  onDeleteComment?: (commentId: string) => void
  hasUser?: boolean
  isReply?: boolean
}) {
  const name = comment.is_anonymous ? '익명' : comment.profiles?.nickname ?? '회원'
  const isOwn = currentUserId && comment.user_id === currentUserId
  const isAuthor = postAuthorNickname && comment.profiles?.nickname === postAuthorNickname

  return (
    <div style={{ marginLeft: isReply ? '28px' : 0 }}>
      <div
        style={{
          background: isReply ? 'rgba(255,255,255,0.02)' : 'transparent',
          borderBottom: isReply ? 'none' : CARD_BORDER,
          borderRadius: isReply ? '8px' : 0,
          padding: '12px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <AvatarInitial name={name} size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 500, color: TEXT }}>{name}</span>
              {isAuthor && (
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 500,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(201,169,110,0.10)',
                    color: GOLD,
                  }}
                >
                  작성자
                </span>
              )}
              <span style={{ fontSize: '11px', fontWeight: 400, color: META }}>
                {timeAgoKorean(comment.created_at)}
              </span>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 400, color: TEXT, lineHeight: 1.5, margin: '4px 0 0' }}>
              {comment.content}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              {!isReply && onToggleReply && hasUser && (
                <button
                  type="button"
                  onClick={onToggleReply}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: SUB,
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    minHeight: '44px',
                    padding: 0,
                  }}
                >
                  답글
                </button>
              )}
              {isOwn && onDeleteComment && (
                <button
                  type="button"
                  onClick={() => onDeleteComment(comment.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: META,
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    minHeight: '44px',
                    padding: 0,
                  }}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        </div>

        {replyOpen && hasUser && onReplyTextChange && onSubmitReply && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', paddingLeft: '36px' }}>
            <textarea
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              placeholder="답글 입력..."
              className="post-reply-input"
              style={{
                flex: 1,
                height: '64px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: CARD_BORDER,
                background: 'rgba(255,255,255,0.04)',
                color: TEXT,
                fontSize: '13px',
                outline: 'none',
                resize: 'none',
                transition: 'all 150ms ease',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              }}
            />
            <button
              type="button"
              onClick={onSubmitReply}
              disabled={!replyText?.trim() || submitting}
              style={{
                minHeight: '44px',
                padding: '0 12px',
                borderRadius: '8px',
                border: 'none',
                background: GOLD,
                color: BG,
                fontSize: '11px',
                fontWeight: 500,
                opacity: !replyText?.trim() || submitting ? 0.4 : 1,
                cursor: 'pointer',
              }}
            >
              등록
            </button>
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <div key={reply.id} style={{ marginTop: '8px' }}>
          <CommentBlock
            comment={reply}
            currentUserId={currentUserId}
            postAuthorNickname={postAuthorNickname}
            onDeleteComment={onDeleteComment}
            isReply
          />
        </div>
      ))}
    </div>
  )
}
