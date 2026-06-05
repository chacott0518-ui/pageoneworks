// components/community/SkeletonPostCard.tsx

export function SkeletonPostCard() {
  return (
    <div
      className="h-[52px] flex items-center gap-3 px-3 animate-pulse"
      style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}
    >
      <div className="w-12 h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="flex-1 h-4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="w-24 h-3 rounded hidden sm:block" style={{ background: 'rgba(255,255,255,0.04)' }} />
      <div className="w-10 h-3 rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  )
}

export function SkeletonPostList({ count = 8 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonPostCard key={i} />
      ))}
    </div>
  )
}
