import { MetadataRoute } from 'next'
import { articles, categories } from '@/lib/data'
import { siteConfig } from '@/lib/site.config'
import { getSitemapArticles, normalizeArticleDate } from '@/lib/article-selectors'

const BASE_URL = siteConfig.baseUrl

export default function sitemap(): MetadataRoute.Sitemap {

  // ─── 고정 페이지들 ─────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/archive`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/advertise`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/notice`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/cookie`,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ]

  // ─── 카테고리 페이지들 ─────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.slug !== 'archive')
    .map((cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

  // ─── 아티클 페이지들 ───────────────────────────────────────
  const sitemapArticles = getSitemapArticles(articles)
  const articlePages: MetadataRoute.Sitemap = sitemapArticles.map((article) => ({
    url: `${BASE_URL}/article/${article.slug}`,
    lastModified: new Date(normalizeArticleDate(article)),
    changeFrequency: 'monthly' as const,
    priority: article.featured ? 0.85 : 0.75,
  }))

  return [...staticPages, ...categoryPages, ...articlePages]
}