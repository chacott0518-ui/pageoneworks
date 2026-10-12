# PAGEONEWORKS 매거진 이미지 · PageSpeed 운영정책

이 문서는 `2026-09-18` V4.2 통합최적화정책과 `2026-10-01` PageSpeed95 통합운영정책을 **매거진 사이트(PAGEONEWORKS)**에 맞게 보강한 전용 운영 규칙이다. 원본 정책 MD를 대체하지 않는다.

대표 도메인: `https://www.pageoneworks.com` (apex → www redirect 유지)

---

## 1. 콘텐츠·링크 구조

1. PAGEONEWORKS 매거진은 단일 키워드 사이트가 아니라 **OWNER / SUPPORT Article** 구조로 운영한다.
2. 모든 글에서 앵커 100% 집중을 하지 않는다.
3. OWNER Article은 명확히 두고, SUPPORT Article에서 자연스러운 내부링크로 연결한다.

## 2. 신규 Article 이미지 기본값

4. 신규 Article 기본 이미지는 **대표 1장 + 본문 2장, 총 3장**.
5. 신규 이미지는 기존 이미지 ID/파일명 중복 검사 후 추가한다.
6. 대표 이미지는 가능하면 **1200~1600px, 300KB 이하**.
7. 본문 이미지는 **1000~1400px, 250KB 이하**.

## 3. HOME LCP (최우선)

8. HOME LCP 후보는 **외부 URL 금지**. 로컬 `public/images/...`만 사용한다.
9. HOME LCP 이미지는 **preload href와 실제 img src가 완전 일치**해야 한다.
10. Source of truth: `lib/home-lcp.ts` (`HOME_LCP_IMAGE`).
11. `HeroPanorama` 첫 slide만 `priority` / `eager` / `fetchPriority=high`를 허용한다.
12. HOME LCP 1장 외 `priority` / `eager` 남발 금지.
13. 신규 Article 이미지가 HOME LCP를 차지하지 않게 한다. Hero LCP는 고정 로컬 이미지를 유지한다.

## 4. below-fold / 카드 / 에디터픽

14. MagazineGrid Article 카드, EditorPick, 관련글 이미지는 **lazy**.
15. HOME LCP가 아닌 Article 카드·EditorPick에는 `priority` 금지.
16. 모바일 카드 `sizes`는 뷰포트보다 과도하게 크지 않게 유지한다.
17. Article 상세의 외부 Unsplash URL은 허용할 수 있으나, HOME LCP 후보가 외부 URL이 되면 안 된다.

## 5. 배포·검수

18. 이미지가 깨졌는지 배포 후 실제 URL에서 확인한다.
19. 신규 글 발행 전 실행:
    ```bash
    node scripts/check-magazine-images.mjs
    # 또는
    npm run check:magazine-images
    ```
20. 모바일 PageSpeed가 90 미만이면 **이미지 · 폰트 · CSS · LCP**부터 확인한다.
21. 성능 때문에 SEO DOM, FAQ, Schema, sitemap, canonical, Article 데이터를 삭제하지 않는다.

## 6. 스크립트 FAIL / WARN 기준

| 등급 | 조건 |
|------|------|
| FAIL | HOME LCP가 `http(s)://` 외부 URL |
| FAIL | Article이 참조하는 `/images/...` 로컬 경로가 disk에 없음 |
| WARN | `public/images` 파일 400KB 초과 |
| WARN | 매거진 하위 폴더 이미지 300KB 초과 |
| WARN | 동일 Article에서 image와 heroImage(또는 전 로컬 경로)가 동일 |

대량 기존 이미지 WARN은 즉시 전량 재압축하지 않는다. HOME/최신 카드에서 실제 쓰이는 초과분만 별도 승인 후 처리한다.

## 7. 관련 파일

- `lib/home-lcp.ts` — HOME LCP 경로
- `app/page.tsx` — LCP preload
- `components/HeroPanorama.tsx` — slide-0 LCP
- `components/MagazineGrid.tsx` / `components/EditorPickSection.tsx` — below-fold lazy
- `scripts/check-magazine-images.mjs` — 검수 스크립트
