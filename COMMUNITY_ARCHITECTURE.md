PAGEONEWORKS 커뮤니티 전체 설계도
> 버전 2.0 | 2026.06.08 | 새 채팅 시작 시 반드시 첨부
---
프로젝트 기본 정보
사이트: https://www.pageoneworks.com
로컬: D:\pageoneworks
스택: Next.js 14 App Router, Supabase, Vercel, TypeScript, Tailwind CSS
GitHub: chacott0518-ui/pageoneworks
Supabase: https://ezzwvqzpxvqecyxvxsav.supabase.co
디자인 시스템 (절대 변경 금지)
배경: #0d0d0f
서피스: rgba(255,255,255,0.03)
테두리: 0.5px solid rgba(255,255,255,0.06)
골드: #C9A96E
본문텍스트: rgba(255,255,255,0.82)
서브텍스트: rgba(255,255,255,0.4)
메타텍스트: rgba(255,255,255,0.25)
폰트굵기: 400~500만 (600이상 절대금지)
여백: 8px 배수 시스템
인터랙션: 150ms transition
래퍼런스
디스콰이엇: 컴팩트 카드, 이모지 반응, 뱃지, 트렌딩
Hacker News: 질 높은 정보구조, 심플 UI
클리앙: 카테고리 분류, 실시간 인기글
Linear: 초고속 반응, 키보드 네비게이션
Supabase 테이블 구조
community_posts: id, user_id, category_slug, title, content, image_urls, view_count, like_count, comment_count, tags, is_anonymous, is_pinned, is_hidden, created_at, edited_at
community_comments: id, post_id, user_id, parent_id, content, is_anonymous, created_at
post_reactions: id, post_id, user_id, reaction_type(like/fire/insight/wow/sad), created_at
bookmarks: id, post_id, user_id, created_at
reports: id, post_id, user_id, reason, status, created_at
notifications: id, user_id, type, title, content, link, is_read, created_at
profiles: id, nickname, avatar_url, level, points, post_count, is_admin, is_verified, selected_avatar, selected_frame, selected_badge, created_at
Storage
버킷: community-images (PUBLIC)
경로: {user_id}/{timestamp}_{filename}
완료된 작업 ✅
Supabase 테이블/RLS/Storage 설정
PC 3컬럼 레이아웃 (카테고리/글목록/사이드바)
공지 배너
글 카드 (좋아요/댓글/조회수)
우측 인기글/통계/광고 배너
모바일 카테고리 가로 스크롤
모바일 탭바 (홈/인기/글쓰기FAB/알림/마이)
AI 버튼 커뮤니티에서 제거
글쓰기 페이지 (/community/write)
글 상세 페이지 (/community/[id])
반응바 (좋아요/공감/인사이트/놀라워/슬퍼요)
댓글/대댓글
조회수 실시간 카운트
이미지 업로드 구조
미완료 — Stage 2 ❌
반응 버튼 활성화 시각 피드백 (클릭시 골드 강조)
어드민 패널 (/admin)
알림 시스템
검색 기능
북마크 UI
팔로우 시스템
뱃지/레벨 시스템
미완료 — Stage 3 ❌
아바타 꾸미기 (/community/avatar)
사진 업로드 (카메라/사진첩)
아바타 선택 (게임 인벤토리 UI)
테두리/뱃지/칭호
프리미엄 아이템 상점
아티클 ↔ 커뮤니티 연결
AI 댓글 요약
주간 뉴스레터 자동화
어드민 패널 설계 (/admin)
접근: chacott0518@gmail.com만
대시보드: 오늘 글/댓글/방문자/신규가입
글 관리: 목록/검색/블라인드/삭제/공지고정
댓글 관리: 블라인드/삭제
회원 관리: 레벨조정/정지/어드민권한
신고 관리: 미처리신고/처리
광고 배너 관리
공지사항 관리
아바타 수익화 시스템
무료: 기본 아바타 5종, 레벨업 보상
유료: 특수 테두리/이펙트/희귀 아바타 (1,000~5,000원)
구독 혜택: 월 구독자 전용 아이템
시즌 패스: 분기별 한정 아이템 (9,900원)
파일 구조
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
개발 원칙
기존 Supabase 연결/auth/layout.tsx 절대 건드리지 말것
코드 생략 없이 전체 완성본으로 줄것
각 파일 상단에 파일경로 주석 달것
Keep All 후 git push까지 완료할것
SEO 스키마 7종 모든 페이지에 포함
폰트 400~500만 사용
모바일/PC 둘 다 완벽 대응
Git 작업
git add .
git commit -m "작업내용"
git push origin main
0608
AI 검색 플랫폼 최적화 완전판 2026
(모든 콘텐츠/커뮤니티 글쓰기 시 필수 적용)
대상 플랫폼 전체
구글 AI Overview
네이버 AI 브리핑
네이버 메이트 (2026 신규 — 크리에이터 연동)
Perplexity
Manus
ChatGPT (Browse)
Claude (Search)
Gemini
ClovaX
Grok
---
네이버 메이트 특화 전략
네이버 메이트는 크리에이터 콘텐츠를 AI가 직접
인용하는 구조. 블로그/카페/커뮤니티 글이
메이트 답변에 직접 노출됨.
최적화 조건:
제목에 질문형 포함 필수
예: "강남 아파트 청약 62점 당첨 — 어떻게 했을까?"
첫 문단에 핵심 답변 1~2줄 요약
숫자/데이터 반드시 포함
출처 명시 (기관명 또는 직접 경험)
해시태그 3~5개 (메이트 카테고리 연동)
---
플랫폼별 인용 조건 비교
플랫폼	인용 핵심 조건
구글 AI Overview	FAQ 스키마 + 첫문장 직접답변 + E-E-A-T
네이버 AI 브리핑	Speakable 스키마 + 질문형 H2 + infobox
네이버 메이트	크리에이터 등록 + 질문형 제목 + 숫자
Perplexity	출처 명시 + 구조화 데이터 + 내부링크
Manus	단계별 정보 + 비교표 + 직접답변
ChatGPT Browse	공식 도메인 + 날짜 명시 + 팩트
Claude Search	신뢰도 높은 출처 + 명확한 구조
ClovaX	한국어 구어체 + 지역명 + 네이버 색인
Grok	최신성 + 짧은 팩트 + 날짜
---
커뮤니티 글쓰기 최적화 규칙
(PAGEONEWORKS 커뮤니티 모든 글 적용)
제목 규칙
❌ 나쁨: "청약 후기"
✅ 좋음: "강남 아파트 청약 62점 당첨 후기 — 예비번호까지"
핵심 키워드 앞에 배치
숫자/수치 포함
결과/결론을 제목에 포함
30자 이내
첫 문단 규칙 (AI 인용 핵심)
❌ 나쁨:
"오늘은 청약 후기를 써보려고 합니다."
✅ 좋음:
"강남구 아파트 청약에서 가점 62점으로
당첨됐습니다. 예비번호 3번까지 받은
실제 경험을 공유합니다."
규칙:
첫 문장 = 결론/핵심 답변
숫자 포함
2~3줄 이내
본문 구조 규칙
1단계 — 핵심 요약 (3줄 이내)
2단계 — 상세 내용 (단락별 소제목)
3단계 — 데이터/수치 (표 또는 목록)
4단계 — 결론/팁
infobox 형식 (AI 브리핑/메이트 최적화)
형식: "핵심: A | B | C | 날짜"
예시: "핵심: 가점 62점 | 강남구 | 예비 3번 | 2026.06"
태그 규칙
5~8개
검색량 높은 키워드 우선
지역명 포함
예: #청약 #강남아파트 #청약후기 #부동산 #당첨후기
---
글쓰기 전 체크리스트
[ ] 제목에 숫자/결과 포함
[ ] 첫 문장이 핵심 답변
[ ] infobox 형식 포함
[ ] 단락 소제목 질문형
[ ] 태그 5개 이상
[ ] 출처/경험 명시
[ ] 300자 이상 본문
PAGEONEWORKS UI/UX 설계 원칙 (모든 작업 필수 적용)
디자인 레퍼런스
디스콰이엇: 컴팩트 카드, 이모지 반응, 뱃지, 트렌딩
Linear: 초고속 반응, 단축키, 키보드 네비게이션
Vercel Dashboard: 정보밀도 높은 레이아웃, 미니멀
Hacker News: 질 높은 정보 구조, 노이즈 제거
필수 품질 기준
모든 인터랙션 응답속도 100ms 이내 (낙관적 업데이트)
스켈레톤 로딩 (빈 화면 절대 금지)
호버/액티브/포커스 상태 모두 명시
모바일 터치 타겟 최소 44px
줄바꿈/말줄임 모든 해상도에서 깨지지 않게
폰트 위계: 제목 볼드 > 본문 레귤러 > 메타 라이트
여백은 8px 배수 시스템 (8, 16, 24, 32, 48)
컴팩트 정보 밀도
카드 높이 최소화, 한 화면에 최대 정보 표시
아이콘 + 숫자 조합으로 공간 절약
불필요한 테두리/그림자 제거
색상은 포인트 1개만 (골드 #C9A96E)
성능 최적화
이미지 lazy loading 필수
리스트는 가상화 고려 (100개 이상)
클라이언트 상태 최소화, 서버 컴포넌트 우선
Supabase 쿼리 select 컬럼 명시 (SELECT * 금지)
PAGEONEWORKS 커뮤니티 완전 구축 지침서
> 버전 1.0 | 2026.06.05 | 초보 개발자도 단계별로 따라할 수 있는 최고 수준 커뮤니티 설계서
---
📌 프로젝트 기본 정보
항목	내용
사이트	https://www.pageoneworks.com
로컬 경로	D:\pageoneworks
스택	Next.js 14 App Router, Supabase, Vercel, TypeScript, Tailwind CSS
GitHub	chacott0518-ui/pageoneworks
디자인	다크 테마 #0a0a0a, Cormorant Garamond, Space Mono
개발자 수준	초보자 — Cursor AI 주도 개발
---
🎯 비전 & 포지셔닝
목표
> "한국의 Hacker News + 롱블랙 + 디스콰이엇"
> 프리미엄 매거진 + 전문가 커뮤니티의 결합 — 국내에 없는 포맷
차별점
아티클(매거진) ↔ 커뮤니티 연결 구조
전문가 인증 뱃지 시스템
AI 기반 기능 통합 (요약, 추천, QnA)
프리미엄 구독 모델
레퍼런스
플랫폼	가져올 장점
디스콰이엇	컴팩트 카드, 이모지 반응, 뱃지, 팔로우, 트렌딩
Hacker News	질 높은 토론, 심플한 UI, 포인트 시스템
롱블랙	프리미엄 구독, 큐레이션 콘텐츠
클리앙/보배드림	카테고리 분류, 실시간 인기글
Reddit	서브레딧형 카테고리, 업보트 시스템
네이버 카페	한국 사용자 UX 친숙도
---
🗂️ 현재 상태 진단
현재 있는 것 ✅
기본 글 작성/조회 (Supabase posts 테이블)
댓글 기능
카테고리 분류 (21개)
로그인/회원가입 (Supabase Auth)
좋아요 기본 구조
지금 없는 것 ❌ (전부 만들어야 함)
이미지 업로드
실시간 조회수 (하드코딩 상태)
페이지네이션
네이버 로그인
어드민 패널
공지 고정 기능
대댓글
북마크/스크랩
신고 시스템 실제 작동
검색 기능
알림 시스템
팔로우
뱃지 시스템
모바일 하단 탭바
이모지 반응
---
🗄️ Supabase DB 설계 (완전판)
현재 테이블 (유지)
```sql
posts, comments, users (profiles)
```
추가해야 할 테이블 전체
```sql
-- 1. 이모지 반응 (좋아요 확장)
CREATE TABLE post_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text CHECK (reaction_type IN ('like','fire','insight','wow','sad')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- 2. 북마크
CREATE TABLE bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- 3. 팔로우
CREATE TABLE follows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- 4. 신고
CREATE TABLE reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed')),
  created_at timestamptz DEFAULT now()
);

-- 5. 알림
CREATE TABLE notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text CHECK (type IN ('comment','like','follow','mention','badge','system')),
  title text NOT NULL,
  content text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 6. 뱃지
CREATE TABLE user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type text CHECK (badge_type IN ('seed','sprout','tree','forest','expert','verified')),
  earned_at timestamptz DEFAULT now()
);

-- 7. 피드백/버그 리포트
CREATE TABLE feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  type text CHECK (type IN ('bug','feature','improvement','other')),
  content text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  created_at timestamptz DEFAULT now()
);

-- 8. posts 테이블 컬럼 추가
ALTER TABLE posts ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_hidden boolean DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_urls text[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS edited_at timestamptz;

-- 9. profiles 테이블 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS follower_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS following_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS post_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified_type text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level integer DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points integer DEFAULT 0;
```
Supabase Storage 버킷 설정
```
버킷명: community-images
공개 여부: Public
허용 파일: image/jpeg, image/png, image/gif, image/webp
최대 크기: 5MB
경로 규칙: {user_id}/{timestamp}_{filename}
```
RLS (Row Level Security) 정책
```sql
-- posts: 누구나 읽기, 로그인한 사람만 작성
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_read" ON posts FOR SELECT USING (is_hidden = false);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update" ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (auth.uid() = user_id);

-- 어드민은 모든 권한
CREATE POLICY "admin_all" ON posts USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
```
---
🎨 UI/UX 설계 완전판
레이아웃 구조
PC (1200px+)
```
┌─────────────────────────────────────────────────────────┐
│  HEADER (고정)                                           │
│  로고 | 메뉴 | 커뮤니티 | 검색 | 로그인/프로필           │
├──────────┬──────────────────────────┬────────────────────┤
│ 좌측     │ 중앙 메인                 │ 우측 사이드바       │
│ 사이드바 │                          │                    │
│          │ [공지 배너]               │ 실시간 인기글 TOP5 │
│ 전체     │ [정렬탭: 최신/인기/댓글] │                    │
│ 자유게시판│                          │ 오늘의 통계        │
│ 유머·짤  │ [글카드 컴팩트 × 20개]   │ · 새글 127         │
│ 정치·시사│                          │ · 댓글 384         │
│ 공동구매 │ [페이지네이션 1,2,3,4,5] │ · 방문 892         │
│ 부동산·  │                          │ · 신규가입 14      │
│ 청약     │                          │                    │
│ ...21개  │                          │ 피드백/버그신고    │
│          │                          │                    │
│ [글쓰기] │                          │ 광고 배너          │
└──────────┴──────────────────────────┴────────────────────┘
```
모바일 (768px 이하)
```
┌─────────────────────────┐
│ HEADER (로고 + 검색 + 알림) │
├─────────────────────────┤
│ 가로 스크롤 카테고리 탭  │
├─────────────────────────┤
│ 정렬 탭 (최신/인기/댓글) │
├─────────────────────────┤
│ 글 카드 목록             │
│ (전체 너비, 컴팩트)      │
├─────────────────────────┤
│ 페이지네이션             │
├─────────────────────────┤
│ 🏠  🔥  ✏️  🔔  👤     │
│ 홈 인기 글쓰기 알림 마이  │
└─────────────────────────┘
```
글 카드 컴팩트 디자인
```
┌─────────────────────────────────────────────────────────┐
│ [부동산·청약] 강남 아파트 청약 당첨 후기 — 가점 62점... │
│ 김세준 · 3시간 전          👍 143  💬 34  👁️ 1,240     │
└─────────────────────────────────────────────────────────┘
높이: 64px, hover시 배경 살짝 밝아짐
```
글 상세 페이지 레이아웃
```
┌──────────────────────────────────┬─────────────────┐
│ ← 커뮤니티로 돌아가기            │                 │
│                                  │ 작성자 카드     │
│ H1: 제목                         │ [아바타]        │
│ [카테고리] · 작성자 · 날짜 · 조회│ 닉네임 · 뱃지   │
│                                  │ 팔로워 N명      │
│ ─────────────────────────────── │ [팔로우 버튼]   │
│                                  │                 │
│ 본문 내용                        │ ─────────────── │
│                                  │ 관련글 3개      │
│ [이미지들]                       │                 │
│                                  │ ─────────────── │
│ [태그들]                         │ 인기글 TOP5     │
│                                  │                 │
│ ─────────────────────────────── │                 │
│ 반응: 👍좋아요 🔥공감 💡인사이트 │                 │
│       😮놀라워 😢슬퍼요          │                 │
│                                  │                 │
│ [공유] [북마크] [신고]           │                 │
│ ─────────────────────────────── │                 │
│ 댓글 N개                         │                 │
│ [댓글 작성]                      │                 │
│ ─ 댓글1                         │                 │
│   └─ 대댓글1                    │                 │
│   └─ 대댓글2                    │                 │
│ ─ 댓글2                         │                 │
└──────────────────────────────────┴─────────────────┘
```
---
🛠️ 개발 파일 구조 (완전판)
```
app/
├── community/
│   ├── page.tsx                    ← 글 목록 (전면 재설계)
│   ├── [id]/
│   │   └── page.tsx               ← 글 상세 (전면 재설계)
│   └── write/
│       └── page.tsx               ← 글 작성 (이미지 업로드 추가)
├── admin/
│   ├── page.tsx                   ← 어드민 대시보드
│   ├── posts/page.tsx             ← 글 관리
│   ├── users/page.tsx             ← 회원 관리
│   ├── reports/page.tsx           ← 신고 관리
│   └── feedback/page.tsx         ← 피드백 관리
├── api/
│   ├── community/
│   │   ├── posts/route.ts         ← 글 CRUD
│   │   ├── views/[id]/route.ts    ← 조회수 업데이트
│   │   ├── reactions/route.ts     ← 반응 처리
│   │   ├── bookmarks/route.ts     ← 북마크
│   │   └── upload/route.ts        ← 이미지 업로드
│   └── admin/
│       ├── suggest/route.ts       ← 아티클 주제 추천
│       ├── generate/route.ts      ← 아티클 생성
│       └── deploy/route.ts        ← GitHub 커밋
components/
├── community/
│   ├── PostCard.tsx               ← 컴팩트 글 카드
│   ├── PostList.tsx               ← 글 목록
│   ├── PostDetail.tsx             ← 글 상세
│   ├── CommentThread.tsx          ← 대댓글 스레드
│   ├── ReactionBar.tsx            ← 이모지 반응
│   ├── Pagination.tsx             ← 페이지네이션
│   ├── CategorySidebar.tsx        ← 좌측 카테고리
│   ├── TrendingSidebar.tsx        ← 우측 트렌딩
│   ├── MobileTabBar.tsx           ← 모바일 하단탭
│   ├── ImageUploader.tsx          ← 이미지 업로드
│   ├── NoticeBar.tsx              ← 공지 배너
│   └── FeedbackButton.tsx         ← 피드백 버튼
└── admin/
    ├── AdminGuard.tsx             ← 어드민 인증
    ├── StatsCard.tsx              ← 통계 카드
    └── DataTable.tsx              ← 관리 테이블
```
---
📋 Stage별 Cursor 명령어 모음
Stage 1-A: 글 목록 페이지 전면 재설계
```
app/community/page.tsx를 완전히 새로 재설계해줘.
기존 Supabase 연결과 auth 로직은 절대 건드리지 마.

디자인:
- 다크 테마 #0a0a0a 유지
- Cormorant/Space Mono 폰트 유지

레이아웃 (PC):
- 좌측 사이드바: 카테고리 목록 (기존 21개 유지)
- 중앙: 글 목록
- 우측 사이드바: 실시간 인기글, 오늘 통계

레이아웃 (모바일):
- 좌측 사이드바 숨김
- 상단 가로 스크롤 카테고리 탭
- 하단 고정 탭바: 홈/인기/글쓰기/알림/마이

글 카드 (컴팩트):
- 한 줄: [카테고리뱃지] 제목 ... 👍N 💬N 👁️N 시간
- 높이 64px
- hover: 배경 rgba(255,255,255,0.03)

상단 중복 탭 제거:
- 기존 상단 카테고리 탭바 완전 제거
- 정렬 탭만 유지: 최신 | 인기 | 댓글많은순

공지:
- is_pinned=true 글을 상단 고정 표시
- 배경색 구분

페이지네이션:
- 하단 숫자 방식: 이전 1 2 3 4 5 다음
- 페이지당 20개

통계 (우측 사이드바):
- 하드코딩 제거
- Supabase count 쿼리로 실시간 표시
- 오늘 새글, 오늘 댓글, 현재 방문자, 신규가입
```
Stage 1-B: 글 상세 페이지 재설계
```
app/community/[id]/page.tsx를 완전히 재설계해줘.
기존 Supabase 연결 절대 건드리지 마.

레이아웃:
- 2컬럼: 좌측 본문(70%) + 우측 사이드바(30%)
- 모바일: 1컬럼 풀너비

본문 섹션:
- H1: 제목 (Cormorant, 28px)
- 메타: 카테고리뱃지 · 작성자 · 날짜 · 조회수
- 본문 내용 (여백 충분히)
- 이미지 있으면 본문 내 표시
- 태그 목록

반응 바:
- 👍좋아요 🔥공감 💡인사이트 😮놀라워 😢슬퍼요
- 각 클릭시 Supabase post_reactions에 저장
- 이미 반응한 경우 해제 가능

하단 액션:
- 공유하기 | 북마크 | 신고하기

댓글 섹션:
- 댓글 작성창 (로그인 필요)
- 댓글 목록 (대댓글 1단계 지원)
- 대댓글 작성 버튼

우측 사이드바:
- 작성자 프로필 카드 (아바타, 닉네임, 뱃지, 팔로우 버튼)
- 관련글 3개 (같은 카테고리)
- 인기글 TOP5

모바일:
- 2컬럼 → 1컬럼
- 우측 사이드바 → 본문 하단으로 이동
```
Stage 1-C: 이미지 업로드
```
다음 2가지를 만들어줘. 기존 코드 건드리지 마.

1. components/community/ImageUploader.tsx
- 드래그앤드롭 + 클릭 업로드
- 최대 3장
- 미리보기 표시
- Supabase Storage community-images 버킷에 업로드
- 업로드 후 URL 배열 반환
- 파일 크기 5MB 제한
- 허용: jpg, png, gif, webp

2. app/api/community/upload/route.ts
- POST 요청 받아서 Supabase Storage에 저장
- 경로: {user_id}/{timestamp}_{filename}
- 성공시 public URL 반환
```
Stage 1-D: 조회수 실시간 카운트
```
다음을 만들어줘.

1. app/api/community/views/[id]/route.ts
- POST: 조회수 +1 (posts 테이블 view_count)
- 동일 유저 1시간 내 중복 카운트 방지 (localStorage 활용)

2. app/community/[id]/page.tsx 상단에
- 페이지 진입시 조회수 API 호출 추가
- useEffect로 클라이언트에서 호출
```
Stage 2-A: 어드민 패널
```
app/admin/ 어드민 패널을 만들어줘.
접근 조건: profiles 테이블에 is_admin=true인 유저만 접근 가능.
미인증시 / 로 리다이렉트.

app/admin/page.tsx — 대시보드:
- 통계 카드 4개: 총 글수, 총 회원수, 오늘 글수, 오늘 방문자
- 최근 신고 5개 목록
- 최근 피드백 5개 목록

app/admin/posts/page.tsx — 글 관리:
- 글 목록 테이블 (제목, 작성자, 카테고리, 날짜, 조회수, 상태)
- 각 글: 공지고정/숨김/삭제 버튼
- 검색 기능

app/admin/users/page.tsx — 회원 관리:
- 회원 목록 테이블 (닉네임, 이메일, 가입일, 글수, 상태)
- 각 회원: 어드민 권한 부여/제거, 정지 버튼

app/admin/reports/page.tsx — 신고 관리:
- 신고 목록 (신고된 글, 신고자, 사유, 상태)
- 처리완료/무시 버튼

디자인: 기존 사이트 다크 테마 유지
```
Stage 2-B: 네이버 로그인
```
Supabase Auth에 네이버 OAuth를 추가해줘.

1. app/login/page.tsx에 네이버 로그인 버튼 추가
   - 기존 버튼들과 동일한 스타일
   - 네이버 초록색 (#03C75A)

2. app/auth/callback/route.ts 확인 및 네이버 콜백 처리

3. .env.local에 추가해야 할 변수 목록만 알려줘:
   NAVER_CLIENT_ID=
   NAVER_CLIENT_SECRET=
   (실제 값은 내가 직접 넣을 것)

Supabase 대시보드 설정 방법도 주석으로 안내해줘.
```
---
🔧 수동으로 직접 해야 할 작업 목록
Supabase 대시보드
[ ] 위 SQL 쿼리로 테이블 추가 (SQL Editor에서 실행)
[ ] Storage → community-images 버킷 생성 (Public)
[ ] Authentication → Providers → Naver 활성화
[ ] profiles 테이블에 is_admin 컬럼 추가 후 본인 계정에 true 설정
Vercel 환경변수
[ ] NAVER_CLIENT_ID 추가
[ ] NAVER_CLIENT_SECRET 추가
네이버 개발자 콘솔 (developers.naver.com)
[ ] 애플리케이션 등록
[ ] 서비스 URL: https://www.pageoneworks.com
[ ] 콜백 URL: https://[프로젝트ID].supabase.co/auth/v1/callback
[ ] Client ID, Secret 복사
---
💰 수익 모델 로드맵
단기 (0~6개월) — 목표 월 50~200만원
방법	구현 난이도	예상 수익
구글 애드센스	쉬움	월 10~50만원
카카오 애드핏	쉬움	월 5~30만원
프리미엄 구독 (월 9,900원)	중간	구독자 × 9,900원
스폰서 아티클	영업 필요	건당 50~200만원
중기 (6개월~1년) — 목표 월 200~1,000만원
방법	설명
전문가 Q&A 유료화	커뮤니티 전문가에게 유료 질문
트렌드 리포트 판매	커뮤니티 데이터 기반 B2B 리포트
뉴스레터 광고	구독자 5,000명+ 시 단가 형성
채용 공고 게시	IT/전문직 채용 게시판
장기 (1년~) — 목표 월 1,000만원+
방법	설명
SaaS 커뮤니티 도구	다른 사이트에 커뮤니티 기능 제공
오프라인 이벤트	커뮤니티 기반 세미나/네트워킹
데이터 비즈니스	소비자 트렌드 데이터 판매
---
📈 커뮤니티 성장 전략
초기 0→100명 (가장 중요)
세준님이 직접 매일 카테고리별 글 3~5개 작성 (초기 3개월)
지인 20~30명 초대해서 씨앗 커뮤니티 형성
각 카테고리별 전문가 1명씩 영입 (부동산, 법률, 의료 등)
아티클 하단 "이 주제 커뮤니티에서 토론하기" 버튼 → 매거진 독자 유입
100→1,000명
주간 베스트 글 뉴스레터 발송
SEO로 유입된 아티클 독자 → 커뮤니티 전환 퍼널
인기 커뮤니티 글 → 아티클로 확장 (역방향 연결)
카카오/네이버 카페 공유로 외부 유입
1,000→10,000명
미디어 노출 (IT 매체 소개 기사)
전문가 AMA (Ask Me Anything) 이벤트
월간 베스트 작성자 리워드
파트너십 (전문가 단체, 협회)
---
⚠️ 자주 발생하는 오류 & 해결법
Next.js Server Component에서 이벤트 핸들러 오류
```
Error: Event handlers cannot be passed to Client Component props
해결: 'use client' 추가 또는 별도 Client Component 분리
```
Supabase RLS 오류
```
Error: new row violates row-level security policy
해결: Supabase 대시보드 → Authentication → Policies 확인
```
이미지 업로드 오류
```
Error: Bucket not found
해결: Supabase Storage에서 community-images 버킷 생성 확인
```
빌드 오류 (JSON 인코딩)
```
한글이 포함된 파일을 터미널 명령어로 수정하면 인코딩 깨짐
해결: 항상 파일 전체를 Cursor에서 직접 수정, 터미널 echo 명령 사용 금지
```
---
🎯 개발 원칙 (초보자 필수 규칙)
한 번에 하나씩 — 여러 파일 동시 수정 금지
기존 작동하는 코드 절대 건드리지 마 — 매 명령어에 명시
완성된 파일 전체 내용 요청 — 부분 diff 대신 전체 파일
git commit은 작업 단위로 — 기능 하나 완성 후 즉시 커밋
배포 전 로컬 확인 — npm run dev로 먼저 확인
터미널 한글 명령 금지 — 인코딩 오류 원인
Keep All 전 코드 확인 — 무엇이 바뀌는지 확인 후 승인
---
📅 진행 현황 체크리스트
Stage 1 (지금 당장)
[ ] Supabase 테이블 추가 (수동)
[ ] 글 목록 페이지 재설계
[ ] 글 상세 페이지 재설계
[ ] 이미지 업로드
[ ] 조회수 실시간 카운트
[ ] 페이지네이션
[ ] 하드코딩 통계 제거
[ ] 모바일 하단 탭바
Stage 2
[ ] 어드민 패널
[ ] 네이버 로그인
[ ] 이모지 반응 시스템
[ ] 북마크
[ ] 팔로우 시스템
[ ] 신고 시스템 실제 작동
[ ] 검색 기능
[ ] 알림 시스템
Stage 3
[ ] 뱃지/레벨 시스템
[ ] 아티클 ↔ 커뮤니티 연결
[ ] AI 댓글 요약
[ ] 전문가 인증 뱃지
[ ] 주간 뉴스레터 자동화
[ ] 자동 포스팅 어드민
---
이 지침서는 pageoneworks 커뮤니티 개발의 단일 진실 소스(Single Source of Truth)입니다.
새 Cursor 세션 시작 시 이 파일을 먼저 첨부하고 시작하세요.