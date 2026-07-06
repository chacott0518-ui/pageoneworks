/**
 * lib/articles/topics/** 구조 재생성 (1회성·유지보수용).
 * 기존 글 데이터는 건드리지 않음 — 빈 topic 파일만 생성/갱신.
 * Run: node scripts/generate-topic-structure.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'lib', 'articles', 'topics');

const categoryTopics = {
  vitality: ['health-guide', 'women-life', 'wellness-routine', 'aging-prevention', 'medical-info'],
  properties: ['housing-market', 'subscription-policy', 'investment-basics', 'local-real-estate', 'living-space'],
  'drive-tech': ['ai-search', 'mobility', 'platform-business', 'digital-tools', 'future-industry'],
  'legal-finance': ['tax-money', 'business-law', 'policy-regulation', 'asset-planning', 'economy-watch'],
  'lifestyle-travel': ['travel-guide', 'culture-spot', 'home-living', 'consumer-trend', 'local-experience'],
  'beauty-wellness': ['skin-beauty', 'clinic-guide', 'self-care', 'anti-aging', 'beauty-trend'],
  'food-dining': ['restaurant-guide', 'food-trend', 'cafe-dessert', 'dining-culture', 'local-taste'],
  education: ['admission-strategy', 'study-guide', 'career-skill', 'parenting-education', 'global-education'],
  'sports-health': ['fitness-guide', 'sports-trend', 'recovery-body', 'outdoor-life', 'performance'],
  'culture-art': ['exhibition-art', 'books-ideas', 'music-performance', 'collecting', 'creative-people'],
  'pet-family': ['pet-care', 'family-life', 'child-parent', 'companion-culture', 'home-care'],
  'global-trend': ['global-issue', 'market-trend', 'society-culture', 'technology-shift', 'brand-watch'],
};

function slugToCamel(slug) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function categoryToExportPrefix(categorySlug) {
  return slugToCamel(categorySlug);
}

for (const [categorySlug, topics] of Object.entries(categoryTopics)) {
  const dir = path.join(root, categorySlug);
  fs.mkdirSync(dir, { recursive: true });

  const imports = [];
  const spreads = [];

  for (const topicSlug of topics) {
    const exportName = `${slugToCamel(topicSlug)}Articles`;
    const filePath = path.join(dir, `${topicSlug}.ts`);
    fs.writeFileSync(
      filePath,
      `import type { Article } from '../../../data';

export const ${exportName}: Article[] = [];
`,
      'utf8',
    );
    imports.push(`import { ${exportName} } from './${topicSlug}';`);
    spreads.push(`  ...${exportName},`);
  }

  const prefix = categoryToExportPrefix(categorySlug);
  fs.writeFileSync(
    path.join(dir, 'index.ts'),
    `import type { Article } from '../../../data';
${imports.join('\n')}

export const ${prefix}TopicArticles: Article[] = [
${spreads.join('\n')}
];
`,
    'utf8',
  );
}

const categoryImports = Object.keys(categoryTopics).map((slug) => {
  const prefix = categoryToExportPrefix(slug);
  return `import { ${prefix}TopicArticles } from './${slug}';`;
});

const categorySpreads = Object.keys(categoryTopics).map((slug) => {
  const prefix = categoryToExportPrefix(slug);
  return `  ...${prefix}TopicArticles,`;
});

fs.writeFileSync(
  path.join(root, 'index.ts'),
  `import type { Article } from '../../data';
${categoryImports.join('\n')}

export const topicArticles: Article[] = [
${categorySpreads.join('\n')}
];
`,
  'utf8',
);

console.log('Generated topic structure under lib/articles/topics/');
