'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import {
  Heart, MessageCircle, Share2, ArrowLeft,
  Eye, Bookmark, Flag, MoreHorizontal,
  Image as ImageIcon, X, Send
} from 'lucide-react'

const LEVEL_BADGE: Record<number, string> = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '⭐' }

const CAT_STYLE: Record<string, string> = {
  '부동산·청약': 'bg-emerald-500/15 text-emerald-300',
  '의료·건강':   'bg-red-500/15 text-red-300',
  'IT·테크':    'bg-sky-500/15 text-sky-300',
  '맛집·와인':   'bg-amber-500/15 text-amber-300',
  '자동차':      'bg-blue-500/15 text-blue-300',
  '법률·세금':   'bg-purple-500/15 text-purple-300',
  '자유게시판':  'bg-zinc-500/15 text-zinc-300',
  '공동구매':    'bg-orange-500/15 text-orange-300',
  '정치·시사':   'bg-rose-500/15 text-rose-300',
}

function timeAgo(d: string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 60) return '방금'
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
  return `${Math.floor(s / 86400)}일 전`
}

type Comment = {
  id: string
  content: string
  is_anonymous: boolean
  created_at: string
  parent_id: string | null
  images: string[]
  profiles: { nickname: string; avatar_url: string | null; level: number } | null
  user_id: string
}

export default function PostDetail({ post, currentUser }: { post: any; currentUser: any }) {
  const supabase = createClient()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [loginOpen, setLoginOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const catStyle = CAT_STYLE[post.category_slug] ?? 'bg-white/8 text-white/50'

  // 좋아요 여부 확인
  useEffect(() => {
    if (!currentUser) return
    supabase
      .from('community_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', currentUser.id)
      .single()
      .then(({ data }) => { if (data) setLiked(true) })
  }, [currentUser])

  // 댓글 불러오기
  useEffect(() => {
    supabase
      .from('community_comments')
      .select('*, profiles(nickname, avatar_url, level)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setComments(data as Comment[]) })
  }, [post.id])

  const handleLike = async () => {
    if (!currentUser) { setLoginOpen(true); return }
    if (liked) {
      await supabase.from('community_likes').delete().eq('post_id', post.id).eq('user_id', currentUser.id)
      setLiked(false)
      setLikeCount((p: number) => p - 1)
    } else {
      await supabase.from('community_likes').insert({ post_id: post.id, user_id: currentUser.id })
      setLiked(true)
      setLikeCount((p: number) => p + 1)
    }
  }

  const handleComment = async () => {
    if (!currentUser) { setLoginOpen(true); return }
    if (!commentText.trim()) return
    setSubmitting(true)
    const { data } = await supabase
      .from('community_comments')
      .insert({
        post_id: post.id,
        user_id: currentUser.id,
        content: commentText.trim(),
        parent_id: replyTo,
        is_anonymous: false,
        images: [],
      })
      .select('*, profiles(nickname, avatar_url, level)')
      .single()
    if (data) {
      setComments(prev => [...prev, data as Comment])
      setCommentText('')
      setReplyTo(null)
    }
    setSubmitting(false)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('링크가 복사됐습니다!')
  }

  const topComments = comments.filter(c => !c.parent_id)
  const getReplies = (id: string) => comments.filter(c => c.parent_id === id)

  return (
    <>
      <Header />

      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
          <div className="w-full max-w-sm bg-[#18181B] border border-white/10 rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}>
            <div className="flex justify-end px-6 pt-6">
              <button onClick={() => setLoginOpen(false)} className="text-white/30 hover:text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-8 pb-8">
              <h2 className="text-[18px] font-extrabold text-white text-center mb-2 tracking-tight">로그인 후 이용하세요</h2>
              <p className="text-[12px] text-white/40 text-center mb-6">댓글, 좋아요는 로그인 후 이용 가능합니다</p>
              <Link href="/login" className="block w-full text-center bg-gold text-[#0F0F10] rounded-xl py-3.5 font-bold text-[14px] hover:bg-gold/90 transition-all">
                로그인하기
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-[#0F0F10] pt-[60px]">
        <div className="max-w-[720px] mx-auto px-5 py-8">

          {/* 뒤로가기 */}
          <Link href="/community" className="inline-flex items-center gap-2 text-[12px] text-[#5A5450] hover:text-[#A09080] transition-colors mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> 커뮤니티로 돌아가기
          </Link>

          {/* 게시글 */}
          <article className="bg-[#1E1E22] border border-white/[0.10] rounded-xl p-6 mb-4">

            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full border border-gold/25 flex items-center justify-center text-[13px] font-bold text-gold shrink-0"
                style={{ background: 'rgba(201,169,110,0.12)' }}>
                {post.is_anonymous ? '익' : (post.profiles?.nickname?.[0] ?? '?')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#D8CEB8]">
                  <span>{post.is_anonymous ? '익명 · ···.91' : post.profiles?.nickname}</span>
                  <span>{LEVEL_BADGE[post.profiles?.level ?? 1] ?? '🌱'}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catStyle}`}>
                    {post.category_slug}
                  </span>
                  <span className="text-[11px] text-[#5A5450]">{timeAgo(post.created_at)}</span>
                </div>
              </div>
            </div>

            {/* 제목 */}
            <h1 className="text-[20px] font-extrabold text-[#F0E8D8] leading-snug mb-4"
              style={{ letterSpacing: '-0.02em' }}>
              {post.title}
            </h1>

            {/* 본문 */}
            <p className="text-[14px] text-[#8A8278] leading-relaxed mb-5 whitespace-pre-wrap">
              {post.content}
            </p>

            {/* 이미지 */}
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-5">
                {post.images.map((img: string, i: number) => (
                  <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-lg border border-white/8" />
                ))}
              </div>
            )}

            {/* 태그 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-[11px] text-[#4A4640]">#{tag}</span>
                ))}
              </div>
            )}

            {/* 액션 바 */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.07]">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-[13px] font-semibold transition-colors ${liked ? 'text-red-400' : 'text-[#5A5450] hover:text-[#8A8278]'}`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-400' : ''}`} />
                {likeCount}
              </button>
              <button className="flex items-center gap-1.5 text-[13px] text-[#5A5450] hover:text-[#8A8278] transition-colors">
                <MessageCircle className="w-4 h-4" />
                {comments.length}
              </button>
              <button onClick={handleShare} className="flex items-center gap-1.5 text-[13px] text-[#5A5450] hover:text-[#8A8278] transition-colors">
                <Share2 className="w-4 h-4" />
                공유
              </button>
              <div className="ml-auto flex items-center gap-1.5 text-[12px] text-[#3A3630]">
                <Eye className="w-3.5 h-3.5" />
                {post.view_count?.toLocaleString() ?? 0}
              </div>
            </div>
          </article>

          {/* 댓글 입력 */}
          <div className="bg-[#1E1E22] border border-white/[0.10] rounded-xl p-4 mb-3">
            {replyTo && (
              <div className="flex items-center gap-2 mb-2 text-[11px] text-gold/70">
                <span>답글 작성 중</span>
                <button onClick={() => setReplyTo(null)} className="text-white/30 hover:text-white/60">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <textarea
              placeholder={currentUser ? "댓글을 입력하세요" : "로그인 후 댓글을 작성할 수 있습니다"}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
              onClick={() => { if (!currentUser) setLoginOpen(true) }}
              readOnly={!currentUser}
              className="w-full bg-transparent text-[13px] text-[#D8CEB8] placeholder:text-[#3A3630] resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.07]">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-[11px] text-[#4A4640] hover:text-[#7A7268] transition-colors">
                  <ImageIcon className="w-3.5 h-3.5" /> 이미지
                </button>
              </div>
              <button
                onClick={handleComment}
                disabled={submitting || !commentText.trim()}
                className="flex items-center gap-1.5 bg-gold text-[#0F0F10] text-[12px] font-bold px-4 py-2 rounded-lg hover:bg-gold/90 transition-all disabled:opacity-30"
              >
                <Send className="w-3 h-3" />
                {submitting ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="flex flex-col gap-2">
            <p className="text-[12px] text-[#5A5450] mb-1">댓글 {comments.length}개</p>

            {topComments.map(comment => (
              <div key={comment.id}>
                {/* 댓글 */}
                <div className="bg-[#1E1E22] border border-white/[0.08] rounded-xl p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-full border border-gold/20 flex items-center justify-center text-[10px] font-bold text-gold"
                      style={{ background: 'rgba(201,169,110,0.1)' }}>
                      {comment.is_anonymous ? '익' : (comment.profiles?.nickname?.[0] ?? '?')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#D8CEB8]">
                        <span>{comment.is_anonymous ? '익명' : comment.profiles?.nickname}</span>
                        {comment.user_id === post.user_id && (
                          <span className="text-[9px] bg-gold/15 text-gold px-1.5 py-0.5 rounded-[3px] font-bold">작성자</span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#4A4640]">{timeAgo(comment.created_at)}</span>
                    </div>
                  </div>
                  <p className="text-[13px] text-[#8A8278] leading-relaxed mb-3 whitespace-pre-wrap">{comment.content}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setReplyTo(comment.id)}
                      className="text-[11px] text-[#4A4640] hover:text-[#7A7268] transition-colors"
                    >
                      답글
                    </button>
                  </div>
                </div>

                {/* 대댓글 */}
                {getReplies(comment.id).map(reply => (
                  <div key={reply.id} className="ml-6 mt-1.5 bg-[#18181B] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-6 h-6 rounded-full border border-gold/15 flex items-center justify-center text-[9px] font-bold text-gold"
                        style={{ background: 'rgba(201,169,110,0.08)' }}>
                        {reply.is_anonymous ? '익' : (reply.profiles?.nickname?.[0] ?? '?')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#D8CEB8]">
                          <span>{reply.is_anonymous ? '익명' : reply.profiles?.nickname}</span>
                          {reply.user_id === post.user_id && (
                            <span className="text-[8px] bg-gold/15 text-gold px-1.5 py-0.5 rounded-[3px] font-bold">작성자</span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#4A4640]">{timeAgo(reply.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#8A8278] leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-10 text-[#3A3630] text-[13px]">
                첫 번째 댓글을 작성해보세요
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}