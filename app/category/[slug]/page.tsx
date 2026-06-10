import { categories, articles } from '@/lib/data'
import { notFound } from 'next/navigation'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import CategoryClient from './CategoryClient'
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
  }
}

export default function CategoryPage({ params }: Props) {
  const category = categories.find((c) => c.slug === params.slug)
  if (!category) notFound()

  const catArticles = articles.filter((a) => a.categorySlug === params.slug)

  return <CategoryClient category={category} catArticles={catArticles} params={params} />
}