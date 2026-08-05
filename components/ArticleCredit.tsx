import type { Article } from '@/lib/data';

interface Props {
  article: Pick<Article, 'author' | 'date' | 'readTime' | 'isSponsored' | 'sponsorName' | 'sponsorUrl'>;
}

export function ArticleCredit({ article }: Props) {
  return (
    <div className="article-credit flex flex-col gap-3 py-5">
      <p
        className="article-credit-line"
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '13px',
          color: 'rgba(26,26,26,0.55)',
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          margin: 0,
        }}
      >
        <span style={{ color: '#1a1a1a', fontWeight: 500 }}>글 {article.author ?? 'PAGEONEWORKS'}</span>
        <span style={{ margin: '0 8px', color: 'rgba(26,26,26,0.25)' }}>·</span>
        <span>발행일 {article.date}</span>
        <span style={{ margin: '0 8px', color: 'rgba(26,26,26,0.25)' }}>·</span>
        <span>읽기시간 {article.readTime}</span>
      </p>

      {article.isSponsored && article.sponsorName && (
        <a
          href={article.sponsorUrl ?? '#'}
          className="inline-flex items-center gap-2 px-4 py-2 border border-black/15 hover:border-black/30 transition-colors self-start"
          style={{ textDecoration: 'none' }}
        >
          <span
            className="uppercase"
            style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.4)' }}
          >
            Sponsored
          </span>
          <span className="w-px h-3 bg-black/15" />
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
