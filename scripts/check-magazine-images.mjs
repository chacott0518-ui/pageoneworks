/**
 * PAGEONEWORKS magazine image budget / path check.
 * Usage: node scripts/check-magazine-images.mjs
 *
 * WARN: files over size budgets (does not fail build)
 * FAIL: missing local /images/ paths referenced by articles, or HOME LCP external URL
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const IMAGES = join(PUBLIC, 'images');
const HOME_LCP_FILE = join(ROOT, 'lib', 'home-lcp.ts');
const ARTICLES_DIR = join(ROOT, 'lib', 'articles');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const WARN_ALL_KB = 400;
const WARN_MAGAZINE_KB = 300;
const MAGAZINE_SUBDIRS = [
  'drive-tech',
  'lifestyle-travel',
  'beauty-wellness',
  'properties',
  'vitality',
  'finance',
  'legal',
  'education',
  'food',
  'fashion',
  'home',
];

const warns = [];
const fails = [];

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function kb(bytes) {
  return Math.round(bytes / 1024);
}

function checkHomeLcp() {
  if (!existsSync(HOME_LCP_FILE)) {
    fails.push('lib/home-lcp.ts missing');
    return;
  }
  const src = readFileSync(HOME_LCP_FILE, 'utf8');
  const m = src.match(/HOME_LCP_IMAGE\s*=\s*['"]([^'"]+)['"]/);
  if (!m) {
    fails.push('HOME_LCP_IMAGE export not found in lib/home-lcp.ts');
    return;
  }
  const url = m[1];
  if (/^https?:\/\//i.test(url)) {
    fails.push(`HOME LCP must be local public path, got external URL: ${url}`);
    return;
  }
  if (!url.startsWith('/images/')) {
    fails.push(`HOME LCP should start with /images/, got: ${url}`);
    return;
  }
  const disk = join(PUBLIC, url.replace(/^\//, '').split('/').join('\\'));
  const diskPosix = join(PUBLIC, ...url.replace(/^\//, '').split('/'));
  if (!existsSync(diskPosix) && !existsSync(disk)) {
    fails.push(`HOME LCP file missing on disk: ${url}`);
  }
}

function checkLargeImages() {
  const files = walkFiles(IMAGES).filter((f) =>
    IMAGE_EXTS.has(extname(f).toLowerCase()),
  );
  for (const f of files) {
    const size = statSync(f).size;
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    if (size > WARN_ALL_KB * 1024) {
      warns.push(`>${WARN_ALL_KB}KB (${kb(size)}KB): ${rel}`);
    }
    const parts = rel.split('/');
    const sub = parts[2]; // public/images/<sub>/...
    if (MAGAZINE_SUBDIRS.includes(sub) && size > WARN_MAGAZINE_KB * 1024) {
      warns.push(
        `magazine >${WARN_MAGAZINE_KB}KB (${kb(size)}KB): ${rel}`,
      );
    }
  }
}

function extractImagePaths(text) {
  const paths = new Set();
  const re = /['"`](\/images\/[^'"`\s]+)['"`]/g;
  let m;
  while ((m = re.exec(text))) paths.add(m[1]);
  return [...paths];
}

function checkArticles() {
  if (!existsSync(ARTICLES_DIR)) {
    warns.push('lib/articles not found — skip article path checks');
    return;
  }
  const files = walkFiles(ARTICLES_DIR).filter((f) => f.endsWith('.ts'));
  // Prefer recent mtime files for "latest" duplicate checks
  const sorted = files
    .map((f) => ({ f, mtime: statSync(f).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  for (const { f } of sorted) {
    const text = readFileSync(f, 'utf8');
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    const paths = extractImagePaths(text);

    for (const p of paths) {
      const disk = join(PUBLIC, ...p.replace(/^\//, '').split('/'));
      if (!existsSync(disk)) {
        fails.push(`missing image referenced by ${rel}: ${p}`);
      }
    }

    // Same article: image === heroImage local path (duplicate cover/body warn)
    const imageMatch = text.match(/\bimage:\s*['"]([^'"]+)['"]/);
    const heroMatch = text.match(/\bheroImage:\s*['"]([^'"]+)['"]/);
    if (
      imageMatch &&
      heroMatch &&
      imageMatch[1] === heroMatch[1] &&
      imageMatch[1].startsWith('/images/')
    ) {
      warns.push(`same image & heroImage in ${rel}: ${imageMatch[1]}`);
    }

    // Body blocks often reuse hero — flag identical consecutive local paths
    const localPaths = paths.filter((p) => p.startsWith('/images/'));
    const uniq = new Set(localPaths);
    if (localPaths.length >= 2 && uniq.size === 1) {
      warns.push(
        `all local image paths identical in ${rel}: ${[...uniq][0]}`,
      );
    }
  }
}

function main() {
  console.log('PAGEONEWORKS magazine image check\n');
  checkHomeLcp();
  checkLargeImages();
  checkArticles();

  // Deduplicate warns
  const uniqWarns = [...new Set(warns)];
  const uniqFails = [...new Set(fails)];

  console.log(`WARN (${uniqWarns.length})`);
  for (const w of uniqWarns.slice(0, 80)) console.log(`  - ${w}`);
  if (uniqWarns.length > 80) {
    console.log(`  ... +${uniqWarns.length - 80} more`);
  }

  console.log(`\nFAIL (${uniqFails.length})`);
  for (const f of uniqFails) console.log(`  - ${f}`);

  if (uniqFails.length > 0) {
    console.log('\nResult: FAIL');
    process.exitCode = 1;
  } else {
    console.log('\nResult: PASS (warnings may remain)');
  }
}

main();
