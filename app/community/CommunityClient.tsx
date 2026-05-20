'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import {
  Heart, MessageCircle, Share2, MoreHorizontal,
  Plus, Bell, Search, Bookmark, Flag, Eye,
  TrendingUp, Image as ImageIcon, X, Clock,
  ThumbsUp, Flame, BarChart2, ChevronRight,
  Pin
} from 'lucide-react'

// ── 타입 ──
type Post = {
  id: string
  category_slug: string
  title: string
  content: string
  images: string[]
  tags: string[]
  is_anonymous: boolean
  view_count: number
  like_count: number
  comment_count: number
  created_at: string
  is_hot?: boolean
  is_best?: boolean
  profiles: { nickname: string; level: number; avatar_url: string | null }
}

// ── 카테고리 23개 ──
const CATEGORIES = [
  { slug: 'all',         label: '전체',        count: 2847, color: '' },
  { slug: '자유게시판',  label: '자유게시판',   count: 521,  color: 'free' },
  { slug: '유머·짤',    label: '유머·짤',      count: 312,  color: 'humor' },
  { slug: '정치·시사',  label: '정치·시사',    count: 198,  color: 'politics' },
  { slug: '공동구매',   label: '공동구매',      count: 87,   color: 'buy' },
  { slug: '부동산·청약',label: '부동산·청약',   count: 287,  color: 'estate' },
  { slug: '경제·주식',  label: '경제·주식·코인',count: 243,  color: 'stock' },
  { slug: '보험·연금',  label: '보험·연금',    count: 76,   color: 'insurance' },
  { slug: '창업·사업',  label: '창업·사업',    count: 94,   color: 'biz' },
  { slug: '법률·세금',  label: '법률·세금',    count: 112,  color: 'law' },
  { slug: '의료·건강',  label: '의료·건강',    count: 213,  color: 'health' },
  { slug: '정신건강',   label: '정신건강·심리', count: 68,   color: 'mental' },
  { slug: '실버·요양',  label: '실버·요양·노후',count: 54,   color: 'silver' },
  { slug: '다이어트',   label: '다이어트·운동', count: 143,  color: 'diet' },
  { slug: 'IT·테크',   label: 'IT·테크',      count: 298,  color: 'it' },
  { slug: '게임',       label: '게임',         count: 167,  color: 'game' },
  { slug: '자동차',     label: '자동차',       count: 156,  color: 'auto' },
  { slug: '골프·여행',  label: '골프·여행·취미',count: 112,  color: 'golf' },
  { slug: '뷰티·성형',  label: '뷰티·성형·패션',count: 88,   color: 'beauty' },
  { slug: '맛집·와인',  label: '맛집·와인·요리',count: 143,  color: 'food' },
  { slug: '반려동물',   label: '반려동물',      count: 97,   color: 'pet' },
  { slug: '육아·교육',  label: '육아·교육·유학',count: 134,  color: 'edu' },
  { slug: '광고주후기', label: '광고주 후기',   count: 72,   color: 'ad' },
  { slug: '익명게시판', label: '익명게시판',    count: 189,  color: 'anon' },
]

const ANON_ALLOWED = ['의료·건강', '법률·세금', '자유게시판', '정신건강', '익명게시판']

const LEVEL_BADGE: Record<number, string> = { 1: '🌱', 2: '🌿', 3: '🌳', 4: '⭐' }

const CAT_STYLE: Record<string, string> = {
  free:      'bg-zinc-500/15 text-zinc-300',
  humor:     'bg-yellow-500/15 text-yellow-300',
  politics:  'bg-rose-500/15 text-rose-300',
  buy:       'bg-orange-500/15 text-orange-300',
  estate:    'bg-emerald-500/15 text-emerald-300',
  stock:     'bg-cyan-500/15 text-cyan-300',
  insurance: 'bg-indigo-500/15 text-indigo-300',
  biz:       'bg-violet-500/15 text-violet-300',
  law:       'bg-purple-500/15 text-purple-300',
  health:    'bg-red-500/15 text-red-300',
  mental:    'bg-pink-500/15 text-pink-300',
  silver:    'bg-slate-500/15 text-slate-300',
  diet:      'bg-lime-500/15 text-lime-300',
  it:        'bg-sky-500/15 text-sky-300',
  game:      'bg-blue-500/15 text-blue-300',
  auto:      'bg-blue-600/15 text-blue-300',
  golf:      'bg-green-500/15 text-green-300',
  beauty:    'bg-pink-400/15 text-pink-300',
  food:      'bg-amber-500/15 text-amber-300',
  pet:       'bg-teal-500/15 text-teal-300',
  edu:       'bg-teal-600/15 text-teal-300',
  ad:        'bg-gold/15 text-gold',
  anon:      'bg-gray-500/15 text-gray-400',
  '':        'bg-white/8 text-white/50',
}

// 카테고리별 썸네일 그라디언트 (이미지 없을 때 자동 생성)
const CAT_GRADIENT: Record<string, string> = {
  estate:   'linear-gradient(135deg, #1a3a2a 0%, #2a6a4a 100%)',
  health:   'linear-gradient(135deg, #3a1a1a 0%, #6a2a2a 100%)',
  it:       'linear-gradient(135deg, #1a2a3a 0%, #1a3a6a 100%)',
  food:     'linear-gradient(135deg, #3a2a1a 0%, #6a4a1a 100%)',
  auto:     'linear-gradient(135deg, #1a1a3a 0%, #2a2a6a 100%)',
  stock:    'linear-gradient(135deg, #1a3a3a 0%, #1a5a5a 100%)',
  law:      'linear-gradient(135deg, #2a1a3a 0%, #4a2a6a 100%)',
  golf:     'linear-gradient(135deg, #1a3a1a 0%, #2a5a2a 100%)',
  beauty:   'linear-gradient(135deg, #3a1a2a 0%, #6a1a4a 100%)',
  edu:      'linear-gradient(135deg, #1a3a3a 0%, #1a4a5a 100%)',
  game:     'linear-gradient(135deg, #1a1a4a 0%, #2a1a7a 100%)',
  pet:      'linear-gradient(135deg, #2a3a1a 0%, #3a5a2a 100%)',
  humor:    'linear-gradient(135deg, #3a3a1a 0%, #5a5a1a 100%)',
  '':       'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
}

const CAT_EMOJI: Record<string, string> = {
  estate: '🏢', health: '💊', it: '💻', food: '🍷', auto: '🚗',
  stock: '📈', law: '⚖️', golf: '⛳', beauty: '💄', edu: '🎓',
  game: '🎮', pet: '🐾', humor: '😂', politics: '📰', buy: '🛍️',
  insurance: '🛡️', biz: '💼', mental: '🧠', silver: '👴', diet: '💪',
  anon: '👤', ad: '📢', free: '💬', '': '📝',
}

// ── 샘플 데이터 ──
const DUMMY_POSTS: Post[] = [
  {
    id: '1', category_slug: '부동산·청약',
    title: '강남 아파트 청약 당첨 후기 — 가점제 준비부터 결과까지',
    content: '3년 만에 드디어 청약 당첨됐습니다. 가점제로 넣었는데 이번에 운이 좋았네요. 준비 과정이나 궁금한 거 있으면 질문해주세요.',
    images: [], tags: ['청약', '강남', '가점제'], is_anonymous: false,
    view_count: 1240, like_count: 87, comment_count: 34,
    created_at: '2026-05-20T09:00:00', is_hot: true,
    profiles: { nickname: '별빛고래_2847', level: 3, avatar_url: null },
  },
  {
    id: '2', category_slug: '의료·건강',
    title: '작년에 받은 건강검진 결과 해석 좀 부탁드려요',
    content: '간수치가 조금 높게 나왔는데 걱정이 되네요. 비슷한 경험 있으신 분 계신가요?',
    images: [], tags: ['건강검진', '간수치'], is_anonymous: true,
    view_count: 430, like_count: 12, comment_count: 8,
    created_at: '2026-05-20T10:30:00',
    profiles: { nickname: '익명', level: 1, avatar_url: null },
  },
  {
    id: '3', category_slug: 'IT·테크',
    title: 'Claude API로 사이드 프로젝트 만든 후기 — 2주 완성, 월 3만원 운영 중',
    content: '혼자서 2주 만에 완성했습니다. 비용도 생각보다 훨씬 저렴하고 품질도 놀라웠어요.',
    images: [], tags: ['Claude', 'AI', '사이드프로젝트'], is_anonymous: false,
    view_count: 2100, like_count: 156, comment_count: 62,
    created_at: '2026-05-19T14:00:00', is_hot: true, is_best: true,
    profiles: { nickname: '새벽달빛_9341', level: 4, avatar_url: null },
  },
  {
    id: '4', category_slug: '맛집·와인',
    title: '성수동 숨겨진 내추럴 와인바 다녀왔어요',
    content: '내추럴 와인 종류가 엄청 다양하고 안주도 훌륭합니다. 예약 필수예요.',
    images: [], tags: ['성수동', '와인', '맛집'], is_anonymous: false,
    view_count: 870, like_count: 45, comment_count: 19,
    created_at: '2026-05-19T19:00:00',
    profiles: { nickname: '구름바람_5521', level: 2, avatar_url: null },
  },
  {
    id: '5', category_slug: '공동구매',
    title: '에어팟 프로 2세대 공동구매 진행합니다 — 정가 대비 38% 할인',
    content: '최소 20명 모이면 진행합니다. 현재 14명 참여 중. 마감 3일 전입니다.',
    images: [], tags: ['공동구매', '에어팟', '할인'], is_anonymous: false,
    view_count: 1890, like_count: 234, comment_count: 87,
    created_at: '2026-05-20T08:00:00', is_hot: true,
    profiles: { nickname: '하늘바람_4421', level: 3, avatar_url: null },
  },
  {
    id: '6', category_slug: '정치·시사',
    title: '오늘 발표된 부동산 정책 요약 — 핵심만 정리했습니다',
    content: '긴 발표 내용을 요약해봤습니다. 실거주자 입장에서 중요한 부분 위주로 정리했어요.',
    images: [], tags: ['부동산정책', '정부발표', '요약'], is_anonymous: false,
    view_count: 3200, like_count: 312, comment_count: 143,
    created_at: '2026-05-20T11:00:00', is_hot: true, is_best: true,
    profiles: { nickname: '새벽달빛_9341', level: 4, avatar_url: null },
  },
]

const TRENDING = [
  { id: '6', title: '오늘 발표된 부동산 정책 요약', comment_count: 143, view_count: 3200 },
  { id: '3', title: 'Claude API로 사이드 프로젝트 만든 후기', comment_count: 62, view_count: 2100 },
  { id: '5', title: '에어팟 프로 2세대 공동구매 38% 할인', comment_count: 87, view_count: 1890 },
  { id: '1', title: '강남 아파트 청약 당첨 후기', comment_count: 34, view_count: 1240 },
]

const NOTICES = [
  { text: '커뮤니티 이용 규칙 및 광고·도배 금지 안내 — 위반 시 즉시 정지', date: '2026.05.01' },
  { text: '신규 카테고리 "공동구매", "정치·시사", "익명게시판" 오픈 안내', date: '2026.04.15' },
]

// ── 유틸 ──
function timeAgo(d: string) {
  const s = (Date.now() - new Date(d).getTime()) / 1000
  if (s < 60) return '방금'
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
  return `${Math.floor(s / 86400)}일 전`
}

function getCatInfo(slug: string) {
  const cat = CATEGORIES.find(c => c.slug === slug)
  const color = cat?.color ?? ''
  return {
    style: CAT_STYLE[color] ?? CAT_STYLE[''],
    gradient: CAT_GRADIENT[color] ?? CAT_GRADIENT[''],
    emoji: CAT_EMOJI[color] ?? CAT_EMOJI[''],
  }
}

function sortPosts(posts: Post[], sortBy: string) {
  return [...posts].sort((a, b) => {
    if (sortBy === 'popular') return b.like_count - a.like_count
    if (sortBy === 'comment') return b.comment_count - a.comment_count
    if (sortBy === 'recommend') return (b.like_count + b.comment_count) - (a.like_count + a.comment_count)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

// ── 인피드 광고 컴포넌트 ──
function InFeedAd() {
  return (
    <div className="bg-[#16161A] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-[8px] font-bold text-white/20 border border-white/10 px-1.5 py-0.5 rounded shrink-0">광고</span>
      <div className="flex-1 min-w-0">
        <div className="h-10 bg-white/[0.03] rounded-md flex items-center justify-center">
          <span className="text-[10px] text-white/15">광고 영역 — 728×60</span>
        </div>
      </div>
    </div>
  )
}

// ── 로그인 모달 ──
function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div
        className="w-full max-w-sm bg-[#18181B] border border-white/10 rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.08)' }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-8 pb-8">
          <div className="text-center mb-6">
            <p className="text-[11px] tracking-[0.25em] uppercase text-gold mb-1" style={{ fontFamily: 'var(--font-space-mono)' }}>
              PAGEONEWORKS
            </p>
            <p className="text-[10px] text-white/30 tracking-widest">Premium Community</p>
          </div>
          <h2 className="text-[18px] font-extrabold text-white text-center mb-1 tracking-tight">
            로그인 후 이용하세요
          </h2>
          <p className="text-[13px] text-white/40 text-center mb-6 leading-relaxed">
            글 작성, 댓글, 좋아요는 로그인 후 이용 가능합니다
          </p>
          <div className="bg-gold/8 border border-gold/20 rounded-lg px-4 py-3 mb-5 text-center">
            <p className="text-[12px] text-gold/80 leading-relaxed">
              🔒 소셜 계정 외 별도 정보를 저장하지 않습니다
            </p>
          </div>
          <button className="w-full flex items-center gap-3 bg-white text-[#1F1F1F] rounded-xl px-4 py-3.5 mb-3 font-bold text-[14px] hover:bg-white/90 transition-all hover:-translate-y-0.5">
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  <span className="flex-1 text-center">Google로 로그인</span>
</button>
<button className="w-full flex items-center gap-3 bg-[#FEE500] text-[#191919] rounded-xl px-4 py-3.5 mb-3 font-bold text-[14px] hover:bg-[#FDD800] transition-all hover:-translate-y-0.5">
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#191919">
    <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.7 5.08 4.27 6.47L5.2 21l4.53-2.97c.75.1 1.51.17 2.27.17 5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"/>
  </svg>
  <span className="flex-1 text-center">카카오로 로그인</span>
</button>
<button disabled className="w-full flex items-center gap-3 bg-[#03C75A]/30 text-white/30 rounded-xl px-4 py-3.5 mb-5 font-bold text-[14px] cursor-not-allowed">
  <svg className="w-5 h-5 shrink-0 opacity-40" viewBox="0 0 24 24" fill="#03C75A">
    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
  </svg>
  <span className="flex-1 text-center">네이버로 로그인 (준비중)</span>
</button>
          <p className="text-[11px] text-white/20 text-center">
            로그인 시{' '}
            <span className="underline cursor-pointer hover:text-white/40">이용약관</span>
            {' '}및{' '}
            <span className="underline cursor-pointer hover:text-white/40">개인정보처리방침</span>
            에 동의하는 것으로 간주됩니다
          </p>
        </div>
      </div>
    </div>
  )
}

// ── 글쓰기 모달 ──
function WriteModal({ onClose, onLoginRequired }: { onClose: () => void; onLoginRequired: () => void }) {
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnon, setIsAnon] = useState(false)
  const [tags, setTags] = useState('')
  const isLoggedIn = false // TODO: Supabase 세션 확인

  if (!isLoggedIn) {
    onClose()
    onLoginRequired()
    return null
  }

  const canSubmit = category && title.trim() && content.trim()

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#18181B] border border-white/10 md:rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <span className="text-[15px] font-extrabold text-white tracking-tight">새 글 작성</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-white/5 border border-white/10 text-white/70 text-[14px] px-4 py-3 rounded-xl focus:outline-none focus:border-gold/40 transition-colors"
          >
            <option value="">카테고리 선택 *</option>
            {CATEGORIES.slice(1).map(c => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="제목을 입력하세요 *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-[14px] px-4 py-3 rounded-xl placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors"
          />
          <textarea
            placeholder="내용을 입력하세요. @멘션, #해시태그 사용 가능"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={7}
            className="bg-white/5 border border-white/10 text-white/80 text-[13px] px-4 py-3 rounded-xl placeholder:text-white/25 focus:outline-none focus:border-gold/40 transition-colors resize-none leading-relaxed"
          />
          <input
            type="text"
            placeholder="#태그 입력 (쉼표로 구분, 최대 5개)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            className="bg-white/5 border border-white/10 text-white/60 text-[13px] px-4 py-2.5 rounded-xl placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
          />
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors px-3 py-2 border border-white/10 rounded-lg">
                <ImageIcon className="w-3.5 h-3.5" />
                이미지 (최대 3장)
              </button>
              {ANON_ALLOWED.includes(category) && (
                <label className="flex items-center gap-2 text-[12px] text-white/40 cursor-pointer select-none">
                  <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} className="w-3.5 h-3.5 accent-gold" />
                  익명으로 게시
                </label>
              )}
            </div>
            <button
              disabled={!canSubmit}
              className="bg-gold text-[#0F0F10] text-[13px] font-bold px-6 py-2.5 rounded-lg hover:bg-gold/90 transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              게시하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 포스트 카드 ──
function PostCard({ post, onLikeToggle }: { post: Post; onLikeToggle: (id: string) => void }) {
  const [liked, setLiked] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { style: catStyle, gradient, emoji } = getCatInfo(post.category_slug)
  const hasThumb = post.images.length > 0

  return (
    <article
      className="group bg-[#1E1E22] border border-white/[0.10] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:border-white/[0.18] relative"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(201,169,110,0.06)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)'
      }}
    >
      {/* 호버 글로우 */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.04) 0%, transparent 50%)' }}
      />

      <div className="p-4 md:p-5 relative">
        {/* 작성자 헤더 */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-full border border-gold/25 flex items-center justify-center text-[11px] font-bold text-gold shrink-0"
            style={{ background: 'rgba(201,169,110,0.12)' }}>
            {post.is_anonymous ? '익' : post.profiles.nickname[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold text-[#D8CEB8]">
                {post.is_anonymous ? '익명 · ···.91' : post.profiles.nickname}
              </span>
              <span className="text-[11px]">{LEVEL_BADGE[post.profiles.level] ?? '🌱'}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catStyle}`}>
                {post.category_slug}
              </span>
              <span className="text-[11px] text-[#5A5450]">{timeAgo(post.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {post.is_hot && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]"
                style={{ background: 'rgba(232,93,74,0.15)', color: '#F07060' }}>HOT</span>
            )}
            {post.is_best && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-[3px]"
                style={{ background: 'rgba(74,158,232,0.15)', color: '#70B0F0' }}>BEST</span>
            )}
          </div>
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
              className="w-6 h-6 flex items-center justify-center text-[#3A3630] hover:text-[#7A7268] transition-colors"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-7 bg-[#222228] border border-white/10 rounded-xl w-28 z-10 overflow-hidden shadow-xl">
                <button className="w-full px-3 py-2.5 text-left text-[12px] text-[#8A8278] hover:bg-white/5 flex items-center gap-2">
                  <Bookmark className="w-3 h-3" /> 저장
                </button>
                <button className="w-full px-3 py-2.5 text-left text-[12px] text-red-400/70 hover:bg-white/5 flex items-center gap-2">
                  <Flag className="w-3 h-3" /> 신고
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 제목 + 썸네일 */}
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            {/* eyebrow */}
            <p className="text-[10px] font-bold text-gold/70 mb-1 uppercase tracking-wide">
              {post.is_hot ? 'HOT · ' : ''}{post.category_slug}
            </p>
            <h2 className="text-[14px] font-extrabold text-[#F0E8D8] leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-1"
              style={{ letterSpacing: '-0.02em' }}>
              {post.title}
            </h2>
            <p className="text-[12px] text-[#7A7268] leading-relaxed line-clamp-1 mb-2.5">
              {post.content}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] text-[#4A4640] hover:text-gold/60 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 썸네일 — 이미지 있으면 이미지, 없으면 카테고리 그라디언트 */}
          <div
            className="w-[68px] h-[56px] rounded-lg shrink-0 flex items-center justify-center text-2xl border border-white/8 overflow-hidden transition-transform duration-200 group-hover:scale-[1.03]"
            style={{ background: gradient }}
          >
            {hasThumb ? null : <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>{emoji}</span>}
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="flex items-center gap-3 pt-3 mt-3 border-t border-white/[0.07]">
          <button
            onClick={e => { e.stopPropagation(); setLiked(!liked); onLikeToggle(post.id) }}
            className={`flex items-center gap-1 text-[12px] transition-colors ${liked ? 'text-red-400' : 'text-[#4A4640] hover:text-[#8A8278]'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-400' : ''}`} />
            {post.like_count + (liked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1 text-[12px] text-[#4A4640] hover:text-[#8A8278] transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.comment_count}
          </button>
          <button className="flex items-center gap-1 text-[12px] text-[#4A4640] hover:text-[#8A8278] transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <div className="ml-auto flex items-center gap-1 text-[12px] text-[#3A3630]">
            <Eye className="w-3 h-3" />
            {post.view_count.toLocaleString()}
          </div>
        </div>
      </div>
    </article>
  )
}

// ── 메인 컴포넌트 ──
export default function CommunityClient() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'comment' | 'recommend'>('latest')
  const [posts] = useState<Post[]>(DUMMY_POSTS)
  const [loginOpen, setLoginOpen] = useState(false)
  const [writeOpen, setWriteOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = sortPosts(
    posts.filter(p =>
      (activeCategory === 'all' || p.category_slug === activeCategory) &&
      (searchQuery === '' || p.title.includes(searchQuery) || p.content.includes(searchQuery))
    ),
    sortBy
  )

  const handleWriteClick = () => setLoginOpen(true)

  return (
    <>
      <Header />
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {writeOpen && (
        <WriteModal
          onClose={() => setWriteOpen(false)}
          onLoginRequired={() => setLoginOpen(true)}
        />
      )}

      <main className="min-h-screen bg-[#0F0F10] pt-[60px]">

        {/* ── 배너 ── */}
        <div className="border-b border-white/[0.06] px-6 md:px-10 py-8 bg-[#141416]">
          <div className="max-w-[1440px] mx-auto flex items-end justify-between">
            <div>
              <p className="text-[9px] tracking-[0.3em] uppercase text-gold mb-2" style={{ fontFamily: 'var(--font-space-mono)' }}>
                Community · 커뮤니티
              </p>
              <h1 className="text-[28px] md:text-[36px] font-extrabold text-white mb-3 speakable-summary" style={{ letterSpacing: '-0.03em' }}>
                프리미엄 포럼
              </h1>
              <p className="text-[13px] text-[#5A5450] hidden md:block">
                검증된 전문가들과 함께하는 인사이트 커뮤니티
              </p>
              <div className="flex gap-6 mt-4">
                {[
                  { n: '2,847', l: '전체 글' },
                  { n: '3,847', l: '회원' },
                  { n: '127', l: '오늘 글' },
                  { n: '892', l: '오늘 방문' },
                ].map(s => (
                  <div key={s.l}>
                    <div className="text-[20px] font-black text-[#F0E8D8]" style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em' }}>
                      {s.n}
                    </div>
                    <div className="text-[10px] text-[#4A4640] mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center border border-white/10 text-[#5A5450] hover:text-[#A09080] hover:border-white/20 transition-all rounded-lg"
              >
                <Search className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center border border-white/10 text-[#5A5450] hover:text-[#A09080] hover:border-white/20 transition-all rounded-lg relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <button
                onClick={handleWriteClick}
                className="hidden md:flex items-center gap-1.5 bg-gold text-[#0F0F10] px-4 py-2 text-[12px] font-bold rounded-lg hover:bg-gold/90 transition-all hover:-translate-y-0.5"
              >
                <Plus className="w-3.5 h-3.5" /> 글쓰기
              </button>
            </div>
          </div>
          {searchOpen && (
            <div className="max-w-[1440px] mx-auto mt-4">
              <input
                type="search"
                autoFocus
                placeholder="제목, 본문, 태그로 검색"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-[14px] px-4 py-3 rounded-xl placeholder:text-[#4A4640] focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          )}
        </div>

        {/* ── 카테고리 탭 ── */}
        <div className="sticky top-[60px] z-20 border-b border-white/[0.06]" style={{ background: 'rgba(15,15,16,0.97)', backdropFilter: 'blur(20px)' }}>
          <div className="flex gap-0 overflow-x-auto scrollbar-hide px-6 md:px-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 flex items-center gap-1.5 text-[12px] px-4 py-3.5 border-b-2 transition-all whitespace-nowrap font-medium ${
                  activeCategory === cat.slug
                    ? 'border-gold text-gold'
                    : 'border-transparent text-[#4A4640] hover:text-[#8A8278]'
                }`}
              >
                {cat.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.slug ? 'text-gold' : 'text-[#3A3630]'
                }`} style={{ background: activeCategory === cat.slug ? 'rgba(201,169,110,0.15)' : 'rgba(255,255,255,0.04)' }}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── 3단 레이아웃 ── */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_244px]">

            {/* 왼쪽 사이드바 */}
            <aside className="hidden md:block border-r border-white/[0.06] pr-5 pt-5">
              <p className="text-[9px] tracking-[0.2em] uppercase text-[#3A3630] mb-3 px-2" style={{ fontFamily: 'var(--font-space-mono)' }}>
                카테고리
              </p>
              <nav className="flex flex-col">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex items-center justify-between text-left text-[13px] px-3 py-2 rounded-lg transition-all ${
                      activeCategory === cat.slug
                        ? 'font-bold text-gold'
                        : 'text-[#5A5450] hover:text-[#A09080] hover:bg-white/3'
                    }`}
                    style={activeCategory === cat.slug ? { background: 'rgba(201,169,110,0.08)' } : {}}
                  >
                    {cat.label}
                    <span className={`text-[10px] ${activeCategory === cat.slug ? 'text-gold/60' : 'text-[#3A3630]'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </nav>
              <div className="mt-4 mx-2">
                <button
                  onClick={handleWriteClick}
                  className="w-full bg-gold text-[#0F0F10] text-[12px] font-bold py-2.5 rounded-lg hover:bg-gold/90 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> 글 작성하기
                </button>
              </div>
            </aside>

            {/* 피드 */}
            <section className="py-4 px-0 md:px-5 border-r border-white/[0.06]">
              {/* 정렬 탭 */}
              <div className="flex items-center gap-2 mb-3">
                {[
                  { key: 'latest',    icon: Clock,          label: '최신' },
                  { key: 'popular',   icon: Flame,          label: '인기' },
                  { key: 'comment',   icon: MessageCircle,  label: '댓글' },
                  { key: 'recommend', icon: ThumbsUp,       label: '추천' },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key as typeof sortBy)}
                    className={`flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      sortBy === key
                        ? 'border-gold/40 text-gold'
                        : 'border-white/8 text-[#4A4640] hover:text-[#7A7268]'
                    }`}
                    style={sortBy === key ? { background: 'rgba(201,169,110,0.08)' } : {}}
                  >
                    <Icon className="w-3 h-3" /> {label}
                  </button>
                ))}
                <span className="ml-auto text-[11px] text-[#3A3630]">총 {filteredPosts.length}개</span>
              </div>

              {/* 공지 2개 */}
              {NOTICES.map((n, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 border rounded-lg px-4 py-2.5 mb-2 cursor-pointer transition-colors"
                  style={{ background: 'rgba(201,169,110,0.05)', borderColor: 'rgba(201,169,110,0.15)' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(201,169,110,0.05)'}
                >
                  <span className="text-[9px] font-bold bg-gold text-[#0F0F10] px-2 py-0.5 rounded-[3px] shrink-0">공지</span>
                  <span className="text-[12px] text-gold/80 flex-1 truncate">{n.text}</span>
                  <span className="text-[10px] text-[#3A3630] shrink-0">{n.date}</span>
                </div>
              ))}

              {/* 포스트 목록 — 3번째, 7번째 사이에 인피드 광고 */}
              <div className="flex flex-col gap-2 mt-2">
                {filteredPosts.map((post, idx) => (
                  <>
                    <PostCard key={post.id} post={post} onLikeToggle={() => {}} />
                    {idx === 2 && <InFeedAd key="ad-1" />}
                    {idx === 6 && <InFeedAd key="ad-2" />}
                  </>
                ))}
              </div>

              <div className="text-center py-5">
                <button className="text-[12px] text-[#5A5450] border border-white/8 px-8 py-2.5 rounded-full hover:text-[#8A8278] hover:border-white/15 transition-all font-medium">
                  더 보기
                </button>
              </div>
            </section>

            {/* 오른쪽 사이드바 */}
            <aside className="hidden md:block pl-5 pt-5">
              {/* 광고 상단 */}
              <div className="mb-5">
                <p className="text-[8px] tracking-[0.15em] uppercase text-[#2A2A2E] mb-2" style={{ fontFamily: 'var(--font-space-mono)' }}>Advertisement</p>
                <div className="border border-dashed border-white/8 rounded-xl h-24 flex flex-col items-center justify-center gap-1" style={{ background: '#16161A' }}>
                  <BarChart2 className="w-5 h-5 text-[#2A2A2E]" />
                  <span className="text-[10px] text-[#2A2A2E]">광고 배너 244×90</span>
                </div>
              </div>

              {/* 실시간 인기글 */}
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-gold/60" />
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#4A4640]" style={{ fontFamily: 'var(--font-space-mono)' }}>실시간 인기글</p>
                </div>
                <div className="flex flex-col">
                  {TRENDING.map((item, i) => (
                    <div key={item.id} className="flex gap-2.5 py-2.5 border-b border-white/[0.05] cursor-pointer group last:border-none">
                      <span className="text-[12px] font-black text-gold/50 w-5 shrink-0 mt-0.5" style={{ letterSpacing: '-0.02em' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[#5A5450] group-hover:text-[#A09080] transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-[#3A3630] flex items-center gap-0.5">
                            <MessageCircle className="w-2.5 h-2.5" /> {item.comment_count}
                          </span>
                          <span className="text-[10px] text-[#3A3630] flex items-center gap-0.5">
                            <Eye className="w-2.5 h-2.5" /> {item.view_count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 오늘의 현황 */}
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <BarChart2 className="w-3.5 h-3.5 text-gold/60" />
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#4A4640]" style={{ fontFamily: 'var(--font-space-mono)' }}>오늘의 현황</p>
                </div>
                <div className="flex flex-col">
                  {[
                    { l: '새 게시글', v: '127' },
                    { l: '새 댓글', v: '384' },
                    { l: '방문자', v: '892' },
                    { l: '신규 가입', v: '14' },
                  ].map(s => (
                    <div key={s.l} className="flex justify-between py-2.5 border-b border-white/[0.05] last:border-none">
                      <span className="text-[12px] text-[#5A5450]">{s.l}</span>
                      <span className="text-[13px] font-bold text-[#D8CEB8]" style={{ fontVariantNumeric: 'tabular-nums' }}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 광고 하단 */}
              <div>
                <p className="text-[8px] tracking-[0.15em] uppercase text-[#2A2A2E] mb-2" style={{ fontFamily: 'var(--font-space-mono)' }}>Advertisement</p>
                <div className="border border-dashed border-white/8 rounded-xl h-48 flex flex-col items-center justify-center gap-1" style={{ background: '#16161A' }}>
                  <BarChart2 className="w-5 h-5 text-[#2A2A2E]" />
                  <span className="text-[10px] text-[#2A2A2E]">광고 배너 244×180</span>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── 모바일 하단 탭바 ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/[0.07] grid grid-cols-5 z-30" style={{ background: 'rgba(15,15,16,0.97)', backdropFilter: 'blur(20px)' }}>
          {[
            { icon: '🏠', label: '홈', href: '/' },
            { icon: '📰', label: '매거진', href: '/archive' },
            { icon: null, label: '글쓰기', href: null },
            { icon: '🔔', label: '알림', href: '#' },
            { icon: '👤', label: 'MY', href: '/mypage' },
          ].map((item, i) =>
            item.icon === null ? (
              <button
                key={i}
                onClick={handleWriteClick}
                className="flex flex-col items-center justify-center py-1 relative"
              >
                <div
                  className="w-10 h-10 bg-gold rounded-full flex items-center justify-center -mt-6"
                  style={{ boxShadow: '0 4px 16px rgba(201,169,110,0.4)' }}
                >
                  <Plus className="w-5 h-5 text-[#0F0F10]" />
                </div>
                <span className="text-[9px] text-[#3A3630] mt-1">글쓰기</span>
              </button>
            ) : (
              
                <a
                key={i}
                href={item.href!}
                className="flex flex-col items-center justify-center py-2.5 gap-0.5 text-[#4A4640] hover:text-[#8A8278] transition-colors"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-[9px]">{item.label}</span>
              </a>
            )
          )}
        </nav>
        <div className="md:hidden h-16" />
      </main>

      <Footer />
    </>
  )
}