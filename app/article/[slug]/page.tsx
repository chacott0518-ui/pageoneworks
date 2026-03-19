import { ArticleJsonLd } from '@/components/ArticleJsonLd';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ArticleCredit } from '@/components/ArticleCredit';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { articles } from '@/lib/data';
import { ShareButtons } from './ShareButtons';
import { Header } from '@/components/Header';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  return {
    title: `${article.titleKo} — PAGEONEWORKS`,
    description: article.excerpt,
    openGraph: {
      title: article.titleKo,
      description: article.excerpt,
      images: [{ url: article.image, width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.titleKo,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

function parseBody(body: string) {
  const lines = body.split('\n');
  const blocks: { type: string; content: string; caption?: string }[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('##IMAGE##')) {
      const parts = line.split('##');
      blocks.push({ type: 'image', content: parts[2] || '', caption: parts[4] || '' });
      i++; continue;
    }
    if (line.startsWith('Q.')) {
      blocks.push({ type: 'faq', content: line, caption: lines[i + 1] || '' });
      i += 2; continue;
    }
    if (line.startsWith('■')) {
      blocks.push({ type: 'heading', content: line.replace('■ ', '').replace('■', '') });
      i++; continue;
    }
    if (line.startsWith('【')) {
      blocks.push({ type: 'subheading', content: line });
      i++; continue;
    }
    if (/^[1-4]단계/.test(line)) {
      blocks.push({ type: 'step', content: line });
      i++; continue;
    }
    if (line.trim() === '') { i++; continue; }
    blocks.push({ type: 'paragraph', content: line });
    i++;
  }
  return blocks;
}

function FaqAnswer({ text }: { text: string }) {
  const answer = text.startsWith('A.') ? text.slice(2).trim() : text;
  const sentences = answer.split(/(?<=\.) /).filter(Boolean);
  return (
    <div className="space-y-3">
      {sentences.map((sentence, i) => (
        <p
          key={i}
          style={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 300,
            fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
            lineHeight: '1.65',
            color: 'rgba(26,26,26,0.65)',
          }}
        >
          {sentence.trim()}
        </p>
      ))}
    </div>
  );
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.categorySlug === article.categorySlug && a.id !== article.id)
    .slice(0, 3);

  const blocks = article.body ? parseBody(article.body) : [];
  const faqBlocks = blocks.filter((b) => b.type === 'faq');
  const contentBlocks = blocks.filter((b) => b.type !== 'faq');
  const isCarnguy = article.slug === 'carnguy-import-car-repair-guide';

  return (
    <>
      <Header />
      <ArticleJsonLd article={article} />
      <ReadingProgress />

      {/* 히어로 */}
      <section className="relative w-full bg-black overflow-hidden" style={{ minHeight: '480px' }}>
        <div className="relative w-full" style={{ minHeight: '480px' }}>
          <img
            src={article.image}
            alt={article.titleKo}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/30 to-black/50" />

          {/* 카테고리 백 링크 - 모바일 헤더 아래 */}
          <div className="absolute top-16 md:top-20 left-5 md:left-10 z-10">
            <Link
              href={`/category/${article.categorySlug}`}
              className="inline-flex items-center gap-2 text-cream/60 hover:text-cream uppercase transition-colors"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em' }}
            >
              <ArrowLeft className="w-3 h-3" /> {article.category}
            </Link>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-10 pb-8 md:pb-14">
            <span
              className="inline-block border border-cream/30 text-cream/65 px-3 py-1 mb-4 uppercase"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em' }}
            >
              {article.category}
            </span>
            {/* 모바일에서 제목 짤림 방지: max-w 제거, pr 추가 */}
            <h1
              className="text-cream leading-tight"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.4rem, 3.5vw, 3.2rem)',
                fontWeight: 400,
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                width: '100%',
                paddingRight: '20px',
                lineHeight: '1.3',
              }}
            >
              {article.titleKo}
            </h1>
            <p
              className="text-cream/55 mt-4 leading-relaxed max-w-[640px] pr-4 md:pr-0"
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                fontWeight: 300,
              }}
            >
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span
                className="text-cream/45 uppercase"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}
              >
                {article.date}
              </span>
              <span className="text-cream/20">·</span>
              <span
                className="text-cream/45 uppercase"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}
              >
                {article.readTime} READ
              </span>
              {article.author && (
                <>
                  <span className="text-cream/20">·</span>
                  <span
                    className="text-cream/45 uppercase"
                    style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}
                  >
                    {article.author}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 본문 */}
      <article className="bg-[#f8f7f4] min-h-screen">
        <div className="max-w-[760px] mx-auto px-5 md:px-8 py-12 md:py-16">

          {/* 태그 */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-black/8">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-black/15 uppercase px-3 py-1.5"
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: 'rgba(26,26,26,0.5)',
                  }}
                >
                  # {tag}
                </span>
              ))}
            </div>
          )}

          {/* 카앤가이 정보 박스 */}
          <ArticleCredit article={article} />
          {isCarnguy && (
            <div className="mb-12 p-6 md:p-8 bg-white border border-black/10 shadow-sm">
              <div className="flex flex-col gap-5">
                <div>
                  <p
                    className="uppercase mb-2"
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.25em',
                      color: 'rgba(26,26,26,0.4)',
                    }}
                  >
                    업체 정보
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: 'clamp(1.5rem, 3vw, 1.9rem)',
                      fontWeight: 500,
                      color: '#1a1a1a',
                      marginBottom: '6px',
                    }}
                  >
                    카앤가이 CAR&GUY
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
                      fontWeight: 300,
                      color: 'rgba(26,26,26,0.6)',
                      lineHeight: '1.6',
                    }}
                  >
                    경기도 광주시 광남안로 12 · 국토교통부 인증 1급 자동차공업사
                  </p>
                </div>

                
                <a
                href="tel:027395415"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#1a1a1a] text-white w-full hover:bg-black/80 transition-colors"
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    padding: '16px 24px',
                  }}
                >
                  <Phone className="w-4 h-4" />
                  지금 바로 상담 예약하기
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-black/8">
                {[
                  { num: '15+', label: '년 업력' },
                  { num: '3,200+', label: '누적 수리' },
                  { num: '100%', label: '보험접수 성공률' },
                  { num: '1급', label: '공업사 인증' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center py-2">
                    <p
                      style={{
                        fontFamily: 'var(--font-cormorant)',
                        fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
                        fontWeight: 400,
                        color: '#1a1a1a',
                      }}
                    >
                      {stat.num}
                    </p>
                    <p
                      className="uppercase mt-1"
                      style={{
                        fontFamily: 'var(--font-space-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.1em',
                        color: 'rgba(26,26,26,0.4)',
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 본문 블록 */}
          {contentBlocks.map((block, i) => {
            if (block.type === 'image') {
              return (
                <figure key={i} className="my-8 md:my-10">
                  <img
                    src={block.content}
                    alt={block.caption || ''}
                    className="w-full object-cover"
                    style={{ aspectRatio: '16/9' }}
                    loading="lazy"
                  />
                  {block.caption && (
                    <figcaption
                      className="text-center mt-3 px-5 uppercase"
                      style={{
                        fontFamily: 'var(--font-space-mono)',
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        color: 'rgba(26,26,26,0.4)',
                      }}
                    >
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === 'heading') {
              return (
                <h2
                  key={i}
                  className="mt-12 mb-5 pb-4 border-b border-black/10"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 500,
                    color: '#1a1a1a',
                    borderLeft: '3px solid #1a1aff',
                    paddingLeft: '14px',
                  }}
                >
                  {block.content}
                </h2>
              );
            }
            if (block.type === 'subheading') {
              return (
                <h3
                  key={i}
                  className="mt-8 mb-4"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                    fontWeight: 500,
                    color: '#1a1a1a',
                  }}
                >
                  {block.content}
                </h3>
              );
            }
            if (block.type === 'step') {
              const dashIdx = block.content.indexOf(' — ');
              const stepLabel = dashIdx > -1 ? block.content.slice(0, dashIdx) : block.content;
              const stepText = dashIdx > -1 ? block.content.slice(dashIdx + 3) : '';
              return (
                <div key={i} className="flex gap-5 my-5 p-5 md:p-6 bg-white border border-black/8">
                  <span
                    className="shrink-0 uppercase font-medium mt-0.5"
                    style={{
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      color: '#1a1aff',
                    }}
                  >
                    {stepLabel}
                  </span>
                  <p
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 300,
                      fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                      color: 'rgba(26,26,26,0.7)',
                      lineHeight: '1.8',
                    }}
                  >
                    {stepText}
                  </p>
                </div>
              );
            }
            return (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 300,
                  fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                  color: 'rgba(26,26,26,0.75)',
                  lineHeight: '1.75',
                  marginTop: '12px',
                  marginBottom: '12px',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                {block.content}
              </p>
            );
            
          })}

          {/* FAQ */}
          {faqBlocks.length > 0 && (
            <div className="mt-14 pt-10 border-t border-black/8">
              <h2
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  borderLeft: '3px solid #1a1aff',
                  paddingLeft: '14px',
                }}
              >
                FAQ — 자주 묻는 질문
              </h2>
              <div className="flex flex-col gap-4">
                {faqBlocks.map((faq, i) => (
                  <div key={i} className="p-6 md:p-8 bg-white border border-black/8">
                    <p
                      className="mb-4 pb-3 border-b border-black/8"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: 'clamp(1rem, 1.8vw, 1.1rem)',
                        fontWeight: 500,
                        color: '#1a1a1a',
                      }}
                    >
                      {faq.content}
                    </p>
                    <FaqAnswer text={faq.caption || ''} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 오시는 길 */}
          {isCarnguy && (
            <div className="mt-14 pt-10 border-t border-black/8">
              <h2
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  borderLeft: '3px solid #1a1aff',
                  paddingLeft: '14px',
                }}
              >
                오시는 길
              </h2>

              {/* 구글맵으로 교체 - 카카오 iframe embed 미지원 */}
              <div className="w-full overflow-hidden mb-5 border border-black/8" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.5!2d127.254300!3d37.423400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7Jes6rWs6rSA7J207Yq4!5e0!3m2!1sko!2skr!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="카앤가이 위치"
                />
              </div>

              {/* 주소 + 시간 한줄 버튼식 */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex items-center gap-3 flex-1 px-5 py-4 bg-white border border-black/8">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: 'rgba(26,26,26,0.4)' }} />
                  <div>
                    <p
                      className="uppercase mb-0.5"
                      style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(26,26,26,0.4)' }}
                    >
                      주소
                    </p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 400, color: '#1a1a1a' }}>
                      경기도 광주시 광남안로 12
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-1 px-5 py-4 bg-white border border-black/8">
                  <Clock className="w-4 h-4 shrink-0" style={{ color: 'rgba(26,26,26,0.4)' }} />
                  <div>
                    <p
                      className="uppercase mb-0.5"
                      style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(26,26,26,0.4)' }}
                    >
                      운영시간
                    </p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 400, color: '#1a1a1a' }}>
                      평일 09:00–18:00 · 야간/주말 24h 긴급
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
               <a
              href="https://map.kakao.com/link/to/카앤가이,37.423400,127.254300"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 flex-1 border border-black/20 hover:border-black/40 transition-colors"
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    color: 'rgba(26,26,26,0.65)',
                    padding: '16px',
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  카카오맵으로 길찾기
                </a>
                
                <a
                href="tel:027395415"
                  className="flex items-center justify-center gap-2.5 flex-1 bg-[#1a1a1a] text-white hover:bg-black/80 transition-colors"
                  style={{
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.08em',
                    padding: '16px',
                  }}
                >
                  <Phone className="w-4 h-4" />
                  지금 바로 상담하기
                </a>
              </div>
            </div>
          )}

          <ShareButtons />
        </div>

        {/* 관련 아티클 */}
        {related.length > 0 && (
          <section className="border-t border-black/8 py-14 px-5 md:px-10 bg-[#f0ede8]">
            <div className="max-w-[1200px] mx-auto">
              <p
                className="uppercase mb-8"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.35)' }}
              >
                Related Articles
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/article/${rel.slug}`} className="group">
                    <div className="overflow-hidden aspect-video mb-4">
                      <img
                        src={rel.image}
                        alt={rel.titleKo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <p
                      className="uppercase mb-2"
                      style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.4)' }}
                    >
                      {rel.category}
                    </p>
                    <h4
                      className="font-light leading-snug group-hover:italic transition-all"
                      style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#1a1a1a' }}
                    >
                      {rel.titleKo}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}