'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { Article, Category } from '@/lib/data'
import type { CategoryTopic } from '@/lib/article-taxonomy'
import { ALL_TOPIC_VALUE } from '@/lib/article-taxonomy'
import {
  getArticlesByTopic,
  getCategoryFeaturedArticle,
  getCategoryGridArticles,
} from '@/lib/article-selectors'

const INITIAL_COUNT = 8

interface Props {
  category: Category
  catArticles: Article[]
  topics: CategoryTopic[]
  params: { slug: string }
}

export default function CategoryClient({ category, catArticles, topics, params }: Props) {
  const [activeTopic, setActiveTopic] = useState<string>(ALL_TOPIC_VALUE)
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)

  const filteredArticles = useMemo(
    () =>
      activeTopic === ALL_TOPIC_VALUE
        ? catArticles
        : getArticlesByTopic(catArticles, params.slug, activeTopic),
    [activeTopic, catArticles, params.slug],
  )

  const featuredArticle = getCategoryFeaturedArticle(filteredArticles)
  const gridArticles = getCategoryGridArticles(filteredArticles, featuredArticle)
  const visibleGrid = gridArticles.slice(0, visibleCount)
  const hasMore = visibleCount < gridArticles.length
  const showTopicTabs = topics.length > 0

  const handleTopicChange = (topicSlug: string) => {
    setActiveTopic(topicSlug)
    setVisibleCount(INITIAL_COUNT)
  }

  return (
    <>
      <Header />
      <section className="relative overflow-hidden" style={{ minHeight: '55vh' }}>
        <div className="absolute inset-0 overflow-hidden">
          <Image src={category.image} alt={category.titleKo} fill sizes="(max-width: 768px) 100vw, 1600px" quality={75} className="object-cover object-center" priority />
          {/* 약한 전체 오버레이 — 이미지 분위기 보존 */}
          <div className="absolute inset-0 bg-black/18 md:bg-black/12" />
          {/* 하단 그라데이션 — 텍스트 영역 대비 확보 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/15 md:from-black/90 md:via-black/48 md:to-black/10" />
          {/* 좌측 그라데이션 — 텍스트 시작점 대비 보강 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent md:from-black/60 md:via-black/5" />
        </div>
        <div className="relative z-10 flex flex-col justify-end min-h-[55vh] px-5 md:px-12 pb-10 md:pb-14 pt-28 md:pt-40">
          <div className="max-w-[1600px] mx-auto w-full">
            <Link href="/" className="inline-flex items-center gap-2 text-cream/65 hover:text-cream uppercase transition-colors mb-6 md:mb-8" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              <ArrowLeft className="w-3 h-3" /> Back
            </Link>
            <p className="text-cream/65 mb-2 md:mb-3 uppercase speakable-summary" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.3em', textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
              {category.id} &mdash; {category.desc}
            </p>
            <h1 className="text-cream leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.8rem, 8vw, 7rem)', fontWeight: 400, textShadow: '0 2px 10px rgba(0,0,0,0.45)' }}>
              {category.title}
            </h1>
            <p className="text-cream/85 mt-2 md:mt-3 italic" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>
              {category.titleKo}
            </p>
            <p className="text-cream/70 mt-1.5 md:mt-2 max-w-[500px] leading-relaxed" style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', fontWeight: 300, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              {category.descKo}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-5 md:px-12 bg-[#0a0a0a] text-cream min-h-[40vh]">
        <div className="max-w-[1600px] mx-auto">
          {showTopicTabs && (
            <div className="mb-8 md:mb-10">
              <div
                role="tablist"
                aria-label="하위 주제 필터"
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTopic === ALL_TOPIC_VALUE}
                  onClick={() => handleTopicChange(ALL_TOPIC_VALUE)}
                  className={`shrink-0 uppercase px-3 py-2 border transition-all duration-200 ${
                    activeTopic === ALL_TOPIC_VALUE
                      ? 'border-cream text-cream bg-cream/5'
                      : 'border-white/15 text-cream/40 hover:border-white/35 hover:text-cream/65'
                  }`}
                  style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.1em' }}
                >
                  전체
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic.slug}
                    type="button"
                    role="tab"
                    aria-selected={activeTopic === topic.slug}
                    onClick={() => handleTopicChange(topic.slug)}
                    className={`shrink-0 uppercase px-3 py-2 border transition-all duration-200 ${
                      activeTopic === topic.slug
                        ? 'border-cream text-cream bg-cream/5'
                        : 'border-white/15 text-cream/40 hover:border-white/35 hover:text-cream/65'
                    }`}
                    style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.1em', wordBreak: 'keep-all' }}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 border border-white/5">
              <p className="uppercase opacity-40" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.2em' }}>
                {activeTopic === ALL_TOPIC_VALUE ? 'Coming soon — 준비 중입니다' : '이 주제의 아티클 준비 중입니다'}
              </p>
              <p className="text-cream/20 mt-3 italic" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem' }}>
                곧 새로운 아티클이 업로드됩니다
              </p>
            </div>
          ) : (
            <>
              {featuredArticle && (
                <Link key={`featured-${featuredArticle.id}`} href={`/article/${featuredArticle.slug}`} className="group block mb-6 md:mb-10">
                  <div className="relative overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '21/9' }}>
                    <Image src={featuredArticle.image} alt={featuredArticle.titleKo} fill sizes="(max-width: 768px) 100vw, 1600px" quality={75} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-10">
                      <p className="text-cream/50 uppercase mb-2" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em' }}>{featuredArticle.category}</p>
                      <h2 className="text-cream font-light leading-tight" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', wordBreak: 'keep-all' }}>{featuredArticle.titleKo}</h2>
                      <p className="text-cream/40 mt-2 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.08em' }}>{featuredArticle.date} · {featuredArticle.readTime}</p>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {visibleGrid.map((article) => (
                  <Link key={article.id} href={`/article/${article.slug}`} className="group block">
                    <div className="relative overflow-hidden mb-3 md:mb-4 bg-[#1a1a1a]" style={{ aspectRatio: '4/3' }}>
                      <Image src={article.image} alt={article.titleKo} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={75} className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                    <p className="text-cream/40 mb-1.5 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.12em' }}>{article.category}</p>
                    <h3 className="font-light text-cream group-hover:italic transition-all leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)', lineHeight: '1.35', wordBreak: 'keep-all' }}>{article.titleKo}</h3>
                    <p className="text-cream/35 mt-1.5 leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: '0.8rem', lineHeight: '1.6' }}>{article.excerpt}</p>
                    <p className="text-cream/25 mt-2 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.08em' }}>{article.date} &middot; {article.readTime} Read</p>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12 md:mt-16">
                  <button
                    onClick={() => setVisibleCount((v) => v + 8)}
                    className="uppercase border border-white/20 text-cream/60 hover:text-cream hover:border-white/50 transition-all px-10 py-3"
                    style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.2em' }}
                  >
                    더 보기 ({gridArticles.length - visibleCount}개 더)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
