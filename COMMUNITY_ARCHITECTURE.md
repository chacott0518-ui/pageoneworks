# PAGEONEWORKS 커뮤니티 전체 설계도
> 버전 2.0 | 2026.06.08 | 새 채팅 시작 시 반드시 첨부

---

## 프로젝트 기본 정보
- 사이트: https://www.pageoneworks.com
- 로컬: D:\pageoneworks
- 스택: Next.js 14 App Router, Supabase, Vercel, TypeScript, Tailwind CSS
- GitHub: chacott0518-ui/pageoneworks
- Supabase: https://ezzwvqzpxvqecyxvxsav.supabase.co

## 디자인 시스템 (절대 변경 금지)
- 배경: #0d0d0f
- 서피스: rgba(255,255,255,0.03)
- 테두리: 0.5px solid rgba(255,255,255,0.06)
- 골드: #C9A96E
- 본문텍스트: rgba(255,255,255,0.82)
- 서브텍스트: rgba(255,255,255,0.4)
- 메타텍스트: rgba(255,255,255,0.25)
- 폰트굵기: 400~500만 (600이상 절대금지)
- 여백: 8px 배수 시스템
- 인터랙션: 150ms transition

## 래퍼런스
- 디스콰이엇: 컴팩트 카드, 이모지 반응, 뱃지, 트렌딩
- Hacker News: 질 높은 정보구조, 심플 UI
- 클리앙: 카테고리 분류, 실시간 인기글
- Linear: 초고속 반응, 키보드 네비게이션

## Supabase 테이블 구조
- community_posts: id, user_id, category_slug, title, content, image_urls, view_count, like_count, comment_count, tags, is_anonymous, is_pinned, is_hidden, created_at, edited_at
- community_comments: id, post_id, user_id, parent_id, content, is_anonymous, created_at
- post_reactions: id, post_id, user_id, reaction_type(like/fire/insight/wow/sad), created_at
- bookmarks: id, post_id, user_id, created_at
- reports: id, post_id, user_id, reason, status, created_at
- notifications: id, user_id, type, title, content, link, is_read, created_at
- profiles: id, nickname, avatar_url, level, points, post_count, is_admin, is_verified, selected_avatar, selected_frame, selected_badge, created_at

## Storage
- 버킷: community-images (PUBLIC)
- 경로: {user_id}/{timestamp}_{filename}

## 완료된 작업 ✅
- Supabase 테이블/RLS/Storage 설정
- PC 3컬럼 레이아웃 (카테고리/글목록/사이드바)
- 공지 배너
- 글 카드 (좋아요/댓글/조회수)
- 우측 인기글/통계/광고 배너
- 모바일 카테고리 가로 스크롤
- 모바일 탭바 (홈/인기/글쓰기FAB/알림/마이)
- AI 버튼 커뮤니티에서 제거
- 글쓰기 페이지 (/community/write)
- 글 상세 페이지 (/community/[id])
- 반응바 (좋아요/공감/인사이트/놀라워/슬퍼요)
- 댓글/대댓글
- 조회수 실시간 카운트
- 이미지 업로드 구조

## 미완료 — Stage 2 ❌
- 반응 버튼 활성화 시각 피드백 (클릭시 골드 강조)
- 어드민 패널 (/admin)
- 알림 시스템
- 검색 기능
- 북마크 UI
- 팔로우 시스템
- 뱃지/레벨 시스템

## 미완료 — Stage 3 ❌
- 아바타 꾸미기 (/community/avatar)
  - 사진 업로드 (카메라/사진첩)
  - 아바타 선택 (게임 인벤토리 UI)
  - 테두리/뱃지/칭호
  - 프리미엄 아이템 상점
- 아티클 ↔ 커뮤니티 연결
- AI 댓글 요약
- 주간 뉴스레터 자동화

## 어드민 패널 설계 (/admin)
- 접근: chacott0518@gmail.com만
- 대시보드: 오늘 글/댓글/방문자/신규가입
- 글 관리: 목록/검색/블라인드/삭제/공지고정
- 댓글 관리: 블라인드/삭제
- 회원 관리: 레벨조정/정지/어드민권한
- 신고 관리: 미처리신고/처리
- 광고 배너 관리
- 공지사항 관리

## 아바타 수익화 시스템
- 무료: 기본 아바타 5종, 레벨업 보상
- 유료: 특수 테두리/이펙트/희귀 아바타 (1,000~5,000원)
- 구독 혜택: 월 구독자 전용 아이템
- 시즌 패스: 분기별 한정 아이템 (9,900원)

## 파일 구조
app/community/
  page.tsx - 글 목록
  [id]/page.tsx - 글 상세
  write/page.tsx - 글쓰기
  avatar/page.tsx - 아바타 꾸미기 (미완)
app/admin/ - 어드민 패널 (미완)
app/api/community/
  views/[id]/route.ts - 조회수
  upload/route.ts - 이미지 업로드
components/community/
  CommunityClient.tsx
  PostCard.tsx
  PostDetail.tsx
  CategorySidebar.tsx
  TrendingSidebar.tsx
  MobileTabBar.tsx
  Pagination.tsx
  ImageUploader.tsx
  AvatarCard.tsx
  SkeletonPostCard.tsx

## 개발 원칙
1. 기존 Supabase 연결/auth/layout.tsx 절대 건드리지 말것
2. 코드 생략 없이 전체 완성본으로 줄것
3. 각 파일 상단에 파일경로 주석 달것
4. Keep All 후 git push까지 완료할것
5. SEO 스키마 7종 모든 페이지에 포함
6. 폰트 400~500만 사용
7. 모바일/PC 둘 다 완벽 대응

## Git 작업
git add .
git commit -m "작업내용"
git push origin main
