// components/community/types.ts

export type SortKey = 'latest' | 'popular' | 'comment'

export type CommunityPost = {
  id: string
  user_id: string | null
  category_slug: string
  title: string
  content: string
  view_count: number | null
  like_count: number | null
  comment_count: number | null
  is_pinned: boolean | null
  is_hidden: boolean | null
  created_at: string
}

export type CommunityStats = {
  todayNewPosts: number
  todayComments: number
  todayVisits: number
  todayNewMembers: number
}

export type CategoryCountMap = Record<string, number>

export type TrendingPost = Pick<
  CommunityPost,
  'id' | 'title' | 'category_slug' | 'view_count' | 'comment_count' | 'created_at'
>

export type ProfileMini = {
  id: string
  nickname: string
  avatar_url: string | null
  level: number
  post_count: number | null
  is_admin: boolean | null
}
