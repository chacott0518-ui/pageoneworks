/**
 * PAGEONEWORKS Magazine article validation
 * Run: npx tsx scripts/validate-articles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

const BANNED_TOPIC_BODY_TOKENS = ['##CTA##', '##CTABLOCK##', '##YEONSEI##'];

function scanNonWwwHardcoding(dir, results = []) {
  const skip = new Set(['node_modules', '.next', '.git']);
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanNonWwwHardcoding(full, results);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs)$/.test(name)) continue;
    const text = fs.readFileSync(full, 'utf8');
    if (/https:\/\/pageoneworks\.com(?!\/)/.test(text) || /https:\/\/pageoneworks\.com"/.test(text)) {
      results.push(full.replace(projectRoot + path.sep, ''));
    }
  }
  return results;
}

function hasArticlesRoute() {
  return fs.existsSync(path.join(projectRoot, 'app', 'articles'));
}

function hasCategoryTopicRoute() {
  const slugDir = path.join(projectRoot, 'app', 'category', '[slug]');
  if (!fs.existsSync(slugDir)) return false;
  return fs.readdirSync(slugDir).some((name) => {
    const full = path.join(slugDir, name);
    return fs.statSync(full).isDirectory() && name.startsWith('[');
  });
}

function scanIndexNowExternalCall() {
  const hits = [];
  const sitemapPath = path.join(projectRoot, 'app', 'sitemap.ts');
  if (fs.existsSync(sitemapPath)) {
    const text = fs.readFileSync(sitemapPath, 'utf8');
    if (/notifyIndexNow|indexnow\.org/i.test(text)) hits.push('app/sitemap.ts');
  }
  return hits;
}

function checkSitemapBody() {
  const bodyPath = path.join(projectRoot, '.next', 'server', 'app', 'sitemap.xml.body');
  if (!fs.existsSync(bodyPath)) return { exists: false, topicUrls: [], patternUrls: [] };
  const xml = fs.readFileSync(bodyPath, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const topicUrls = locs.filter((u) => /\/category\/[^/]+\/[^/]+/.test(u));
  const patternUrls = locs.filter((u) => /\/pattern\//i.test(u));
  return { exists: true, topicUrls, patternUrls, total: locs.length };
}

function findTopicArticlesWithSources(topicArticles) {
  return topicArticles.filter((a) => a.sources != null && (Array.isArray(a.sources) ? a.sources.length > 0 : true)).map((a) => a.slug);
}

function findTopicArticlesWithBannedTokens(topicArticles) {
  const hits = [];
  for (const a of topicArticles) {
    if (!a.body) continue;
    for (const token of BANNED_TOPIC_BODY_TOKENS) {
      if (a.body.includes(token)) hits.push({ slug: a.slug, token });
    }
  }
  return hits;
}

async function main() {
  let mod;
  try {
    const { pathToFileURL } = await import('url');
    mod = await import(pathToFileURL(path.join(projectRoot, 'lib', 'articles', 'index.ts')).href);
  } catch (e) {
    console.error('❌ 모듈 로드 실패 — npx tsx scripts/validate-articles.mjs 로 실행하세요.');
    console.error(e.message);
    process.exit(1);
  }

  const {
    articles,
    legacyArticles,
    topicArticles,
    findDuplicateArticleSlugs,
    findDuplicateArticleIds,
    findArticlesWithUnknownTopic,
    findArticlesWithInvalidCategory,
    findArticlesMissingRecommendedTopic,
    findArticlesWithInvalidContentPattern,
    getIndexNowCandidateUrls,
  } = mod;

  const slugDups = findDuplicateArticleSlugs(articles);
  const idDups = findDuplicateArticleIds(articles);
  const unknownTopics = findArticlesWithUnknownTopic(articles);
  const invalidCategories = findArticlesWithInvalidCategory(articles);
  const missingTopic = findArticlesMissingRecommendedTopic(topicArticles);
  const invalidPatterns = findArticlesWithInvalidContentPattern(topicArticles);
  const sourcesInTopic = findTopicArticlesWithSources(topicArticles);
  const bannedTokens = findTopicArticlesWithBannedTokens(topicArticles);
  const nonWww = scanNonWwwHardcoding(path.join(projectRoot, 'lib'));
  const articlesRoute = hasArticlesRoute();
  const categoryTopicRoute = hasCategoryTopicRoute();
  const indexNowCalls = scanIndexNowExternalCall();
  const indexNow = getIndexNowCandidateUrls(articles);
  const indexBad = indexNow.filter(
    (u) => u.includes('?') || /\/category\/[^/]+\/[^/]+/.test(u),
  );
  const sitemapCheck = checkSitemapBody();

  const errors = [];
  const warnings = [];

  if (slugDups.length) errors.push(`slug 중복: ${slugDups.join(', ')}`);
  if (idDups.length) errors.push(`id 중복: ${idDups.join(', ')}`);
  if (unknownTopics.length) errors.push(`invalid topicSlug: ${unknownTopics.map((x) => x.slug).join(', ')}`);
  if (invalidCategories.length) errors.push(`invalid categorySlug: ${invalidCategories.map((x) => x.slug).join(', ')}`);
  if (missingTopic.length) errors.push(`topic 파일 글 topicSlug 누락: ${missingTopic.map((x) => x.slug).join(', ')}`);
  if (invalidPatterns.length) errors.push(`contentPattern 문제: ${invalidPatterns.map((x) => x.slug).join(', ')}`);
  if (sourcesInTopic.length) errors.push(`topic 글 sources 필드 사용: ${sourcesInTopic.join(', ')}`);
  if (bannedTokens.length) errors.push(`topic 글 금지 토큰: ${bannedTokens.map((x) => `${x.slug}:${x.token}`).join(', ')}`);
  if (articlesRoute) errors.push('/articles 라우트 존재');
  if (categoryTopicRoute) errors.push('/category/[slug]/[topic] 라우트 존재');
  if (indexNowCalls.length) errors.push(`IndexNow 외부 호출 코드: ${indexNowCalls.join(', ')}`);
  if (indexBad.length) errors.push(`IndexNow 후보 잘못된 URL: ${indexBad.length}건`);
  if (sitemapCheck.exists && sitemapCheck.topicUrls.length) {
    errors.push(`sitemap topic URL: ${sitemapCheck.topicUrls.join(', ')}`);
  }
  if (sitemapCheck.exists && sitemapCheck.patternUrls.length) {
    errors.push(`sitemap pattern URL: ${sitemapCheck.patternUrls.join(', ')}`);
  }

  if (nonWww.length) warnings.push(`non-www 하드코딩 후보: ${nonWww.join(', ')}`);

  const report = {
    articleCount: articles.length,
    legacyCount: legacyArticles.length,
    topicCount: topicArticles.length,
    slugDups,
    idDups,
    unknownTopics: unknownTopics.length,
    invalidCategories: invalidCategories.length,
    topicFilePolicy: {
      missingTopicSlug: missingTopic.length,
      invalidContentPattern: invalidPatterns.length,
      sourcesField: sourcesInTopic.length,
      bannedTokens: bannedTokens.length,
    },
    routes: { articlesRoute, categoryTopicRoute },
    indexNowExternalCall: indexNowCalls,
    sitemap: sitemapCheck.exists
      ? { total: sitemapCheck.total, topicUrls: sitemapCheck.topicUrls.length, patternUrls: sitemapCheck.patternUrls.length }
      : 'not built — run npm run build first',
    errors,
    warnings,
  };

  console.log(JSON.stringify(report, null, 2));

  if (errors.length) {
    console.error('\n❌ 검증 실패');
    process.exit(1);
  }
  console.log('\n✅ 검증 통과');
}

main();
