// components/community/constants.ts

export type CommunityCategory = {
  slug: string
  label: string
}

export const COMMUNITY_CATEGORIES: CommunityCategory[] = [
  { slug: 'all', label: '전체' },
  { slug: '자유게시판', label: '자유게시판' },
  { slug: '유머·짤', label: '유머·짤' },
  { slug: '정치·시사', label: '정치·시사' },
  { slug: '부동산·청약', label: '부동산·청약' },
  { slug: '주식·코인', label: '주식·코인' },
  { slug: '자동차', label: '자동차' },
  { slug: '맛집·여행', label: '맛집·여행' },
  { slug: '육아·교육', label: '육아·교육' },
  { slug: '연애·결혼', label: '연애·결혼' },
  { slug: '반려동물', label: '반려동물' },
  { slug: '취업·직장', label: '취업·직장' },
  { slug: '창업·사업', label: '창업·사업' },
  { slug: '건강·의료', label: '건강·의료' },
  { slug: '법률·세금', label: '법률·세금' },
  { slug: '인테리어', label: '인테리어' },
  { slug: '패션·뷰티', label: '패션·뷰티' },
  { slug: '스포츠·운동', label: '스포츠·운동' },
  { slug: '게임', label: '게임' },
  { slug: 'IT·테크', label: 'IT·테크' },
  { slug: '기타', label: '기타' },
]

export const HOT_CATEGORIES = new Set(['부동산·청약', '주식·코인'])

export const PAGE_SIZE = 20

export const COMMUNITY_COLORS = {
  bg: '#0d0d0f',
  surface: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.06)',
  gold: '#C9A96E',
  text: 'rgba(255,255,255,0.82)',
  sub: 'rgba(255,255,255,0.4)',
  meta: 'rgba(255,255,255,0.25)',
  hot: '#E8705A',
} as const
