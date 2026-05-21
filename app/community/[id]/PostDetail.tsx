'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Heart, MessageCircle, Share2, ArrowLeft, Flag, Bookmark, Send } from 'lucide-react'

type Post = {
  id: string
  title: string
  content: string
  category_slug: string
  tags: string[]
  images: string[]
  is_anonymous: boolean
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  profiles: { nickname: string; level: number; avatar_url: string | null }
}

type Comment = {
  id: string
  content: string
  is_anonymous: boolean
  created_at: string
  parent_id: string | null
  profiles: { nickname: string; level: number; avatar_url: string | null }
  replies?: Comment[]
}

const LEVEL_BADGE: Record<number, string> = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '⭐' }

function timeAgo(d: string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 60) return '방금'
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
  return `${Math.floor(s / 86400)}일 전`
}

export default function PostDetail({ postId }: { postId: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setCurrentUser(user))

    const fetchPost = async () => {
      const { data } = await supabase
        .from('community_posts')
        .select('*, profiles(nickname, level, avatar_url)')
        .eq('id', postId)
        .single()
      if (data) {
        setPost(data as unknown as Post)
        setLikeCount(data.like_count)
      }
      setLoading(false)
    }

    const fetchComments = async () => {
      const { data } = await supabase
        .from('community_comments')
        .select('*, profiles(nickname, level, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      if (data) {
        const top = data.filter(c => !c.parent_id)
        const withReplies = top.map(c => ({
          ...c,
          replies: data.filter(r => r.parent_id === c.id),
        }))
        setComments(withReplies as unknown as Comment[])
      }
    }

    fetchPost()
    fetchComments()
  }, [postId])

  const handleLike = async () => {
    if (!currentUser) return
    if (liked) {
      await supabase.from('community_likes').delete()
        .eq('user_id', currentUser.id).eq('post_id', postId)
      setLiked(false)
      setLikeCount(n => n - 1)
    } else {
      await supabase.from('community_likes').insert({ user_id: currentUser.id, post_id: postId })
      setLiked(true)
      setLikeCount(n => n + 1)
    }
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
      const { data } = await supabase
        .from('community_comments')
        .select('*, profiles(nickname, level, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      if (data) {
        const top = data.filter(c => !c.parent_id)
        const withReplies = top.map(c => ({
          ...c,
          replies: data.filter(r => r.parent_id === c.id),
        }))
        setComments(withReplies as unknown as Comment[])
      }
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
    setReplyText(prev => ({ ...prev, [parentId]: '' }))
    setReplyOpen(prev => ({ ...prev, [parentId]: false }))
    const { data } = await supabase
      .from('community_comments')
      .select('*, profiles(nickname, level, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    if (data) {
      const top = data.filter(c => !c.parent_id)
      const withReplies = top.map(c => ({
        ...c,
        replies: data.filter(r => r.parent_id === c.id),
      }))
      setComments(withReplies as unknown as Comment[])
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0F0F10] flex items-center justify-center">
      <p className="text-white/50 text-[14px] font-bold">불러오는 중...</p>
    </div>
  )

  if (!post) return (
    <div className="min-h-screen bg-[#0F0F10] flex items-center justify-center">
      <p className="text-white/50 text-[14px] font-bold">게시글을 찾을 수 없습니다.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0F0F10] pt-[60px]">
      <div className="max-w-[720px] mx-auto px-4 py-6">

        {/* 뒤로가기 */}
        <button
          onClick={() => router.push('/community')}
          className="flex items-center gap-2 text-white font-bold text-[13px] mb-6 hover:text-[#C9A96E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          커뮤니티로 돌아가기
        </button>

        {/* 게시글 카드 */}
        <div className="bg-[#1E1E22] border border-white/[0.08] rounded-xl p-5 mb-4">

          {/* 작성자 */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full border border-[#C9A96E]/30 flex items-center justify-center text-[14px] font-extrabold text-[#C9A96E] shrink-0"
              style={{ background: 'rgba(201,169,110,0.12)' }}
            >
              {post.is_anonymous ? '익' : post.profiles?.nickname?.[0] ?? '?'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-extrabold text-white">
                  {post.is_anonymous ? '익명' : post.profiles?.nickname}
                </span>
                <span>{LEVEL_BADGE[post.profiles?.level ?? 1] ?? '🌱'}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}
                >
                  {post.category_slug}
                </span>
              </div>
              <span className="text-[12px] text-white/50 font-bold">{timeAgo(post.created_at)}</span>
            </div>
          </div>

          {/* 제목 */}
          <h1
            className="text-[20px] md:text-[24px] font-extrabold text-white leading-tight mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            {post.title}
          </h1>

          {/* 본문 */}
          <p className="text-[15px] text-white font-medium leading-relaxed whitespace-pre-wrap mb-4">
            {post.content}
          </p>

          {/* 태그 */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[11px] font-bold text-[#C9A96E]/70 hover:text-[#C9A96E] cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 액션 바 */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[13px] font-bold transition-colors ${liked ? 'text-red-400' : 'text-white/60 hover:text-white'}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-red-400' : ''}`} />
              {likeCount}
            </button>
            <div className="flex items-center gap-1.5 text-[13px] font-bold text-white/60">
              <MessageCircle className="w-4 h-4" />
              {comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)}
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); alert('링크가 복사됐어요!') }}
              className="flex items-center gap-1.5 text-[13px] font-bold text-white/60 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" /> 공유
            </button>
            <div className="ml-auto flex items-center gap-3">
              <button className="text-[12px] font-bold text-white/40 hover:text-white transition-colors flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5" /> 저장
              </button>
              <button className="text-[12px] font-bold text-red-400/50 hover:text-red-400 transition-colors flex items-center gap-1">
                <Flag className="w-3.5 h-3.5" /> 신고
              </button>
              <span className="text-[12px] text-white/25 font-bold">👁 {post.view_count}</span>
            </div>
          </div>
        </div>

        {/* 댓글 입력 */}
        <div className="bg-[#1E1E22] border border-white/[0.08] rounded-xl p-4 mb-4">
          {currentUser ? (
            <>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요"
                rows={3}
                className="w-full bg-transparent text-white text-[14px] font-medium placeholder:text-white/30 outline-none resize-none leading-relaxed border-b border-white/[0.08] pb-3 mb-3"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-white/30 font-bold">{commentText.length}/500</span>
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim() || submitting}
                  className="flex items-center gap-1.5 bg-[#C9A96E] text-[#0F0F10] text-[12px] font-extrabold px-4 py-2 rounded-lg hover:bg-[#b8944f] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" /> 등록
                </button>
              </div>
            </>
          ) : (
            <p className="text-[13px] text-white/40 font-bold text-center py-2">
              댓글을 작성하려면{' '}
              <span
                className="text-[#C9A96E] underline cursor-pointer"
                onClick={() => router.push('/login')}
              >
                로그인
              </span>
              이 필요해요
            </p>
          )}
        </div>

        {/* 댓글 목록 */}
        <div className="mb-8">
          <p className="text-[13px] font-extrabold text-white mb-3">
            댓글 {comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)}개
          </p>

          {comments.length === 0 ? (
            <div className="bg-[#1E1E22] border border-white/[0.06] rounded-xl py-8 text-center">
              <p className="text-[13px] text-white/40 font-bold">첫 번째 댓글을 작성해보세요</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {comments.map(comment => (
                <div key={comment.id}>
                  {/* 댓글 */}
                  <div className="bg-[#1E1E22] border border-white/[0.08] rounded-xl p-4">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-extrabold text-[#C9A96E] shrink-0"
                        style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}
                      >
                        {comment.is_anonymous ? '익' : comment.profiles?.nickname?.[0] ?? '?'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-extrabold text-white">
                          {comment.is_anonymous ? '익명' : comment.profiles?.nickname}
                        </span>
                        {currentUser && comment.profiles?.nickname === post.profiles?.nickname && (
                          <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]"
                            style={{ background: 'rgba(201,169,110,0.15)', color: '#C9A96E' }}
                          >
                            작성자
                          </span>
                        )}
                        <span className="text-[11px] text-white/40 font-bold">{timeAgo(comment.created_at)}</span>
                      </div>
                    </div>
                    <p className="text-[14px] text-white font-medium leading-relaxed mb-3 pl-10">
                      {comment.content}
                    </p>
                    <div className="pl-10">
                      <button
                        onClick={() => setReplyOpen(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                        className="text-[11px] font-bold text-white/50 hover:text-[#C9A96E] transition-colors"
                      >
                        답글
                      </button>
                    </div>

                    {/* 대댓글 입력 */}
                    {replyOpen[comment.id] && currentUser && (
                      <div className="mt-3 pl-10">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText[comment.id] ?? ''}
                            onChange={e => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                            placeholder="답글 입력..."
                            className="flex-1 bg-white/[0.06] border border-white/10 text-white text-[13px] font-medium px-3 py-2 rounded-lg placeholder:text-white/30 outline-none focus:border-[#C9A96E]/40 transition-colors"
                          />
                          <button
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyText[comment.id]?.trim() || submitting}
                            className="bg-[#C9A96E] text-[#0F0F10] text-[11px] font-extrabold px-3 py-2 rounded-lg hover:bg-[#b8944f] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            등록
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 대댓글 목록 */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-6 flex flex-col gap-1.5 mt-1.5">
                      {comment.replies.map(reply => (
                        <div
                          key={reply.id}
                          className="bg-[#252529] border border-white/[0.06] rounded-xl p-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#C9A96E] font-bold text-[12px]">↳</span>
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-[#C9A96E] shrink-0"
                              style={{ background: 'rgba(201,169,110,0.12)' }}
                            >
                              {reply.is_anonymous ? '익' : reply.profiles?.nickname?.[0] ?? '?'}
                            </div>
                            <span className="text-[12px] font-extrabold text-white">
                              {reply.is_anonymous ? '익명' : reply.profiles?.nickname}
                            </span>
                            <span className="text-[10px] text-white/40 font-bold">{timeAgo(reply.created_at)}</span>
                          </div>
                          <p className="text-[13px] text-white font-medium leading-relaxed pl-8">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}