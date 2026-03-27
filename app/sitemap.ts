import { MetadataRoute } from 'next';
import { articles, categories } from '@/lib/data';

const BASE_URL = 'https://pageoneworks.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {

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
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/advertise`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // archive 슬러그 제외하고 카테고리 페이지만
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter((cat) => cat.slug !== 'archive')
    .map((cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/article/${article.slug}`,
    lastModified: new Date(article.date.replace(/\./g, '-')),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}