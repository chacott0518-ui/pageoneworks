# PAGEONEWORKS Magazine — Topic Article Files

## 운영 정책

1. **기존 글**은 `lib/articles/*.ts` legacy flat 파일에 유지한다. 이동·복사·삭제·본문 수정 금지.
2. **신규 글**은 `lib/articles/topics/[categorySlug]/[topicSlug].ts`에 추가한다.
3. 신규 글은 `topicSlug`와 `contentPattern`(A~E)을 사용한다. `topicLabel`은 직접 쓰지 않고 taxonomy에서 resolve한다.
4. **`sources` 필드는 금지**한다.
5. 참고 출처는 body 마지막 **「※ 참고 출처」** 형식을 사용한다.
6. 수동 CTA 토큰 **`##CTA##`**, **`##CTABLOCK##`** 사용 금지.
7. topic은 URL이 아니라 **카테고리 페이지 내부 탭/필터**다. `/category/[slug]/[topic]` 라우트 금지.
8. sitemap / RSS / canonical에는 **article canonical URL만** 들어간다.
9. **기존 글을 topic 파일로 옮기지 않는다.**

## 구조

| 구분 | 위치 | 용도 |
|------|------|------|
| Legacy | `lib/articles/*.ts` | 기존 글 (interleave → `legacyArticles`) |
| Future | `lib/articles/topics/...` | 앞으로 추가하는 신규 글 |

`lib/articles/index.ts`가 `mergeArticleSources(legacyArticles, topicArticles)`로 `articles`를 export합니다.

## 신규 글 필수 필드

`id`, `slug`, `category`, `categorySlug`, `topicSlug`, `title`, `titleKo`, `excerpt`, `date`, `readTime`, `image`, `heroImage`, `tags`, `author`, `contentPattern`, `body`

## contentPattern (lib/article-patterns.ts)

| 패턴 | 이름 |
|------|------|
| A | Direct Answer Guide |
| B | Comparison & Decision |
| C | Trend & Issue Analysis |
| D | Practical Checklist |
| E | Explainer Story |

패턴은 URL·sitemap·라우트를 만들지 않는다.

## 검증

```bash
npx tsx scripts/validate-articles.mjs
npx tsc --noEmit
npm run build
```
