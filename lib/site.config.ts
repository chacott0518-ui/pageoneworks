// lib/site.config.ts
//
// PAGEONEWORKS Entity Single Source of Truth (SSoT)
// 브랜드명, URL, 설명, 설립연도, 운영 정보, 이미지, Entity @id를 한 곳에서 관리한다.
// 현재 소스에서 확인된 사실만 사용한다. (검증되지 않은 값은 추가하지 않는다.)

export const siteConfig = {
  name: 'PAGEONEWORKS',
  alternateName: '페이지원웍스',

  baseUrl: 'https://www.pageoneworks.com',
  language: 'ko-KR',
  locale: 'ko_KR',

  title: 'PAGEONEWORKS — 프리미엄 라이프스타일 매거진',
  description:
    '의료·부동산·기술·법률·금융·라이프스타일 등 다양한 분야의 콘텐츠와 커뮤니티를 제공하는 프리미엄 웹 매거진',

  foundingDate: '2026',

  // Entity @id (Organization / WebSite 일관 참조용)
  publisherId: 'https://www.pageoneworks.com/#publisher',
  websiteId: 'https://www.pageoneworks.com/#website',

  // 실제 존재하는 자산 경로만 사용한다.
  logoPath: '/favicon.svg',
  ogImagePath: '/images/og-default.jpg',

  // 운영 정보 (기존 About·정책 페이지에서 확인된 값)
  email: 'chacott0518@gmail.com',
  representative: '김세준',
  businessNumber: '206-31-95055',
  operatorDisplayName: 'USENAD Co., Ltd.',

  // 전화번호 (Footer 공개 기준)
  phone: {
    display: '+82 2-739-5415',       // 화면 표시용
    href: 'tel:+82-2-739-5415',      // tel: 링크용
    international: '+82-2-739-5415', // Schema telephone 국제 형식
  },

  // 주소 (About 페이지 기준)
  address: {
    streetAddress: '장안동 463-2 이화빌딩 7F',
    addressLocality: '동대문구',
    addressRegion: '서울',
    addressCountry: 'KR',
    display: '서울 동대문구 장안동 463-2 7F',
  },

  // 검증된 SNS만 추가한다. pageone.works는 넣지 않는다.
  sameAs: [] as string[],
} as const

// 절대 URL 생성 헬퍼
export function absoluteUrl(path = ''): string {
  if (!path) return siteConfig.baseUrl
  if (/^https?:\/\//.test(path)) return path
  return `${siteConfig.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}
