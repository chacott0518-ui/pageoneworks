// components/admin/posts/PostStatusBadge.tsx

'use client'

import { ADMIN_THEME } from '@/lib/admin/constants'

const T = ADMIN_THEME

export function PostStatusBadge({ post }: { post: { is_pinned: boolean | null; is_hidden: boolean | null } }) {
  if (post.is_pinned) return <span style={{ fontSize: 11, color: T.gold }}>공지</span>
  if (post.is_hidden) return <span style={{ fontSize: 11, color: T.warning }}>블라인드</span>
  return <span style={{ fontSize: 11, color: T.success }}>정상</span>
}
