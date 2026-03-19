import type { Article } from '@/lib/data';

interface Props {
  article: Pick<Article, 'author' | 'date' | 'readTime' | 'isSponsored' | 'sponsorName' | 'sponsorUrl'>;
}

export function ArticleCredit({ article }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-5 border-y border-black/8 mb-10">

      {/* 왼쪽: 작성자 + 날짜 */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p
            className="uppercase"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.35)' }}
          >
            글
          </p>
          <p
            className="mt-0.5"
            style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 400, color: '#1a1a1a' }}
          >
            {article.author ?? 'PAGEONEWORKS'}
          </p>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div>
          <p
            className="uppercase"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.35)' }}
          >
            발행일
          </p>
          <p
            className="mt-0.5"
            style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 400, color: '#1a1a1a' }}
          >
            {article.date}
          </p>
        </div>

        <div className="w-px h-8 bg-black/10" />

        <div>
          <p
            className="uppercase"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.35)' }}
          >
            읽기 시간
          </p>
          <p
            className="mt-0.5"
            style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 400, color: '#1a1a1a' }}
          >
            {article.readTime}
          </p>
        </div>
      </div>

      {/* 오른쪽: 스폰서 배지 */}
      {article.isSponsored && article.sponsorName && (
        
        <a
        href={article.sponsorUrl ?? '#'}
          className="inline-flex items-center gap-2 px-4 py-2 border border-black/15 hover:border-black/30 transition-colors self-start sm:self-center"
          style={{ textDecoration: 'none' }}
        >
          <span
            className="uppercase"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.4)' }}
          >
            Sponsored
          </span>
          <span
            className="w-px h-3 bg-black/15"
          />
          <span
            style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 500, color: '#1a1a1a' }}
          >
            {article.sponsorName}
          </span>
        </a>
      )}
    </div>
  );
}