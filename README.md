# PAGEONEWORKS — Premium Web Magazine

## 🚀 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev
# → http://localhost:3000

# 3. 빌드
npm run build
npm start
```

---

## 📁 프로젝트 구조

```
pageoneworks/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx            # 홈페이지
│   ├── not-found.tsx       # 404 페이지
│   ├── archive/
│   │   └── page.tsx        # 전체 아티클 목록
│   ├── community/
│   │   └── page.tsx        # 멤버십 & 신청 폼
│   ├── category/
│   │   └── [slug]/page.tsx # 카테고리별 아티클
│   └── article/
│       └── [slug]/page.tsx # 아티클 상세
├── components/
│   ├── Header.tsx          # 헤더 (PAGEONEWORKS 로고)
│   ├── OverlayMenu.tsx     # 풀스크린 오버레이 메뉴
│   ├── HeroPanorama.tsx    # 히어로 섹션 (영상 교체 준비됨)
│   ├── MagazineGrid.tsx    # 메인 아티클 그리드
│   ├── CategoryShowcase.tsx # 카테고리 목록 섹션
│   ├── CommunityCTA.tsx    # 멤버십 CTA
│   ├── Footer.tsx          # 푸터
│   └── NoiseOverlay.tsx    # 노이즈 텍스처 오버레이
├── lib/
│   ├── data.ts             # 카테고리 & 아티클 데이터
│   └── cn.ts               # className 유틸리티
└── styles/
    └── globals.css         # 글로벌 스타일 + 폰트
```

---

## 🎥 히어로 영상 교체 방법

`components/HeroPanorama.tsx`에서 주석 부분을 찾아 교체:

```tsx
// 현재: gradient 배경
<div className="w-full h-full" style={{ background: '...' }} />

// 교체: 본인 영상 파일
<video autoPlay muted loop playsInline className="w-full h-full object-cover">
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
```

영상 파일은 `public/videos/hero.mp4`에 넣으세요.

---

## ✏️ 콘텐츠 추가 방법

### 아티클 추가
`lib/data.ts`의 `articles` 배열에 항목 추가:

```ts
{
  id: 7,
  slug: 'my-new-article',
  category: 'VITALITY',
  categorySlug: 'vitality',
  title: 'New Article Title',
  titleKo: '새 아티클 제목',
  excerpt: '요약 텍스트',
  date: '2026.03.15',
  readTime: '5 MIN',
  image: 'https://your-image-url.com/image.jpg',
}
```

---

## 🚢 Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 🔧 Cursor에서 다음 단계

1. **실제 영상 연결** — `/public/videos/hero.mp4` 배치
2. **CMS 연동** — Sanity 또는 Notion API 연결
3. **이메일 폼** — Resend 또는 Nodemailer 연동
4. **댓글/커뮤니티** — Supabase + Realtime
5. **인증** — NextAuth.js (멤버십 로그인)
6. **결제** — Toss Payments 또는 Stripe
7. **Analytics** — Vercel Analytics 또는 GA4

---

## 🎨 디자인 시스템

| 항목 | 값 |
|------|-----|
| 헤딩 폰트 | Cormorant Garamond (serif) |
| 본문 폰트 | Inter (sans) |
| 모노 폰트 | Space Mono |
| 배경 (다크) | `#0a0a0a` |
| 배경 (라이트) | `#f5f2ed` (cream) |
| 텍스트 (다크) | `#f5f2ed` (cream) |
| 텍스트 (라이트) | `#1a1a1a` (ink) |
| 포인트 컬러 | `#c9a96e` (gold) |
