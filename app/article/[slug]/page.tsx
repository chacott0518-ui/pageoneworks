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
import { articles, type Article } from '@/lib/data';
import { parseArticleDate } from '@/lib/article-selectors';
import { ShareButtons } from './ShareButtons';
import { HeroImage } from './HeroImage';
import { Header } from '@/components/Header';
import { getFAQSchema, getBreadcrumbSchema, getHowToSchema, extractFAQsFromBody, normalizeDate } from '@/lib/schemas'
import { siteConfig, absoluteUrl } from '@/lib/site.config'

const PHONE_HREF = siteConfig.phone.href
import AIQnA from '@/components/AIQnA'
import ConsultCTA from '@/components/ConsultCTA'

const RELATED_LIMIT = 4;
const RELATED_TAG_WEIGHT = 50;
const RELATED_TITLE_WEIGHT = 10;

/** 관련 글 제목 비교용 — 짧은 토큰·연도·흔한 안내어 제외 */
const RELATED_STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'your', 'are', 'was', 'how', 'why',
  'what', 'when', 'guide', 'tips', 'best', 'vs', 'or', 'to', 'of', 'in', 'on', 'a', 'an',
  '가이드', '총정리', '추천', '비교', '정리', '방법', '이유', '이란', '무엇', '언제', '어떻게',
  '완벽', '실전', '체크리스트', '전망', '현황', '기준', '조건', '주의', '확인',
]);

function normalizeRelatedTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function extractRelatedKeywords(...texts: (string | undefined)[]): Set<string> {
  const out = new Set<string>();
  for (const text of texts) {
    if (!text) continue;
    const tokens = text.toLowerCase().match(/[a-z0-9가-힣]{2,}/g) ?? [];
    for (const token of tokens) {
      if (RELATED_STOPWORDS.has(token)) continue;
      if (/^\d{4}$/.test(token)) continue;
      out.add(token);
    }
  }
  return out;
}

function scoreRelatedArticle(current: Article, candidate: Article): number {
  let score = 0;

  const currentTags = new Set(
    (current.tags ?? []).map(normalizeRelatedTag).filter(Boolean),
  );
  for (const tag of candidate.tags ?? []) {
    const normalized = normalizeRelatedTag(tag);
    if (normalized && currentTags.has(normalized)) score += RELATED_TAG_WEIGHT;
  }

  const currentWords = extractRelatedKeywords(current.title, current.titleKo);
  const candidateWords = extractRelatedKeywords(candidate.title, candidate.titleKo);
  Array.from(candidateWords).forEach((word) => {
    if (currentWords.has(word)) score += RELATED_TITLE_WEIGHT;
  });

  return score;
}

/** 관련 글 — 동카테고리 점수 > 타카테고리 점수 > 동카테고리 최신 > 전체 최신, 최대 4개 */
function getRelatedArticles(current: Article, all: Article[], limit = RELATED_LIMIT): Article[] {
  const others = all.filter(
    (a) => a.slug !== current.slug && a.id !== current.id,
  );
  if (others.length === 0) return [];

  const scored = others.map((article) => ({
    article,
    score: scoreRelatedArticle(current, article),
    dateMs: parseArticleDate(article),
    sameCategory: article.categorySlug === current.categorySlug,
  }));

  const byScoreThenDate = (
    a: { score: number; dateMs: number },
    b: { score: number; dateMs: number },
  ) => (b.score !== a.score ? b.score - a.score : b.dateMs - a.dateMs);

  const picked: Article[] = [];
  const seenSlug = new Set<string>();
  const seenId = new Set<string | number>();

  const tryAdd = (article: Article) => {
    if (picked.length >= limit) return;
    if (seenSlug.has(article.slug) || seenId.has(article.id)) return;
    picked.push(article);
    seenSlug.add(article.slug);
    seenId.add(article.id);
  };

  scored
    .filter((row) => row.sameCategory && row.score > 0)
    .sort(byScoreThenDate)
    .forEach((row) => tryAdd(row.article));

  if (picked.length < limit) {
    scored
      .filter((row) => !row.sameCategory && row.score > 0)
      .sort(byScoreThenDate)
      .forEach((row) => tryAdd(row.article));
  }

  if (picked.length < limit) {
    [...others]
      .filter((a) => a.categorySlug === current.categorySlug)
      .sort((a, b) => parseArticleDate(b) - parseArticleDate(a))
      .forEach(tryAdd);
  }

  if (picked.length < limit) {
    [...others]
      .sort((a, b) => parseArticleDate(b) - parseArticleDate(a))
      .forEach(tryAdd);
  }

  return picked;
}

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return {};
  const articleUrl = absoluteUrl(`/article/${article.slug}`);
  return {
    title: `${article.titleKo} — ${siteConfig.name}`,
    description: article.excerpt,
    alternates: { canonical: articleUrl },
    keywords: article.tags ?? [],
    authors: [{ name: article.author ?? siteConfig.name }],
    openGraph: {
      title: article.titleKo,
      description: article.excerpt,
      url: articleUrl,
      images: [{ url: article.image, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: normalizeDate(article.date),
      ...(article.updatedAt && { modifiedTime: normalizeDate(article.updatedAt) }),
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
    const rawLine = lines[i];
    const line = rawLine.trimStart();
    if (line.startsWith('##IMAGE##')) {
      const parts = line.split('##');
      blocks.push({ type: 'image', content: parts[2] || '', caption: parts[4] || '' });
      i++; continue;
    }
    if (line.startsWith('※ 참고 출처')) {
      const sourceLines: string[] = [];
      i++;

      while (i < lines.length) {
        const rawSourceLine = lines[i];
        const sourceLine = rawSourceLine.trimStart();

        if (
          sourceLine.startsWith('Q.') ||
          sourceLine.startsWith('■') ||
          sourceLine.startsWith('##')
        ) {
          break;
        }

        if (sourceLine.trim() !== '') {
          // Keep original characters (URL punctuation etc.), but normalize leading whitespace.
          sourceLines.push(rawSourceLine.trim());
        }

        i++;
      }

      blocks.push({
        type: 'sources',
        content: sourceLines.join('\n'),
      });

      continue;
    }
    if (line.startsWith('Q.')) {
      const next = lines[i + 1] ?? '';
      blocks.push({ type: 'faq', content: line, caption: next.trimStart() });
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
      const caption = parts[2] || '';
      const extra = parts[3] || '';
      const contentLines: string[] = [];

      const inlineContent = parts
        .slice(4)
        .join('##')
        .replace(/##END##/g, '')
        .trim();

      if (inlineContent) {
        contentLines.push(inlineContent);
      }

      const closesInline = line.endsWith('##END##');
      i++;

      if (!closesInline) {
        // Advance until we find a line that contains ##END## (standalone or embedded).
        // This handles both "##END##" alone and "content##END##" patterns.
        while (i < lines.length && !hasEndToken(lines[i].trimStart())) {
          const cleanedLine = lines[i].trim();
          if (cleanedLine) {
            contentLines.push(cleanedLine);
          }
          i++;
        }
        // Consume the terminating line: strip ##END## and keep any preceding content.
        if (i < lines.length && hasEndToken(lines[i].trimStart())) {
          const cleanedLine = lines[i].trimStart().replace(/##END##/g, '').trim();
          if (cleanedLine) {
            contentLines.push(cleanedLine);
          }
          i++;
        }
      }

      blocks.push({
        type: 'infobox',
        content: contentLines.join('\n').replace(/##END##/g, '').trim(),
        caption,
        extra,
      });
      continue;
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
      const rows: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('##TABLEROW##')) {
        rows.push(lines[i].trimStart());
        i++;
      }
      blocks.push({ type: 'table', content: rows.join('\n') });
      continue;
    }
    if (line.startsWith('##YEONSEI##')) {
      blocks.push({ type: 'yeonsi', content: '' });
      i++; continue;
    }
    if (line.startsWith('##CTABLOCK##')) {
      blocks.push({ type: 'ctablock', content: '' });
      i++; continue;
    }
    if (rawLine.trim() === '') { i++; continue; }
    blocks.push({ type: 'paragraph', content: rawLine.trim() });
    i++;
  }
  return blocks;
}

/** Returns true when a line contains the ##END## terminator token. */
const hasEndToken = (s: string) => s.includes('##END##');

// Invisible block types (render null) or structural types that block CTA insertion
const UNSAFE_CURR = new Set(['heading', 'subheading', 'image', 'table', 'statgrid', 'step', 'ctablock']);
const UNSAFE_NEXT = new Set(['image', 'table', 'statgrid', 'step']);

function computeCtaInsertIndex(
  contentBlocks: { type: string; content: string; caption?: string; extra?: string }[]
): number {
  // Only count visible blocks (exclude ctablock which renders null) for position calculation
  const visible = contentBlocks
    .map((b, idx) => ({ block: b, idx }))
    .filter(({ block }) => block.type !== 'ctablock');

  const total = visible.length;
  if (total === 0) return -1;

  const rangeStart = Math.floor(total * 0.4);
  const rangeEnd = Math.ceil(total * 0.6);

  const isSafe = (vi: number): boolean => {
    if (vi < 1) return false;
    const curr = visible[vi].block;
    const next = vi + 1 < total ? visible[vi + 1].block : null;
    if (UNSAFE_CURR.has(curr.type)) return false;
    if (next && UNSAFE_NEXT.has(next.type)) return false;
    return true;
  };

  // Try ideal range (40–60% of visible blocks)
  for (let vi = rangeStart; vi <= rangeEnd && vi < total; vi++) {
    if (isSafe(vi)) return visible[vi].idx;
  }
  // Fallback: search forward from 50%
  const mid = Math.floor(total * 0.5);
  for (let vi = mid; vi < total; vi++) {
    if (isSafe(vi)) return visible[vi].idx;
  }
  // Last resort: search backward from 50%
  for (let vi = mid - 1; vi >= 1; vi--) {
    if (isSafe(vi)) return visible[vi].idx;
  }
  return -1;
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
            fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
            lineHeight: '1.7',
            color: 'rgba(26,26,26,0.65)',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
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

  const related = getRelatedArticles(article, articles);

  const blocks = article.body ? parseBody(article.body) : [];
  const faqBlocks = blocks.filter((b) => b.type === 'faq');
  const contentBlocks = blocks.filter((b) => b.type !== 'faq');
  const ctaInsertIndex = contentBlocks.length > 0 ? computeCtaInsertIndex(contentBlocks) : -1;
  const isCarnguy = article.slug === 'carnguy-import-car-repair-guide';
  // ── 스키마 생성 ──────────────────────────────────────────
  const BASE_URL = 'https://www.pageoneworks.com'
  const articleUrl = `${BASE_URL}/article/${article.slug}`
  const faqs = extractFAQsFromBody(article.body ?? '')
  const faqSchema = getFAQSchema(faqs)
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: '홈', url: BASE_URL },
    { name: article.category, url: `${BASE_URL}/category/${article.categorySlug}` },
    { name: article.titleKo, url: articleUrl },
  ])

  const howToSteps = (article.body ?? '').split('\n')
    .map((line: string) => line.match(/^([0-9]+)단계\s*[—\-]\s*(.+)/))
    .filter(Boolean)
    .map((m: RegExpMatchArray | null) => ({ name: `${m![1]}단계`, text: m![2] }))
  const howToSchema = howToSteps.length >= 2
    ? getHowToSchema(article.titleKo, howToSteps)
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
                fontSize: 'clamp(1.75rem, 3.5vw, 3.2rem)',
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
        <div className="max-w-[760px] mx-auto px-4 md:px-8 pt-8 pb-12 md:py-16">

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5 pb-5 md:mb-10 md:pb-8 border-b border-black/8">
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
                  href={PHONE_HREF}
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
            const blockEl = (() => {
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
                <h2 key={i} className="mt-7 mb-3 pb-3 md:mt-12 md:mb-5 md:pb-4 border-b border-black/10" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.35rem, 3vw, 2rem)', fontWeight: 500, color: '#1a1a1a', borderLeft: '3px solid #1a1aff', paddingLeft: '14px' }}>
                  {block.content}
                </h2>
              );
            }
            if (block.type === 'subheading') {
              return (
                <h3 key={i} className="mt-5 mb-3 md:mt-8 md:mb-4" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)', fontWeight: 500, color: '#1a1a1a' }}>
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
                  <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: 'clamp(1rem, 1.5vw, 1.05rem)', color: 'rgba(26,26,26,0.7)', lineHeight: '1.75' }}>
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
                  <p style={{ fontFamily: 'var(--font-inter)', fontWeight: 400, fontSize: 'clamp(0.9rem, 1.4vw, 1rem)', color: c.text, lineHeight: '1.7', margin: 0, wordBreak: 'keep-all', whiteSpace: 'pre-line' }}>
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
                    const separatorIndex = stat.lastIndexOf(':');
                    const val = separatorIndex >= 0 ? stat.slice(0, separatorIndex) : stat;
                    const label = separatorIndex >= 0 ? stat.slice(separatorIndex + 1) : '';
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
                <div key={i} style={{ margin: '8px 0 24px', fontFamily: 'var(--font-inter)', fontSize: 'clamp(1rem, 1.5vw, 1.05rem)', fontWeight: 300, color: 'rgba(26,26,26,0.75)', lineHeight: '1.72' }}>
                  전문의 자문 및 비밀 상담: 연세365산부인과
                  <br />
                  <a href="https://www.yeonsei365.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1a1aff', textDecoration: 'underline' }}>
                    홈페이지 방문하기
                  </a>
                </div>
              );
            }
            if (block.type === 'ctablock') {
              return null;
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
            if (block.type === 'sources') {
              const sourceLines = block.content
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);

              return (
                <details
                  key={i}
                  style={{
                    margin: '48px 0 24px',
                    padding: '0',
                    borderTop: '1px solid rgba(26,26,26,0.12)',
                    borderBottom: '1px solid rgba(26,26,26,0.12)',
                  }}
                >
                  <summary
                    style={{
                      cursor: 'pointer',
                      padding: '20px 0',
                      fontFamily: 'var(--font-inter)',
                      fontSize: 'clamp(11px, 2.8vw, 14px)',
                      fontWeight: 500,
                      color: '#1a1a1a',
                    }}
                  >
                    참고 출처 보기
                  </summary>

                  <div
                    style={{
                      padding: '0 0 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {sourceLines.map((line, sourceIndex) => (
                      <p
                        key={sourceIndex}
                        style={{
                          margin: 0,
                          fontFamily: 'var(--font-inter)',
                          fontSize: '14px',
                          lineHeight: '1.75',
                          color: 'rgba(26,26,26,0.62)',
                          wordBreak: 'keep-all',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </details>
              );
            }
            if (block.type === 'tool') {
              if (block.content === 'pregnancy-calculator') return <PregnancyCalculator key={i} />;
              if (block.content === 'tax-calculator') return <TaxCalculator key={i} />;
              if (block.content === 'vat-calculator') return <VatCalculator key={i} />;
              return null;
            }
            if (block.type === 'table') {
              const rows = block.content.split('\n').filter(Boolean);
              const maxCols = Math.max(...rows.map(r => r.replace(/^##TABLEROW##/, '').split('||').length));
              const needsScroll = maxCols >= 3;
              return (
                <div key={i} style={{ overflowX: needsScroll ? 'auto' : 'visible', margin: '28px 0 8px' }}>
                  <div style={{ minWidth: needsScroll ? `${maxCols * 130}px` : '100%' }}>
                    {rows.map((row, ri) => {
                      const cells = row.replace(/^##TABLEROW##/, '').split('||');
                      const isHeader = cells[0]?.startsWith('**');
                      const isFirst = ri === 0;
                      const isLast = ri === rows.length - 1;
                      return (
                        <div key={ri} style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: '1px', background: isHeader ? '#1a1a1a' : 'rgba(26,26,26,0.06)', borderRadius: isFirst ? '4px 4px 0 0' : isLast ? '0 0 4px 4px' : '0', marginBottom: ri < rows.length - 1 ? '1px' : '0' }}>
                          {cells.map((cell: string, ci: number) => (
                            <div key={ci} style={{ padding: '10px 14px', fontFamily: isHeader ? 'var(--font-space-mono)' : 'var(--font-inter)', fontSize: isHeader ? '10px' : 'clamp(0.875rem, 1.3vw, 0.95rem)', fontWeight: isHeader ? 600 : 300, color: isHeader ? 'rgba(245,242,237,0.85)' : 'rgba(26,26,26,0.75)', letterSpacing: isHeader ? '0.08em' : '0', textTransform: isHeader ? 'uppercase' : 'none', wordBreak: 'keep-all', minWidth: '80px' }}>
                              {cell.trim().replace(/\*\*/g, '')}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return (
              <p key={i} style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: 'clamp(1rem, 1.5vw, 1.05rem)', color: 'rgba(26,26,26,0.75)', lineHeight: '1.72', marginTop: '12px', marginBottom: '12px', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
                {block.content}
              </p>
            );
            })();

            if (i === ctaInsertIndex) {
              return (
                <React.Fragment key={`cta-wrap-${i}`}>
                  {blockEl}
                  <ConsultCTA
                    categorySlug={article.categorySlug}
                    articleTitle={article.titleKo}
                    category={article.category}
                  />
                </React.Fragment>
              );
            }
            return blockEl;
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
                href={PHONE_HREF}
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
            <div className="mt-10 pt-8 md:mt-14 md:pt-10 border-t border-black/8">
              <h2 className="mb-5 md:mb-8" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.35rem, 3vw, 2rem)', fontWeight: 500, color: '#1a1a1a', borderLeft: '3px solid #1a1aff', paddingLeft: '14px' }}>
                FAQ — 자주 묻는 질문
              </h2>
              <div className="flex flex-col gap-3 md:gap-4">
                {faqBlocks.map((faq, i) => (
                  <details key={i} className="group bg-white border border-black/8">
                    <summary
                      className="flex items-center justify-between gap-3 cursor-pointer list-none p-4 md:p-8 outline-none focus-visible:ring-2 focus-visible:ring-[#1a1aff]/40 [&::-webkit-details-marker]:hidden"
                      style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)', fontWeight: 500, color: '#1a1a1a', minHeight: '44px', wordBreak: 'keep-all' }}
                    >
                      <span>{faq.content}</span>
                      <svg
                        className="w-4 h-4 shrink-0 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ color: 'rgba(26,26,26,0.4)' }}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="px-4 md:px-8 pb-4 md:pb-8 border-t border-black/8">
                      <div className="pt-4">
                        <FaqAnswer text={faq.caption || ''} />
                      </div>
                    </div>
                  </details>
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
                  href={PHONE_HREF}
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
                <a href={PHONE_HREF} className="flex items-center justify-center gap-2.5 flex-1 bg-[#1a1a1a] text-white hover:bg-black/80 transition-colors" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.08em', padding: '16px' }}>
                  <Phone className="w-4 h-4" />
                  지금 바로 상담하기
                </a>
              </div>
            </div>
          )}

{(article.sources?.length ?? 0) > 0 && (
            <details className="group mt-14 pt-10 border-t border-black/8">
              <summary
                className="uppercase mb-6 flex items-center gap-2 cursor-pointer list-none outline-none focus-visible:ring-2 focus-visible:ring-[#1a1aff]/40 [&::-webkit-details-marker]:hidden"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.2em', color: 'rgba(26,26,26,0.35)', minHeight: '32px' }}
              >
                <span>참고 출처 ({article.sources!.length})</span>
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <ul className="flex flex-col gap-3">
                {article.sources!.map((src, i) => (
                  <li key={i} className="flex flex-col gap-1 py-3 border-b border-black/6 last:border-0">
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                        style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 400, color: '#1a1aff', textDecoration: 'underline' }}
                      >
                        {src.name}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 400, color: '#1a1a1a' }}>
                        {src.name}
                      </span>
                    )}
                    {(src.publisher || src.publishedAt) && (
                      <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.08em', color: 'rgba(26,26,26,0.4)' }}>
                        {[src.publisher, src.publishedAt].filter(Boolean).join(' · ')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}

          {related.length > 0 && (
            <section
              className="mt-14 pt-10 border-t border-[#E6E0D6]"
              aria-label="관련 아티클"
            >
              <h2
                className="mb-5 md:mb-6"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  wordBreak: 'keep-all',
                }}
              >
                관련 아티클
              </h2>
              <div
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {related.map((rel) => {
                  const cardTitle = (rel.titleKo || rel.title || '').trim() || '아티클';
                  return (
                    <Link
                      key={rel.slug}
                      href={`/article/${rel.slug}`}
                      className="group flex min-h-[160px] w-[240px] shrink-0 snap-start flex-col rounded-[15px] border border-[#E6E0D6] bg-[#FAF8F5] p-4 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4CBBC] hover:bg-[#FCFBF9] hover:shadow-[0_8px_20px_rgba(26,26,26,0.06)] focus-visible:ring-2 focus-visible:ring-[#C9A96E]/50 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:w-auto lg:min-w-0"
                    >
                      <p
                        className="uppercase"
                        style={{
                          fontFamily: 'var(--font-space-mono)',
                          fontSize: '10px',
                          letterSpacing: '0.14em',
                          color: 'rgba(26,26,26,0.42)',
                        }}
                      >
                        {rel.category}
                      </p>
                      <div className="my-3 h-px w-full bg-[#E6E0D6]" aria-hidden="true" />
                      <h3
                        className="flex-1 text-[15px] font-medium leading-snug text-[#1a1a1a] line-clamp-3"
                        style={{
                          fontFamily: 'var(--font-inter)',
                          wordBreak: 'keep-all',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {cardTitle}
                      </h3>
                      <span
                        className="mt-4 flex h-9 w-9 items-center justify-center self-end rounded-full border border-[#E6E0D6] text-[15px] text-[#1a1a1a]/55 transition-colors duration-200 group-hover:border-[#D4CBBC] group-hover:text-[#1a1a1a]"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <AIQnA category={article.categorySlug} />

          <ShareButtons />
        </div>
      </article>
    </>
  );
}
