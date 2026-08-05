import { categories, articles } from '@/lib/data'
import { getArticlesByCategorySlug } from '@/lib/article-selectors'
import { getTopicsForCategory } from '@/lib/article-taxonomy'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import CategoryClient from './CategoryClient'
import type { Metadata } from 'next'
import { siteConfig, absoluteUrl } from '@/lib/site.config'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = categories.find((c) => c.slug === params.slug)
  if (!cat) return {}
  const categoryUrl = absoluteUrl(`/category/${params.slug}`)
  return {
    title: `${cat.title} — ${siteConfig.name}`,
    description: cat.descKo,
    alternates: { canonical: categoryUrl },
    openGraph: {
      title: `${cat.title} — ${siteConfig.name}`,
      description: cat.descKo,
      type: 'website',
      url: categoryUrl,
      images: [{ url: cat.image, width: 1200, height: 630, alt: cat.titleKo }],
      siteName: siteConfig.name,
      locale: 'ko_KR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.title} — ${siteConfig.name}`,
      description: cat.descKo,
      images: [cat.image],
    },
  }
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((c) => c.slug === params.slug)
  if (!category) notFound()

  const catArticles = getArticlesByCategorySlug(articles, params.slug).map(
    ({ body: _body, ...rest }) => rest,
  )
  const topics = getTopicsForCategory(params.slug)

  return (
    <CategoryClient
      category={category}
      catArticles={catArticles}
      topics={topics}
      params={params}
    />
  )
}