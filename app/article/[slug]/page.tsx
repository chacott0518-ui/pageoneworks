import { ArticleJsonLd } from '@/components/ArticleJsonLd';
import { ReadingProgress } from '@/components/ReadingProgress';
import { ArticleCredit } from '@/components/ArticleCredit';
import PregnancyCalculator from '@/components/PregnancyCalculator';
import TaxCalculator from '@/components/TaxCalculator';
import VatCalculator from '@/components/VatCalculator';
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import ArticleViewCount from '@/components/ArticleViewCount';
import { articles } from '@/lib/data';
import { ShareButtons } from './ShareButtons';
import { HeroImage } from './HeroImage';
import { Header } from '@/components/Header';
import { getArticleSchema, getFAQSchema, getBreadcrumbSchema, getSpeakableSchema, getHowToSchema, extractFAQsFromBody, normalizeDate } from '@/lib/schemas'
import AIQnA from '@/components/AIQnA'
import CtaBlock from '@/components/CtaBlock'

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
    alternates: { canonical: `https://www.pageoneworks.com/article/${article.slug}` },
    keywords: article.tags ?? [],
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
  const blocks: { type: string; content: string; caption?: string; extra?: string }[] = [];
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
    if (line.startsWith('\u25a0')) {
      blocks.push({ type: 'heading', content: line.replace('\u25a0 ', '').replace('\u25a0', '') });
      i++; continue;
    }
    if (line.startsWith('\u3010')) {
      blocks.push({ type: 'subheading', content: line });
      i++; continue;
    }
    if (/^[1-9]\uB2E8\uACC4/.test(line)) {
      blocks.push({ type: 'step', content: line });
      i++; continue;
    }
    if (line.startsWith('##TOOL##')) {
      const parts = line.split('##');
      blocks.push({ type: 'tool', content: parts[2] || '' });
      i++; continue;
    }
    if (line.startsWith('##CTA##')) {
      const inner = line.replace('##CTA##', '').replace('##END##', '');
      const [btnText, phone] = inner.split('||');
      blocks.push({ type: 'cta', content: btnText?.trim() || '\uBB34\uB8CC \uC0C1\uB2F4', caption: phone?.trim() || '' });
      i++; continue;
    }
    if (line.startsWith('##INFOBOX##')) {
      const parts = line.split('##');
      blocks.push({ type: 'infobox', content: parts[4] || '', caption: parts[2] || '', extra: parts[3] || '' });
      i++; continue;
    }
    if (line.startsWith('##STATGRID##')) {
      blocks.push({ type: 'statgrid', content: line.replace(/^##STATGRID##/, '').replace(/##END##$/, '') });
      i++; continue;
    }
    if (line.startsWith('##MOSAIC##')) {
      blocks.push({ type: 'mosaic', content: line.replace(/^##MOSAIC##/, '').replace(/##END##$/, '') });
      i++; continue;
    }
    if (line.startsWith('##TABLEROW##')) {
      const cells = line.replace(/^##TABLEROW##/, '').split('||');
      blocks.push({ type: 'tablerow', content: line, caption: cells[0] || '', extra: cells[1] || '' });
      i++; continue;
    }
    if (line.startsWith('##YEONSEI##')) {
      blocks.push({ type: 'yeonsi', content: '' });
      i++; continue;
    }
    if (line.startsWith('##CTABLOCK##')) {
      blocks.push({ type: 'ctablock', content: '' });
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
  // ── 스키마 생성 ──────────────────────────────────────────
  const BASE_URL = 'https://www.pageoneworks.com'
  const articleUrl = `${BASE_URL}/article/${article.slug}`
  const dateISO = normalizeDate(article.date)
  const faqs = extractFAQsFromBody(article.body ?? '')
  const articleSchema = getArticleSchema({
    title: article.titleKo,
    description: article.excerpt,
    url: articleUrl,
    imageUrl: article.heroImage ?? article.image,
    datePublished: dateISO,
    authorName: article.author ?? 'PAGEONEWORKS 편집부',
    category: article.category,
    tags: article.tags ?? [],
  })
  const faqSchema = getFAQSchema(faqs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: '홈', url: BASE_URL },
    { name: article.category, url: `${BASE_URL}/category/${article.categorySlug}` },
    { name: article.titleKo, url: articleUrl },
  ])
  const speakableSchema = getSpeakableSchema(articleUrl, article.titleKo)

  const howToSteps = (article.body ?? '').split('\n')
    .map((line: string) => line.match(/^([0-9]+)단계\s*[—\-]\s*(.+)/))
    .filter(Boolean)
    .map((m: RegExpMatchArray | null) => ({ name: `${m![1]}단계`, text: m![2] }))
  const howToSchema = howToSteps.length >= 2
    ? getHowToSchema(article.titleKo, howToSteps)
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {howToSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />}
      <Header />
      <ArticleJsonLd article={article} />
      <ReadingProgress />

      <section className="relative w-full overflow-hidden pt-14 md:pt-0" style={{ background: '#000', fontSize: 0 }}>
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '21/9', minHeight: '320px', fontSize: 'initial', backgroundColor: '#1a1a1a' }}>
        <HeroImage
            src={article.heroImage ?? article.image}
            alt={article.titleKo}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/30 to-black/50" />
          <div className="absolute bottom-0 left-0 right-0 px-5 md:px-10 pb-4 md:pb-14">
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/category/${article.categorySlug}`}
                className="inline-flex items-center text-cream/55 hover:text-cream transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
              </Link>
              <span
                className="inline-block bg-[#C9A96E] text-[#0F0F10] font-bold px-2 py-0.5 rounded-sm text-[10px] tracking-widest uppercase"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                {article.category}
              </span>
            </div>
            <h1
              className="leading-tight"
              style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: 'clamp(1.4rem, 3.5vw, 3.2rem)',
                fontWeight: 700,
                color: '#ffffff',
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
              className="hidden md:block text-cream/85 mt-4 leading-relaxed max-w-[640px] pr-4 md:pr-0"
              style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', fontWeight: 300 }}
            >
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="text-cream/70 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
                {article.date}
              </span>
              <span className="text-cream/20">·</span>
              <span className="text-cream/70 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
                {article.readTime} READ
              </span>
              {article.author && (
                <>
                  <span className="text-cream/20">·</span>
                  <span className="text-cream/70 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em' }}>
                    {article.author}
                  </span>
                </>
              )}
              <ArticleViewCount slug={article.slug} />
            </div>
          </div>
        </div>
      </section>

      <article className="bg-[#f8f7f4] min-h-screen">
        <div className="max-w-[760px] mx-auto px-5 md:px-8 py-12 md:py-16">

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-black/8">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-black/15 uppercase px-3 py-1.5"
                  style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.5)' }}
                >
                  # {tag}
                </span>
              ))}
            </div>
          )}

          <ArticleCredit article={article} />
          {isCarnguy && (
            <div className="mb-12 p-6 md:p-8 bg-white border border-black/10 shadow-sm">
              <div className="flex flex-col gap-5">
                <div>
                  <p className="uppercase mb-2" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.25em', color: 'rgba(26,26,26,0.4)' }}>
                    업체 정보
                  </p>
                  <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', fontWeight: 500, color: '#1a1a1a', marginBottom: '6px' }}>
                    카앤가이 CAR&GUY
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', fontWeight: 300, color: 'rgba(26,26,26,0.6)', lineHeight: '1.6' }}>
                    경기도 광주시 광남안로 12 · 국토교통부 인증 1급 자동차공업사
                  </p>
                </div>
                <a
                  href="tel:027395415"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#1a1a1a] text-white w-full hover:bg-black/80 transition-colors"
                  style={{ fontFamily: 'var(--font-space-mono)', fontSize: '13px', letterSpacing: '0.1em', padding: '16px 24px' }}
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
                    <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', fontWeight: 400, color: '#1a1a1a' }}>
                      {stat.num}
                    </p>
                    <p className="uppercase mt-1" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(26,26,26,0.4)' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {contentBlocks.map((block, i) => {
            if (block.type === 'image') {
              return (
                <figure key={i} className="my-8 md:my-10">
                  <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                    <Image src={block.content} alt={block.caption || ''} fill className="object-cover" sizes="(max-width: 768px) 100vw, 760px" quality={75} loading="lazy" />
                  </div>
                  {block.caption && (
                    <figcaption className="text-center mt-3 px-5 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.4)' }}>
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === 'heading') {
              return (
                <h2 key={i} className="mt-12 mb-5 pb-4 border-b border-black/10" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 500, color: '#1a1a1a', borderLeft: '3px solid #1a1aff', paddingLeft: '14px' }}>
                  {block.content}
                </h2>
              );
            }
            if (block.type === 'subheading') {
              return (
                <h3 key={i} className="mt-8 mb-4" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', fontWeight: 500, color: '#1a1a1a' }}>
                  {block.content}
                </h3>
              );
            }
            if (block.type === 'step') {
              const dashIdx = block.content.indexOf(' \u2014 ');
              const stepLabel = dashIdx > -1 ? block.content.slice(0, dashIdx) : block.content;
              const stepText = dashIdx > -1 ? block.content.slice(dashIdx + 3) : '';
              return (
                <div key={i} className="flex gap-5 my-5 p-5 md:p-6 bg-white border border-black/8">
                  <span className="shrink-0 uppercase font-medium mt-0.5" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em', color: '#1a1aff' }}>
                    {stepLabel}
                  </span>
                  <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', color: 'rgba(26,26,26,0.7)', lineHeight: '1.8' }}>
                    {stepText}
                  </p>
                </div>
              );
            }
            if (block.type === 'infobox') {
              const colorMap: Record<string, { bg: string; border: string; title: string; text: string }> = {
                blue:   { bg: '#EFF6FF', border: '#2563EB', title: '#1E40AF', text: '#1E3A8A' },
                green:  { bg: '#F0FDF4', border: '#16A34A', title: '#166534', text: '#14532D' },
                amber:  { bg: '#FFFBEB', border: '#D97706', title: '#92400E', text: '#78350F' },
                red:    { bg: '#FFF1F2', border: '#E11D48', title: '#9F1239', text: '#881337' },
                purple: { bg: '#FAF5FF', border: '#7C3AED', title: '#5B21B6', text: '#4C1D95' },
              };
              const c = colorMap[block.extra || 'blue'] || colorMap.blue;
              return (
                <div key={i} style={{ background: c.bg, borderLeft: `4px solid ${c.border}`, borderRadius: '0 8px 8px 0', padding: '20px 24px', margin: '24px 0' }}>
                  {block.caption && (
                    <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: c.border, marginBottom: '8px', fontWeight: 600 }}>
                      {block.caption}
                    </p>
                  )}
                  <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, fontSize: 'clamp(0.9rem, 1.4vw, 1rem)', color: c.text, lineHeight: '1.7', margin: 0, wordBreak: 'keep-all' }}>
                    {block.content}
                  </p>
                </div>
              );
            }
            if (block.type === 'statgrid') {
              const stats = block.content.split('||').map((s: string) => s.trim()).filter(Boolean);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', margin: '28px 0' }}>
                  {stats.map((stat: string, si: number) => {
                    const [val, label] = stat.split(':');
                    return (
                      <div key={si} style={{ background: '#1a1a1a', borderRadius: '4px', padding: '20px 16px', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: '#f5f2ed', margin: '0 0 4px' }}>{val?.trim()}</p>
                        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,242,237,0.5)', margin: 0 }}>{label?.trim()}</p>
                      </div>
                    );
                  })}
                </div>
              );
            }
            if (block.type === 'mosaic') {
              const mParts = block.content.split('||');
              const mImgs: { url: string; cap: string }[] = [];
              for (let mi = 0; mi < mParts.length; mi += 2) {
                const u = mParts[mi]?.trim();
                if (u) mImgs.push({ url: u, cap: mParts[mi + 1]?.trim() || '' });
              }
              const capOverlay = (cap: string) => cap ? (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.68))', padding: '24px 12px 10px', fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.75)' }}>{cap}</div>
              ) : null;
              const imgBox = (img: { url: string; cap: string }, extraStyle: React.CSSProperties = {}) => (
                <div style={{ position: 'relative', overflow: 'hidden', ...extraStyle }}>
                  <Image src={img.url} alt={img.cap} fill sizes="(max-width: 768px) 100vw, 800px" quality={75} style={{ objectFit: 'cover', display: 'block' }} />
                  {capOverlay(img.cap)}
                </div>
              );
              if (mImgs.length === 2) {
                return <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '4px', margin: '32px 0' }}>{imgBox(mImgs[0], { aspectRatio: '4/3' })}{imgBox(mImgs[1], { aspectRatio: '4/3' })}</div>;
              }
              if (mImgs.length === 3) {
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '32px 0' }}>
                    {imgBox(mImgs[0], { gridColumn: '1 / -1', aspectRatio: '21/8' })}
                    {mImgs.slice(1).map((img, mi) => (
                      <div key={mi} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
                        <Image src={img.url} alt={img.cap} fill sizes="(max-width: 768px) 100vw, 800px" quality={75} style={{ objectFit: 'cover', display: 'block' }} />
                        {capOverlay(img.cap)}
                      </div>
                    ))}
                  </div>
                );
              }
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '32px 0' }}>
                  {mImgs.slice(0, 4).map((img, mi) => (
                    <div key={mi} style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1/1' }}>
                      <Image src={img.url} alt={img.cap} fill sizes="(max-width: 768px) 100vw, 800px" quality={75} style={{ objectFit: 'cover', display: 'block' }} />
                      {capOverlay(img.cap)}
                    </div>
                  ))}
                </div>
              );
            }
            if (block.type === 'yeonsei') {
              return (
                <div key={i} style={{ margin: '8px 0 24px', fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', fontWeight: 300, color: 'rgba(26,26,26,0.75)', lineHeight: '1.75' }}>
                  전문의 자문 및 비밀 상담: 연세365산부인과
                  <br />
                  <a href="https://www.yeonsei365.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1a1aff', textDecoration: 'underline' }}>
                    홈페이지 방문하기
                  </a>
                </div>
              );
            }
            if (block.type === 'ctablock') {
              return <CtaBlock key={i} />;
            }
            if (block.type === 'cta') {
              return (
                <div key={i} style={{ margin: '32px 0', display: 'flex', justifyContent: 'center' }}>
                  <a
                    href={`tel:${block.caption?.replace(/-/g, '')}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: '#1a1a1a',
                      color: '#f5f2ed',
                      padding: '18px 40px',
                      fontFamily: 'var(--font-space-mono)',
                      fontSize: '13px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                      textDecoration: 'none',
                      borderRadius: '2px',
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    {block.content}
                  </a>
                </div>
              );
            }
            if (block.type === 'tool') {
              if (block.content === 'pregnancy-calculator') return <PregnancyCalculator key={i} />;
              if (block.content === 'tax-calculator') return <TaxCalculator key={i} />;
              if (block.content === 'vat-calculator') return <VatCalculator key={i} />;
              return null;
            }
            if (block.type === 'tablerow') {
              const cells = block.content.replace(/^##TABLEROW##/, '').split('||');
              const isHeader = cells[0]?.startsWith('**');
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: '1px', background: isHeader ? '#1a1a1a' : 'rgba(26,26,26,0.06)', borderRadius: i === 0 ? '4px 4px 0 0' : '0', marginTop: isHeader ? '28px' : '0', marginBottom: '1px' }}>
                  {cells.map((cell: string, ci: number) => (
                    <div key={ci} style={{ padding: '12px 16px', fontFamily: isHeader ? 'var(--font-space-mono)' : 'var(--font-inter)', fontSize: isHeader ? '10px' : 'clamp(0.85rem, 1.3vw, 0.95rem)', fontWeight: isHeader ? 600 : 300, color: isHeader ? 'rgba(245,242,237,0.85)' : 'rgba(26,26,26,0.75)', letterSpacing: isHeader ? '0.08em' : '0', textTransform: isHeader ? 'uppercase' : 'none', wordBreak: 'keep-all' }}>
                      {cell.trim().replace(/\*\*/g, '')}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <p key={i} style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', color: 'rgba(26,26,26,0.75)', lineHeight: '1.75', marginTop: '12px', marginBottom: '12px', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
                {block.content}
              </p>
            );
          })}

          {isCarnguy && (
            <div style={{
              background: '#1a1a1a',
              borderRadius: '8px',
              padding: '20px',
              margin: '32px 0',
            }}>
              <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '6px' }}>
                카앤가이 CAR&GUY
              </p>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
                수입차 사고수리 무료 상담
              </p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.55)', marginBottom: '16px' }}>
                경기도 광주 · 강남·판교 무상 픽업 · 24시간 접수
              </p>
              <a
                href="tel:027395415"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#fff',
                  color: '#1a1a1a',
                  padding: '14px',
                  borderRadius: '5px',
                  fontFamily: 'var(--font-space-mono)',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                }}
              >
                <Phone className="w-4 h-4" />
                지금 바로 상담 예약하기
              </a>
            </div>
          )}

          {faqBlocks.length > 0 && (
            <div className="mt-14 pt-10 border-t border-black/8">
              <h2 className="mb-8" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 500, color: '#1a1a1a', borderLeft: '3px solid #1a1aff', paddingLeft: '14px' }}>
                FAQ — 자주 묻는 질문
              </h2>
              <div className="flex flex-col gap-4">
                {faqBlocks.map((faq, i) => (
                  <div key={i} className="p-6 md:p-8 bg-white border border-black/8">
                    <p className="mb-4 pb-3 border-b border-black/8" style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(1rem, 1.8vw, 1.1rem)', fontWeight: 500, color: '#1a1a1a' }}>
                      {faq.content}
                    </p>
                    <FaqAnswer text={faq.caption || ''} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCarnguy && (
            <div className="mt-14 pt-10 border-t border-black/8">
              <div style={{
                border: '1.5px solid #C9A96E',
                borderRadius: '8px',
                padding: '16px 18px',
                margin: '0 0 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap' as const,
              }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 500, color: '#1a1a1a', marginBottom: '3px' }}>
                    카앤가이 무료 상담 신청
                  </p>
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 300, color: 'rgba(26,26,26,0.55)' }}>
                    빠른 견적 · 보험 처리 대행 · 무상 픽업
                  </p>
                </div>
                <a
                  href="tel:027395415"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: '#C9A96E',
                    color: '#0F0F10',
                    padding: '12px 20px',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-space-mono)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  <Phone className="w-3.5 h-3.5" />
                  무료 상담 신청
                </a>
              </div>

              <h2 className="mb-8" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 500, color: '#1a1a1a', borderLeft: '3px solid #1a1aff', paddingLeft: '14px' }}>
                오시는 길
              </h2>
              <div className="w-full overflow-hidden mb-5 border border-black/8" style={{ aspectRatio: '16/9' }}>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.5!2d127.254300!3d37.423400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z7Jes6rWs6rSA7J207Yq4!5e0!3m2!1sko!2skr!4v1" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="카앤가이 위치" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex items-center gap-3 flex-1 px-5 py-4 bg-white border border-black/8">
                  <MapPin className="w-4 h-4 shrink-0" style={{ color: 'rgba(26,26,26,0.4)' }} />
                  <div>
                    <p className="uppercase mb-0.5" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(26,26,26,0.4)' }}>주소</p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 400, color: '#1a1a1a' }}>경기도 광주시 광남안로 12</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-1 px-5 py-4 bg-white border border-black/8">
                  <Clock className="w-4 h-4 shrink-0" style={{ color: 'rgba(26,26,26,0.4)' }} />
                  <div>
                    <p className="uppercase mb-0.5" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(26,26,26,0.4)' }}>운영시간</p>
                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 400, color: '#1a1a1a' }}>평일 09:00–18:00 · 야간/주말 24h 긴급</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://map.kakao.com/link/to/카앤가이,37.423400,127.254300" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 flex-1 border border-black/20 hover:border-black/40 transition-colors" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(26,26,26,0.65)', padding: '16px' }}>
                  <ExternalLink className="w-4 h-4" />
                  카카오맵으로 길찾기
                </a>
                <a href="tel:027395415" className="flex items-center justify-center gap-2.5 flex-1 bg-[#1a1a1a] text-white hover:bg-black/80 transition-colors" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.08em', padding: '16px' }}>
                  <Phone className="w-4 h-4" />
                  지금 바로 상담하기
                </a>
              </div>
            </div>
          )}

<AIQnA category={article.categorySlug} />

          <ShareButtons />
        </div>

        {related.length > 0 && (
          <section className="border-t border-black/8 py-14 px-5 md:px-10 bg-[#f0ede8]">
            <div className="max-w-[1200px] mx-auto">
              <p className="uppercase mb-8" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.35)' }}>
                Related Articles
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/article/${rel.slug}`} className="group">
                    <div className="relative overflow-hidden aspect-video mb-4">
                    <Image src={rel.image} alt={rel.titleKo} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={75} loading="lazy" />
                    </div>
                    <p className="uppercase mb-2" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(26,26,26,0.4)' }}>
                      {rel.category}
                    </p>
                    <h4 className="font-light leading-snug group-hover:italic transition-all" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.1rem, 2vw, 1.3rem)', color: '#1a1a1a' }}>
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
