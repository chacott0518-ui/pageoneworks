import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { categories, articles } from '@/lib/data'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }))
}

const BASE_URL = 'https://www.pageoneworks.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === params.slug)
  if (!cat) return {}
  return {
    title: `${cat.title} — PAGEONEWORKS`,
    description: cat.descKo,
    alternates: { canonical: `${BASE_URL}/category/${params.slug}` },
    openGraph: {
      title: `${cat.title} — PAGEONEWORKS`,
      description: cat.descKo,
      type: 'website',
      url: `${BASE_URL}/category/${params.slug}`,
      images: [{ url: cat.image, width: 1200, height: 630, alt: cat.titleKo }],
      siteName: 'PAGEONEWORKS',
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.title} — PAGEONEWORKS`,
      description: cat.descKo,
      images: [cat.image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  }
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((c) => c.slug === params.slug)
  if (!category) notFound()

  const catArticles = articles.filter((a) => a.categorySlug === params.slug)
  const categoryUrl = `${BASE_URL}/category/${params.slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: category.titleKo, item: categoryUrl },
    ],
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.titleKo} — PAGEONEWORKS`,
    url: categoryUrl,
    description: category.descKo,
    publisher: {
      '@type': 'Organization',
      name: 'PAGEONEWORKS',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo.png` },
    },
  }

  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${category.titleKo} — PAGEONEWORKS`,
    url: categoryUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.speakable-summary'],
    },
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.titleKo} 최신 아티클`,
    url: categoryUrl,
    numberOfItems: catArticles.length,
    itemListElement: catArticles.slice(0, 10).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: a.titleKo,
      url: `${BASE_URL}/article/${a.slug}`,
      image: a.image,
      description: a.excerpt,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${category.titleKo} 콘텐츠는 어디서 볼 수 있나요?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `PAGEONEWORKS ${category.titleKo} 카테고리(${categoryUrl})에서 전문가가 작성한 심층 아티클을 무료로 볼 수 있습니다. ${category.descKo}`,
        },
      },
      {
        '@type': 'Question',
        name: `PAGEONEWORKS ${category.titleKo} 카테고리에는 어떤 내용이 있나요?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `PAGEONEWORKS ${category.titleKo} 카테고리에는 현재 ${catArticles.length}개의 전문가 아티클이 있습니다. ${category.descKo} 최신 콘텐츠를 정기적으로 업데이트합니다.`,
        },
      },
    ],
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PAGEONEWORKS',
    url: BASE_URL,
    logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo.png` },
    sameAs: [
      'https://www.instagram.com/pageoneworks',
      'https://www.youtube.com/@pageoneworks',
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />

      <Header />

      <section className="relative overflow-hidden" style={{ minHeight: '55vh' }}>
        <div className="absolute inset-0">
          <img
            src={category.image}
            alt={category.titleKo}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/55 to-black/30" />
        </div>

        <div className="relative z-10 flex flex-col justify-end min-h-[55vh] px-5 md:px-12 pb-10 md:pb-14 pt-28 md:pt-40">
          <div className="max-w-[1600px] mx-auto w-full">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-cream/55 hover:text-cream/90 uppercase transition-colors mb-6 md:mb-8"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.15em' }}
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </Link>
            <p
              className="text-cream/50 mb-2 md:mb-3 uppercase speakable-summary"
              style={{ fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.3em' }}
            >
              {category.id} &mdash; {category.desc}
            </p>
            <h1
              className="text-cream leading-none tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.8rem, 8vw, 7rem)', fontWeight: 400 }}
            >
              {category.title}
            </h1>
            <p
              className="text-cream/55 mt-2 md:mt-3 italic"
              style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}
            >
              {category.titleKo}
            </p>
            <p
              className="text-cream/35 mt-1.5 md:mt-2 max-w-[500px] leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(0.8rem, 1.5vw, 1rem)', fontWeight: 300 }}
            >
              {category.descKo}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-24 px-5 md:px-12 bg-[#0a0a0a] text-cream min-h-[40vh]">
        <div className="max-w-[1600px] mx-auto">
          {catArticles.length === 0 ? (
            <div className="text-center py-20 border border-white/5">
              <p
                className="uppercase opacity-40"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.2em' }}
              >
                Coming soon — 준비 중입니다
              </p>
              <p
                className="text-cream/20 mt-3 italic"
                style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem' }}
              >
                곧 새로운 아티클이 업로드됩니다
              </p>
            </div>
          ) : (
            <>
              {catArticles.filter(a => a.featured).slice(0, 1).map((article) => (
                <Link
                  key={`featured-${article.id}`}
                  href={`/article/${article.slug}`}
                  className="group block mb-6 md:mb-10"
                >
                  <div className="relative overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '21/9' }}>
                    <img
                      src={article.image}
                      alt={article.titleKo}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-10">
                      <p className="text-cream/50 uppercase mb-2" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.2em' }}>{article.category}</p>
                      <h2 className="text-cream font-light leading-tight" style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(1.4rem, 3.5vw, 2.8rem)', wordBreak: 'keep-all' }}>{article.titleKo}</h2>
                      <p className="text-cream/40 mt-2 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.08em' }}>{article.date} · {article.readTime}</p>
                    </div>
                  </div>
                </Link>
              ))}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {catArticles.filter((a, idx) => !a.featured || idx !== catArticles.findIndex(x => x.featured)).map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="group block"
                  >
                    <div className="overflow-hidden mb-3 md:mb-4 bg-[#1a1a1a]" style={{ aspectRatio: '4/3' }}>
                      <img
                        src={article.image}
                        alt={article.titleKo}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-cream/40 mb-1.5 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.12em' }}>
                      {article.category}
                    </p>
                    <h3
                      className="font-light text-cream group-hover:italic transition-all leading-snug line-clamp-2"
                      style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(0.95rem, 1.5vw, 1.2rem)', lineHeight: '1.35', wordBreak: 'keep-all' }}
                    >
                      {article.titleKo}
                    </h3>
                    <p className="text-cream/35 mt-1.5 leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-inter)', fontWeight: 300, fontSize: '0.8rem', lineHeight: '1.6' }}>
                      {article.excerpt}
                    </p>
                    <p className="text-cream/25 mt-2 uppercase" style={{ fontFamily: 'var(--font-space-mono)', fontSize: '8px', letterSpacing: '0.08em' }}>
                      {article.date} &middot; {article.readTime} Read
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}