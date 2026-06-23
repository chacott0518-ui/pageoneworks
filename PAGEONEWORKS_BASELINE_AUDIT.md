# PAGEONEWORKS BASELINE AUDIT

> 분석 전용 문서. 코드/콘텐츠는 수정하지 않음. 운영 도메인: https://www.pageoneworks.com
> 분석 기준일: 2026-06-23 / 로컬: D:\pageoneworks / Next.js 14.2.3 App Router + TS + Tailwind + Supabase + Vercel
> 민감정보(Supabase URL/anon key/service key, .env 값)는 본 문서에 포함하지 않음.

---

## 1. Executive Summary

- **현재 정체성**: 코드/콘텐츠 근거상 **프리미엄 웹 매거진 + 회원 커뮤니티** 사이트다. Header/Footer 모두 "Premium Magazine"으로 표기하며, 운영 주체는 **USENAD Co., Ltd.**, 매체 브랜드는 **PAGEONEWORKS**.
- "최적화 연구/사례 플랫폼", "온라인 평판관리", "SEO/AEO/GEO/LLMEO 서비스 회사"로 인식될 근거는 **코드에 전혀 없음**. 즉 사용자가 의도한 미래 정체성과 현재 구현이 불일치.
- **P0(긴급)**: 관리자 권한이 전적으로 Supabase RLS + `profiles.is_admin`에만 의존(미들웨어 없음). 검증 불가한 DB측 RLS에 보안이 묶여 있음. `login`/`mypage` 등 thin·인증 페이지가 색인 허용 상태. 커뮤니티 숨김(`is_hidden=true`) 글이 상세 URL에서 그대로 노출·색인 가능.
- **P1(핵심)**: Entity Single Source of Truth(SOT) 부재. 회사 정보(설립연도, 로고 URL, 주소/이메일/전화)가 `schemas.ts`/`about`/`community`/`Footer`에 **분산·불일치**. 모든 페이지에 동일 스키마(특히 `HowTo`, `FAQPage`)를 **기계적으로 주입**해 화면 미표시 구조화데이터 리스크.
- **수익화/서비스 페이지**: 현재는 `advertise`(광고문의)만 존재. 최적화 서비스/진단/상담/사례 페이지 없음.
- **Analytics**: GA4/GTM/Clarity/전환추적/동의관리 **전무**. 검색엔진 인증(Google, Naver)만 존재.

---

## 2. 현재 사이트 역할

| 신호 | 근거 파일 | 판정 |
|---|---|---|
| Header 로고 서브텍스트 "Premium Magazine" | `components/Header.tsx:111` | 매거진 |
| Footer "Operated by PAGEONEWORKS / USENAD Co., Ltd." | `components/Footer.tsx:191` | 매거진(운영사=USENAD) |
| siteSchema `@type: NewsMediaOrganization` | `lib/schemas.ts:6` | 언론/매거진 |
| 홈 H1 "The Future of / Longevity" 등 슬라이드 카피 | `components/HeroPanorama.tsx` | 매거진 히어로 |
| About H1 "PAGEONEWORKS" + "대한민국 No.1 프리미엄 라이프스타일 매거진" | `app/about/page.tsx:66,71` | 매거진 |
| Advertise "프리미엄 라이프스타일 매거진… 고소득 독자층" | `app/advertise/page.tsx:53` | 매거진 광고영업 |
| 12개 콘텐츠 카테고리(의료/부동산/모빌리티…) | `lib/data.ts:34-165` | 종합 매거진 |
| 커뮤니티(글/댓글/반응/신고/관리자) | `app/community/**`, `components/community/**` | 커뮤니티 |

**결론**: 현재 인식 = **"여러 주제를 다루는 프리미엄 매거진 + 커뮤니티"**. 마케팅대행사/SEO전문회사 정체성 신호는 없음.

---

## 3. pageone.works ↔ pageoneworks.com 역할 분리안

- **현재 코드에 두 도메인 관계를 설명하는 콘텐츠/스키마는 존재하지 않음**(`sameAs`, `parentOrganization`, About 설명 모두 없음).
- 사용자 제공 사실에 근거한 분리안(코드 변경 아님, 제안):

| 항목 | pageone.works | pageoneworks.com |
|---|---|---|
| 역할 | 스트리밍 플랫폼 + 마케팅대행사 공식 홈 | 프리미엄 매거진 + 전문가 커뮤니티 (+ 향후 최적화/평판관리 플랫폼) |
| Entity | 사업/대행사 브랜드 | 매체 브랜드(운영사 USENAD) |
| 이번 작업 | **건드리지 않음** | 분석·개선 대상 |

- **연결 가능성**: 동일 운영사(USENAD Co., Ltd.) 산하 **서로 다른 브랜드/서비스**로, 향후 `Organization.sameAs` 또는 `subOrganization/brand`로 연결 가능. 단 **실제 법인 관계가 확인되기 전까지 스키마에 단정 표기 금지**.

---

## 4. 기술 스택 및 구조

- **프레임워크**: Next.js `14.2.3` App Router, React 18, TypeScript 5(strict), Tailwind 3.4.
- **데이터**: Supabase(`@supabase/ssr`, `@supabase/supabase-js`). 브라우저 클라이언트(`lib/supabase.ts`) + 서버 클라이언트(`lib/supabase-server.ts`) 모두 **anon key** 사용. **service role key 사용처 없음**(grep 결과 0건).
- **외부 라이브러리**: framer-motion, gsap, fuse.js(검색), lucide-react, feed(RSS), clsx.
- **빌드/배포**: `next build` + `postbuild`로 `scripts/notify-indexnow.mjs` 실행. Vercel.
- **middleware**: **없음**(`middleware.ts` 부재). 인증/리다이렉트는 페이지/레이아웃/route 단위.
- **환경변수 사용 위치**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`(supabase 클라이언트들), `ANTHROPIC_API_KEY`(`app/api/ai-qa/route.ts`), IndexNow 키(`scripts/notify-indexnow.mjs`, `lib/indexnow.ts`), 검색엔진 verification 토큰(`app/layout.tsx` metadata).
- **next.config.js**: redirect(`pageoneworks.vercel.app`→`www.pageoneworks.com` 301), `images.remotePatterns`(unsplash, picsum, supabase, googleusercontent, www), `formats[avif,webp]`, `minimumCacheTTL:60`, `deviceSizes`. (www 강제 redirect는 vercel 도메인에만 적용; non-www→www는 Vercel 도메인설정 의존.)

---

## 5. 전체 Route Inventory

표기: 색인=robots 색인 허용 추정 / MD=metadata / CAN=canonical / LD=JSON-LD / SM=sitemap 포함 / 로그인=접근에 로그인 필요 / 보호=보호 필요한 기존 URL.

| URL | 파일 | 유형 | 색인 | MD | CAN | LD | SM | 로그인 | 보호 |
|---|---|---|---|---|---|---|---|---|---|
| `/` | `app/page.tsx` + `app/HomeClient.tsx` | Home | O | O | O | O(site/webSite/breadcrumb/speakable/FAQ/itemList) | O | X | X |
| `/archive` | `app/archive/page.tsx` | Magazine(목록) | O | O | O | O(CollectionPage/breadcrumb/site) | O | X | X |
| `/category/[slug]` | `app/category/[slug]/page.tsx` | Category | O | O(동적) | O | O(ItemList/site 등 page 내) | O | X | X |
| `/article/[slug]` | `app/article/[slug]/page.tsx` | Article | O | O(동적) | O | O(Article/FAQ/Breadcrumb/Speakable/HowTo) | O | X | X |
| `/community` | `app/community/page.tsx` | Community | O | O | O | O(7종 일괄) | O | X | X |
| `/community/[id]` | `app/community/[id]/page.tsx` | Community Post | O | O(동적) | O | O(7종 일괄) | **X** | X | △(숨김글 노출) |
| `/community/write` | `app/community/write/page.tsx` | Community(작성) | △ | - | - | - | X | **O** | O |
| `/community/avatar` | `app/community/avatar/page.tsx` | Community(설정) | △ | - | - | - | **O** | O |
| `/about` | `app/about/page.tsx` | Company | O | O | O | O(AboutPage) | **X** | X | X |
| `/advertise` | `app/advertise/page.tsx` | Service(광고) | O | O | O | O(WebPage) | O | X | X |
| `/notice` | `app/notice/page.tsx` | 기타(공지) | O | O | O | O(WebPage) | **X** | X | X |
| `/login` | `app/login/page.tsx` | Login | **O(문제)** | O | O | X | X | X | X |
| `/mypage` | `app/mypage/page.tsx` | My Page | **O(문제)** | O | O | X | X | **O** | O |
| `/privacy` | `app/privacy/page.tsx` | Policy | O | O | O | X | X | X | X |
| `/terms` | `app/terms/page.tsx` | Policy | O | O | O(추정) | X | X | X | X |
| `/cookie` | `app/cookie/page.tsx` | Policy | O | O | O(추정) | X | X | X | X |
| `/admin` | `app/admin/page.tsx` (+`layout.tsx`) | Admin | X(보호) | - | - | - | X | **O** | O |
| `/admin/posts` `/admin/comments` `/admin/users` `/admin/reports` `/admin/notices` `/admin/ads` | `app/admin/**/page.tsx` | Admin | X(보호) | - | - | - | X | **O** | O |
| `/api/ai-qa` | `app/api/ai-qa/route.ts` | API | X | - | - | - | X | X(공개·IP제한) | △ |
| `/api/views/[slug]` | `app/api/views/[slug]/route.ts` | API | X | - | - | - | X | X | X |
| `/api/community/views/[id]` | `app/api/community/views/[id]/route.ts` | API | X | - | - | - | X | X | X |
| `/api/community/upload` | `app/api/community/upload/route.ts` | API | X | - | - | - | **O** | O |
| `/api/admin/*` | `app/api/admin/**/route.ts` | API | X | - | - | - | **O(admin)** | O |
| `/api/indexnow` | `app/api/indexnow/route.ts` | API | X | - | - | - | X | △ | △ |
| `/auth/callback` | `app/auth/callback/route.ts` | API(OAuth) | X | - | - | - | X | X | X |
| `/feed.xml` | `app/feed.xml/route.ts` | RSS | - | - | - | - | (robots에 Sitemap으로 잘못 등재) | X | X |
| `/sitemap.xml` | `app/sitemap.ts` | Sitemap | - | - | - | - | - | X | X |
| `/opengraph-image` | `app/opengraph-image.tsx` | OG image | - | - | - | - | X | X | X |

---

## 6. 기존 기능

- **매거진**: 카테고리(12) → 카테고리 페이지 → 아티클. 아티클 본문은 커스텀 `##MARKER##` DSL(`STATGRID/INFOBOX/TABLEROW/IMAGE/MOSAIC/CTA/HowTo step` 등)을 `parseBody`로 렌더. RSS, 아카이브, Fuse.js 검색(SearchOverlay), 조회수(`article_views` + RPC `increment_article_view`), AI Q&A(Anthropic).
- **커뮤니티**: 구글/카카오 OAuth, 프로필/아바타, 글쓰기/이미지 업로드, 게시글/댓글/반응/조회수/신고, 21개 커뮤니티 카테고리, 공지 배너, 광고 슬롯(`ad_banners`).
- **어드민**: 대시보드/게시글/댓글/회원/신고/공지/광고 관리. API는 `requireAdmin`/`requireSuperAdmin` 게이트.
- **SEO 인프라**: sitemap, RSS, IndexNow(postbuild + sitemap 호출), 동적 metadata, JSON-LD, robots.txt.

---

## 7. 완료된 최적화

- 동적 `generateMetadata`(article/category/community 상세) + canonical 자기참조.
- `metadataBase` 설정(`app/layout.tsx`), title template, OG/Twitter 기본값.
- 광범위 JSON-LD(Article/FAQ/Breadcrumb/Speakable/ItemList/CollectionPage/DiscussionForumPosting).
- robots.txt에 AI 크롤러 명시 허용(GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Google-Extended/Yeti/Bingbot/CCBot 등).
- IndexNow 자동 통지, RSS feed, sitemap 자동 생성(카테고리/아티클).
- `next/image` 전환 + `priority/sizes/quality`, `images.formats/deviceSizes/minimumCacheTTL`.
- 본문 FAQ 자동 추출(`extractFAQsFromBody`) → AEO 친화.
- 업로드 검증(타입/용량/파일명 sanitize/인증).

---

## 8. 잘못 구현된 최적화

| 문제 | 근거 파일 | 영향 | 우선순위 |
|---|---|---|---|
| `HowTo` 스키마를 커뮤니티 목록/상세에 부적절 사용(실제 How-to 아님) | `app/community/page.tsx:99`, `app/community/[id]/page.tsx:247` | 구조화데이터 스팸/신뢰도 하락 | P1 |
| `FAQPage` 답변이 화면에 표시되지 않거나 본문과 불일치(자동 합성) | `app/community/page.tsx:59`, `app/community/[id]/page.tsx:215` | "보이지 않는 FAQ" 위반 위험 | P1 |
| 모든 커뮤니티 페이지에 7종 스키마 **기계적 주입** | `app/community/**` | 과다·중복 마크업 | P1 |
| `Organization` 로고 URL 불일치(`/logo.png` vs `/images/og-default.jpg`) | `app/about/page.tsx:33`, `app/community/page.tsx:134`, `lib/schemas.ts:12` | Entity 신뢰 저하 | P1 |
| 설립연도 불일치(`schemas.ts foundingDate '2024'` vs `about '2026'`) | `lib/schemas.ts:18`, `app/about/page.tsx:81` | Entity 사실 충돌 | P1 |
| `@id` 부재 → Organization/WebSite/Article 간 엔티티 연결 없음 | 전 스키마 | Knowledge Graph 약화 | P1 |
| robots.txt가 `feed.xml`을 `Sitemap:`으로 등재(RSS는 사이트맵 아님) | `public/robots.txt:44` | 사이트맵 파싱 경고 | P2 |
| `sitemap.ts`에 `/about` 누락, `/community/[id]` 미포함 | `app/sitemap.ts` | 색인 누락 | P1 |
| 아티클 OG 이미지 `w=800`을 1200×630으로 선언 | `app/article/[slug]/page.tsx:40` | OG 해상도/치수 불일치 | P3 |
| 사이트 전역 `NewsMediaOrganization` 단정(언론사 표기) | `lib/schemas.ts:6` | 매체 성격과 향후 서비스 정체성 충돌 | P2 |

---

## 9. 누락된 최적화

- **llms.txt 부재**(AEO/LLMEO 권장 파일 없음).
- `login` 페이지 **noindex 미적용**, `mypage`(인증 전용) **색인 허용**.
- 커뮤니티 상세에 **숨김/얇은 글 noindex 정책 없음**(전부 index:true).
- `about`/`notice` **sitemap 누락**.
- Analytics/전환추적/동의관리 전무(§11).
- 작성자(Person)/검수자(reviewer) Entity 구조 없음(매거진 author는 문자열, 기본값 '편집부').
- `dateModified` 실데이터 없음(아티클은 `date`만; 수정일 = 발행일로 대체).
- 내부링크: 카테고리↔아티클↔커뮤니티 교차 링크 빈약(orphan 위험은 낮으나 토픽 클러스터 약함).

---

## 10. 보안 위험

| 문제 | 근거 | 영향 | 우선순위 | 권장 조치 |
|---|---|---|---|---|
| 관리자 인가가 **RLS + `is_admin`에만 의존**, 미들웨어 없음 | `lib/admin/auth.ts`, `app/admin/layout.tsx`, `app/api/admin/*` | RLS 미구성/오구성 시 데이터 노출·변조 | **P0** | DB RLS 정책 실재 여부 점검, admin API 방어계층 점검(미들웨어 추가는 별도 결정) |
| admin API가 anon-key 클라이언트로 mutate(삭제/숨김) | `app/api/admin/posts/route.ts:74-87` | RLS가 admin write 허용해야만 동작·안전. RLS 의존 단일점 | **P0** | RLS 정책 검증, 필요한 경우 서버권한 분리 검토 |
| 커뮤니티 숨김글이 상세 URL에서 그대로 노출+색인 | `app/community/[id]/page.tsx:151`(hidden 필터 없음), `:135`(index:true) | 모더레이션 무력화, 부적절 콘텐츠 색인 | P0~P1 | 상세 조회에 hidden 필터/노출정책 적용 검토 |
| `login`/`mypage` 색인 허용 | `app/login/page.tsx:8`, `app/mypage/page.tsx:8` | thin/auth 페이지 색인·soft404 | P1 | noindex 적용 검토 |
| AI Q&A rate limit이 **in-memory Map** | `app/api/ai-qa/route.ts:3-19` | Vercel 다중/콜드스타트에서 무력화 → API 비용/남용 | P1 | 영속 저장(예: Supabase/Upstash) 기반 제한 검토 |
| 업로드 magic-byte 미검증(확장자/타입만) | `app/api/community/upload/route.ts:26` | 위장 파일 업로드 가능성(낮음) | P3 | 콘텐츠 검증 추가 검토 |
| `/api/indexnow` 인증 수준 미확인 | `app/api/indexnow/route.ts` | 외부 트리거 남용 가능성 | P2 | 시크릿/허용출처 점검 |
| CSP/보안 헤더 미설정 | `next.config.js`(headers 없음) | XSS 완화/클릭재킹 방어 부재 | P2 | security headers 검토 |

> 참고: `service role key` 사용처는 발견되지 않음(노출 위험 해당 없음). XSS는 커뮤니티 본문 렌더 방식 추가 점검 필요(별도).

---

## 11. 데이터 및 Supabase 위험

- **테이블(코드 참조 기준)**: `profiles(is_admin, nickname, avatar_url, level, created_at)`, `community_posts(is_hidden, is_pinned, view_count, like_count, comment_count, is_anonymous, images, tags, user_id …)`, `community_comments`, `community_notices`, `ad_banners`, `article_views`, `reports`(추정), `post_reactions/bookmarks`(이전 작업 참조).
- **RPC**: `increment_article_view(p_slug)`.
- **위험**:
  - 전 기능이 **RLS 정책 실재**에 의존. 코드만으로는 RLS 구성 검증 불가 → **운영 DB에서 정책 점검 필요(P0)**.
  - `community_notices`/`ad_banners`는 코드 주석 SQL로만 정의(`lib/admin/constants.ts:27-55`) → 실제 테이블/정책 적용 여부 확인 필요.
  - admin 삭제 시 자식(`community_comments`) 수동 삭제 루프 → FK/Cascade 미설정 가능성.
  - `article_views`/조회수 RPC 권한(anon 호출) 점검 필요(조작 가능성).
- **민감정보**: 키/URL은 환경변수로만 사용. 본 문서에 미기재.

---

## 12. 유지해야 하는 보호 URL (색인/외부 노출 금지·로그인 필요)

- `/admin`, `/admin/posts`, `/admin/comments`, `/admin/users`, `/admin/reports`, `/admin/notices`, `/admin/ads`
- `/mypage`, `/community/write`, `/community/avatar`
- `/api/admin/*`, `/api/community/upload`, `/auth/callback`, `/api/indexnow`
- (정책상 noindex 권장) `/login`

---

## 13. 삭제/통합 검토 페이지

| 페이지 | 현황 | 검토 의견 |
|---|---|---|
| `/login` | 색인 허용 thin | 유지하되 **noindex** (삭제 아님) |
| `/mypage`, `/community/avatar` | 인증 전용이 색인 허용 | **noindex**, sitemap 제외 |
| `/notice` | 정적 2건 하드코딩 | 유지(콘텐츠 보강 필요), sitemap 추가 검토 |
| `/privacy` `/terms` `/cookie` | 정책 | 유지(noindex 불필요, sitemap 제외 가능) |
| 중복 커뮤니티 클라이언트 `app/community/CommunityClient.tsx` vs `components/community/CommunityClient.tsx` | 동일명 2개 존재 | **중복 여부 점검 후 통합 검토**(P2) |

---

## 14. 신규 페이지 후보 (조건 충족 시에만)

> §13(추가 페이지 판단 기준) 충족 항목만. 지금 생성하지 않음.

- `/services` (또는 `/optimization`): SEO/AEO/GEO/LLMEO/Entity 최적화 서비스 허브 — 독립 검색의도·독립 Entity·별도 CTA 충족.
- `/services/[slug]`: 개별 서비스(예: aeo, geo, entity-seo, ai-citation) — 충분한 원본 콘텐츠 확보 시.
- `/cases` (Case Study) + `/cases/[slug]`: 최적화 사례 — 원본 데이터/성과 확보 시.
- `/research`: 최적화 연구/방법론 — 원본 콘텐츠 확보 시.
- `/glossary` + `/glossary/[term]`: 용어집(Entity/AEO 강화).
- `/contact` 또는 `/diagnosis`: 진단/상담 신청(리드 수집) — `advertise`와 의도 분리되면.
- `llms.txt`(public): 파일 1개, LLM 가이드.

---

## 15. 신규 페이지를 만들면 안 되는 항목

- **스트리밍/마케팅대행사 소개·홈** → **pageone.works가 담당**. pageoneworks.com에 신설 금지.
- `/about` 대체 회사소개 신규 → 기존 `/about` **확장**으로 충분.
- 카테고리/아티클 유사 매거진 허브 추가 → 기존 `/archive` `/category` 와 cannibalization.
- 별도 로그인/마이페이지 변형 → 기존 유지.
- 플랫폼 전용·비표준 스키마 페이지 → 표준 schema.org 외 추천 안 함.

---

## 16. Entity 구조 제안

- **단일 SOT 도입**(예: `lib/site.config.ts` 1개에 회사/매체 Entity 집약) — 현재 `schemas.ts`/`about`/`community`/`Footer`/`layout`에 흩어진 값을 한 곳에서 참조.
- **확정 가능한 사실(코드/사용자 제공 기준)**: 운영사 `USENAD Co., Ltd.`, 대표 `김세준`, 사업자번호 `206-31-95055`, TEL `+82 2-739-5415`, 이메일 `chacott0518@gmail.com`, 주소 `서울 동대문구 장안동 463-2 이화빌딩 7F`, 매체명 `PAGEONEWORKS`/`페이지원웍스`.
- **불일치 해소 필요**: 설립연도(2024 vs 2026), 로고 URL(`/logo.png` vs `/images/og-default.jpg`) → 실제 값으로 통일.
- **@id 도입**: `Organization`(`#organization`), `WebSite`(`#website`), 각 `Article`/`WebPage`에 안정 `@id` 부여 후 publisher/author/isPartOf로 연결.
- **회사 Entity vs 매거진 Entity 분리**: `Organization(USENAD)` ←(publisher/parent)→ `NewsMediaOrganization 또는 Brand(PAGEONEWORKS)` 구조 검토. 단 법인-매체 관계 사실 확인 전 단정 금지.
- **pageone.works 연결**: 사실 확인 시 `sameAs` 또는 `parentOrganization`로 연결.

---

## 17. Schema 구조 제안

- **페이지별 적정화(기계적 일괄 주입 제거)**:
  - 홈: `WebSite`(SearchAction) + `Organization`(@id) 1쌍.
  - 아티클: `Article`(author=Person 또는 검증된 Organization, publisher @id) + `BreadcrumbList` + 필요한 경우 `FAQPage`(화면 표시 FAQ에 한함).
  - 커뮤니티 상세: `DiscussionForumPosting`만(+ Breadcrumb). **HowTo/합성 FAQ 제거 검토**.
  - 커뮤니티 목록: `CollectionPage` 또는 `WebPage` 1개(+ Breadcrumb).
- **FAQ는 화면에 실제 노출된 Q&A만** 마크업.
- **로고/이미지 ImageObject URL 통일**, `@id` 부여.
- 향후 서비스 페이지: `Service`/`Offer`/`Organization` + `BreadcrumbList`(표준만).

---

## 18. 콘텐츠 구조 제안

- 아티클에 **author(Person)·reviewer(검수자)·dateModified·출처(citation)** 필드 정식화(현재 author 문자열·기본값).
- **편집/정정/광고표시 정책 페이지** 또는 섹션(`isSponsored/sponsorName` 필드는 이미 타입에 존재 → 표시 UI/정책 연계).
- **토픽 클러스터**: 카테고리 허브 ↔ 아티클 ↔ 커뮤니티 상호 내부링크 강화.
- **AEO 블록 표준화**: 첫 문단 직접답변/핵심요약/정의/비교표/FAQ/출처/수정일(이미 일부 DSL 존재, 일관 적용).
- **llms.txt**로 핵심 Entity·대표 콘텐츠·연락처 노출.

---

## 19. 전환 및 수익화 구조 제안

- 현재 전환요소: `advertise` 이메일 CTA, 커뮤니티 가입/글쓰기. **추적 없음**.
- 제안(P3 이후): GA4 또는 GTM + 동의(consent) 관리, CTA/이메일/전화 클릭 이벤트, 회원가입/로그인/글쓰기/광고문의 전환, UTM·AI referral 구분, Supabase 기반 리드 저장(개인정보 동의·retention 명시).
- 서비스 라인 도입 시: 진단신청/상담 폼 → 리드 테이블, `advertise`와 의도 분리.

---

## 20. 우선순위 로드맵

**P0 — 보안/데이터/색인 차단**
1. Supabase RLS 정책 실재·정확성 점검(admin write 포함). 근거: `lib/admin/auth.ts`, `app/api/admin/*`.
2. 커뮤니티 숨김글 상세 노출/색인 정책 적용 검토. 근거: `app/community/[id]/page.tsx`.
3. `login`/`mypage`/`avatar`/`write` 색인·sitemap 정책 정리. 근거: 각 page metadata, `robots.txt`, `sitemap.ts`.

**P1 — Entity/canonical/sitemap/schema/정체성**
4. Entity SOT 도입 + 값 불일치(설립연도/로고) 통일 + `@id` 연결.
5. 스키마 페이지별 적정화(HowTo/합성 FAQ 제거, 화면 노출 FAQ만).
6. sitemap `/about` 추가, `feed.xml`을 Sitemap 등재에서 분리.
7. 정체성 메시지 정렬(매거진 vs 향후 서비스) — `NewsMediaOrganization` 재검토.

**P2 — 서비스 페이지/내부링크/AEO·GEO·LLMEO**
8. `llms.txt`, 서비스/사례/용어집 페이지(조건 충족 시), 내부링크·토픽클러스터, CSP/보안헤더, 중복 CommunityClient 통합.

**P3 — Analytics/CRM/평판관리**
9. GA4/GTM + consent, 전환·리드 추적, Supabase CRM.

**P4 — 고급 자동화/AI Visibility**
10. AI citation 모니터링, 콘텐츠 업데이트 로그 자동화, Entity 그래프 확장.

---

## 부록 A. 신규 페이지 후보 표

| 후보 URL | 목적 | 검색 의도 | 대상 고객 | 기존 페이지와 중복 | pageone.works와 중복 | 신규 필요 여부 | 우선순위 |
|---|---|---|---|---|---|---|---|
| `/services` | 최적화 서비스 허브 | 상업(서비스 탐색) | 기업/브랜드 마케터 | 낮음(advertise는 광고문의) | **중복 가능**(대행사 역할) → 매체측 "최적화" 한정 시 분리 | 조건부 필요 | P2 |
| `/services/aeo` `/geo` `/llmeo` `/entity-seo` `/ai-citation` | 개별 서비스 | 상업/정보 | 마케터/대표 | 없음 | 분리 시 없음 | 콘텐츠 확보 시 | P2 |
| `/cases` `/cases/[slug]` | 최적화 사례 | 신뢰/상업 | 잠재고객 | 없음 | 분리 시 없음 | 원본 성과 확보 시 | P2~P3 |
| `/research` | 연구/방법론 | 정보 | 전문가/리드 | archive와 약간 | 없음 | 콘텐츠 확보 시 | P3 |
| `/glossary` `/glossary/[term]` | 용어집 | 정보(정의) | 일반/AI | 없음 | 없음 | 권장 | P2 |
| `/diagnosis` 또는 `/contact` | 진단·상담 리드 | 전환 | 잠재고객 | advertise와 의도 분리 필요 | 분리 시 없음 | 서비스 도입 시 | P2 |
| `llms.txt`(파일) | LLM 가이드 | - | AI 크롤러 | 없음 | 없음 | 권장 | P2 |
| (금지) 마케팅대행사/스트리밍 소개 | - | - | - | - | **pageone.works 담당** | **만들면 안 됨** | - |
