import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { siteConfig, absoluteUrl } from '@/lib/site.config';

const ADVERTISE_URL = absoluteUrl('/advertise');
const CONTACT_PAGE_ID = `${ADVERTISE_URL}#contactpage`;
const BREADCRUMB_ID = `${ADVERTISE_URL}#breadcrumb`;
const FAQ_ID = `${ADVERTISE_URL}#faq`;

const UPDATED_DATE = '2026-06-30';
const UPDATED_DATE_DISPLAY = '2026.06.30';

const PAGE_TITLE = `광고·제휴 문의 | ${siteConfig.name}`;

const PAGE_DESCRIPTION =
  `${siteConfig.name}의 브랜드 콘텐츠, 인터뷰, 배너 광고, 공동 캠페인과 미디어 제휴를 안내합니다. 협업 분야, 편집 원칙, 진행 절차, 광고 표시 기준과 문의 방법을 확인하세요.`;

const partnershipFields = [
  {
    title: '부동산·주거',
    description:
      '부동산, 건축, 인테리어, 주거 서비스와 공간 관련 브랜드 및 프로젝트를 다룹니다.',
  },
  {
    title: '의료·헬스케어',
    description:
      '병원, 건강관리, 검진, 의료기술과 헬스케어 서비스의 정보성 콘텐츠를 검토합니다.',
  },
  {
    title: '안티에이징·뷰티',
    description:
      '안티에이징, 피부관리, 웰니스, 뷰티 제품과 라이프케어 브랜드를 다룹니다.',
  },
  {
    title: '법률·세무',
    description:
      '법률, 세무, 회계, 자산관리 등 전문 서비스의 개념과 선택 기준을 전달합니다.',
  },
  {
    title: '미식·호텔',
    description:
      '레스토랑, 식품, 호텔, 리조트와 공간 경험을 독자의 관점에서 소개합니다.',
  },
  {
    title: '여행·지역',
    description:
      '국내외 여행, 관광, 숙박, 지역 콘텐츠와 체류 경험을 다룹니다.',
  },
  {
    title: '교육·문화',
    description:
      '교육 서비스, 출판, 전시, 문화, 예술과 지식 콘텐츠 분야를 검토합니다.',
  },
  {
    title: '기업·전문 브랜드',
    description:
      'PAGEONEWORKS 독자에게 새로운 정보와 선택 기준을 제공할 수 있는 기업 및 기관과 협업합니다.',
  },
];

const partnershipTypes = [
  {
    title: '브랜드 콘텐츠',
    description:
      '제품이나 서비스를 단순히 홍보하는 문장보다 브랜드의 배경, 특징, 이용 조건과 독자가 확인해야 할 기준을 기사 형태로 구성합니다.',
  },
  {
    title: '인터뷰·인물 콘텐츠',
    description:
      '대표자, 전문가, 창작자와 실무자의 경험과 전문성을 인터뷰 또는 프로필 콘텐츠로 제작합니다. 확인되지 않은 경력과 자격은 사용하지 않습니다.',
  },
  {
    title: '제품·서비스 체험 콘텐츠',
    description:
      '실제 확인할 수 있는 제품, 공간과 서비스의 특징, 이용 과정, 적합한 대상과 주의사항을 독자 중심으로 설명합니다.',
  },
  {
    title: '배너·디스플레이 광고',
    description:
      '메인, 카테고리 또는 기사 영역의 배너 광고를 협의할 수 있습니다. 노출 위치와 기간은 이용 경험을 해치지 않는 범위에서 결정합니다.',
  },
  {
    title: '공동 기획·캠페인',
    description:
      '브랜드와 하나의 주제를 정해 특집 기사, 인터뷰, 가이드, 이벤트 또는 연속 콘텐츠를 공동으로 기획합니다.',
  },
  {
    title: '장기 콘텐츠 파트너십',
    description:
      '한 번의 노출보다 특정 분야를 지속적으로 다루는 연재, 콘텐츠 허브, 브랜드 스토리와 장기 프로젝트를 구성합니다.',
  },
];

const editorialPrinciples = [
  {
    title: '광고 관계를 표시합니다',
    description:
      '비용 지급, 협찬, 제품 제공 또는 제휴 관계가 있는 콘텐츠는 독자가 확인할 수 있도록 해당 사실을 표시합니다.',
  },
  {
    title: '사실을 확인합니다',
    description:
      '공식 자료, 자격, 수치, 제품 정보와 서비스 조건을 확인하며 출처가 불분명한 통계와 과장된 표현은 사용하지 않습니다.',
  },
  {
    title: '편집 기준을 유지합니다',
    description:
      '광고주의 자료와 의견을 참고하지만 최종 제목, 문장, 구성과 사실 표현은 PAGEONEWORKS의 편집 기준에 따라 결정합니다.',
  },
  {
    title: '결과를 보장하지 않습니다',
    description:
      '검색 순위, AI 답변 인용, 의료 결과, 법률 결과, 절세 효과와 투자 수익처럼 통제할 수 없는 결과를 보장하지 않습니다.',
  },
  {
    title: '독자 가치를 우선합니다',
    description:
      '제품명과 키워드만 반복하는 광고보다 독자가 새로운 정보, 비교 기준과 실질적인 도움을 얻을 수 있는 콘텐츠를 우선합니다.',
  },
  {
    title: '관련 규정을 검토합니다',
    description:
      '의료, 법률, 세무와 금융처럼 별도 규제가 적용될 수 있는 분야는 사실관계와 광고 표현을 더욱 신중하게 검토합니다.',
  },
];

const processItems = [
  {
    number: '01',
    title: '문의 접수',
    description:
      '브랜드명, 공식 웹사이트, 담당자 연락처, 협업 목적, 희망 일정과 필요한 콘텐츠 유형을 전달합니다.',
  },
  {
    number: '02',
    title: '적합성 검토',
    description:
      'PAGEONEWORKS의 콘텐츠 분야, 독자, 편집 기준과 제안된 제품 또는 서비스의 적합성을 확인합니다.',
  },
  {
    number: '03',
    title: '기획·견적 협의',
    description:
      '콘텐츠 형식, 제작 범위, 취재 여부, 노출 위치, 일정, 광고 표시 방식과 비용을 협의합니다.',
  },
  {
    number: '04',
    title: '자료 확인·제작',
    description:
      '공식 자료, 이미지 사용 권한, 자격, 수치와 주요 사실을 확인한 후 PAGEONEWORKS의 형식으로 콘텐츠를 제작합니다.',
  },
  {
    number: '05',
    title: '검수·공개',
    description:
      '사실관계와 필수 정보를 확인한 뒤 공개합니다. 광고·협찬·제휴 표시는 임의로 삭제하거나 숨기지 않습니다.',
  },
];

const inquiryItems = [
  '회사 또는 브랜드명',
  '담당자 이름과 연락 가능한 이메일 또는 전화번호',
  '공식 웹사이트 또는 브랜드 소개 자료',
  '홍보하려는 제품·서비스 또는 프로젝트',
  '희망하는 광고·제휴 방식',
  '희망 일정과 캠페인 기간',
  '예산 범위',
  '제공 가능한 사진·영상·자료와 사용 권한',
  '전문 분야라면 자격·허가·공식 근거 자료',
];

const unavailableItems = [
  '허위 또는 과장된 광고',
  '출처를 확인할 수 없는 통계와 효과',
  '의료 결과, 승소 결과, 절세 효과 또는 투자 수익 보장',
  '가짜 후기, 평점 또는 이용자 반응',
  '광고·협찬 사실을 숨기거나 삭제해 달라는 요청',
  '타인이나 경쟁사를 비방하는 콘텐츠',
  '불법 제품, 권리 침해 또는 관련 규정 위반 가능성이 있는 콘텐츠',
  '독자에게 실질적인 정보가 없는 키워드 반복형 콘텐츠',
];

const faqItems = [
  {
    question: 'PAGEONEWORKS에는 어떤 광고를 게재할 수 있나요?',
    answer:
      '부동산·의료·안티에이징·법률·세무·미식·여행·교육 분야와 관련된 브랜드 콘텐츠, 인터뷰, 배너 광고, 체험 콘텐츠, 공동 캠페인과 장기 파트너십을 협의할 수 있습니다. 모든 제안은 매거진의 편집 기준과 독자 적합성을 먼저 검토합니다.',
  },
  {
    question: '광고 콘텐츠는 일반 기사와 어떻게 구분되나요?',
    answer:
      '비용 지급, 협찬, 제품 제공 또는 제휴 관계가 있는 콘텐츠에는 독자가 해당 관계를 확인할 수 있도록 광고·협찬·제휴 사실을 표시합니다. 일반 편집 콘텐츠와 광고 콘텐츠가 혼동되지 않도록 구분하는 것이 PAGEONEWORKS의 원칙입니다.',
  },
  {
    question: '광고주가 작성한 원고를 그대로 게재할 수 있나요?',
    answer:
      '광고주가 제공한 원고와 자료는 참고할 수 있지만 그대로 게재하는 것을 원칙으로 하지 않습니다. PAGEONEWORKS의 문체, 사실 확인 기준, 독자 가독성과 관련 규정에 맞게 편집하거나 다시 작성합니다.',
  },
  {
    question: '검색엔진 상위 노출이나 AI 답변 인용을 보장하나요?',
    answer:
      '보장하지 않습니다. 검색엔진과 생성형 AI가 콘텐츠를 이해할 수 있도록 제목, 직접 답변, 문서 구조, Entity와 출처를 고려해 제작할 수 있지만 Google·네이버 검색 순위와 AI 답변의 인용 여부는 각 플랫폼이 결정합니다.',
  },
  {
    question: '의료·법률·세무 분야의 광고도 가능한가요?',
    answer:
      '가능하지만 관련 법률, 광고 규정, 전문 자격, 사실관계와 표현을 별도로 검토합니다. 치료 효과, 사건 결과, 절세 결과를 보장하거나 확인되지 않은 자격과 수치를 사용하는 광고는 진행하지 않습니다.',
  },
  {
    question: '광고와 제휴 비용은 얼마인가요?',
    answer:
      '비용은 콘텐츠 유형, 취재와 제작 범위, 이미지 제작, 노출 위치, 캠페인 기간과 2차 사용 범위에 따라 달라집니다. 협업 목적과 필요한 범위를 확인한 뒤 개별 견적을 안내합니다.',
  },
  {
    question: '제작된 콘텐츠를 광고주 채널에서도 사용할 수 있나요?',
    answer:
      'PAGEONEWORKS 사이트 게재와 광고주의 홈페이지, SNS, 인쇄물 또는 광고 소재 사용은 서로 다른 사용 범위입니다. 콘텐츠의 2차 사용 여부, 매체, 기간과 수정 가능 범위는 사전에 별도로 협의해야 합니다.',
  },
  {
    question: '광고·제휴 문의는 어디로 보내면 되나요?',
    answer:
      `브랜드명, 공식 웹사이트, 담당자 연락처, 협업 목적, 희망 일정과 예산 범위를 정리해 ${siteConfig.email}로 보내주시면 검토 후 협업 가능 여부와 필요한 추가 정보를 안내합니다.`,
  },
];

const mailSubject = encodeURIComponent(
  `[${siteConfig.name} 광고·제휴 문의]`,
);

const mailBody = encodeURIComponent(`회사·브랜드명:
담당자명:
연락처:
공식 웹사이트:
홍보 제품·서비스:
희망 광고·제휴 유형:
희망 일정:
예산 범위:
추가 요청사항:`);

const mailtoHref =
  `mailto:${siteConfig.email}?subject=${mailSubject}&body=${mailBody}`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'PAGEONEWORKS 광고',
    '페이지원웍스 광고',
    'PAGEONEWORKS 제휴',
    '페이지원웍스 제휴',
    '매거진 광고 문의',
    '라이프스타일 매거진 광고',
    '프리미엄 매거진 광고',
    '브랜드 콘텐츠 제작',
    '인터뷰 콘텐츠 제작',
    '배너 광고 문의',
    '미디어 파트너십',
    '브랜드 캠페인 제휴',
  ],
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.baseUrl,
    },
  ],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: ADVERTISE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: ADVERTISE_URL,
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImagePath),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} 광고·제휴 문의`,
      },
    ],
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [absoluteUrl(siteConfig.ogImagePath)],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': CONTACT_PAGE_ID,
      url: ADVERTISE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: siteConfig.locale.replace('_', '-'),
      dateModified: UPDATED_DATE,
      about: {
        '@id': siteConfig.publisherId,
      },
      publisher: {
        '@id': siteConfig.publisherId,
      },
      mainEntity: {
        '@type': 'Organization',
        '@id': siteConfig.publisherId,
        name: siteConfig.name,
        url: siteConfig.baseUrl,
        email: siteConfig.email,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'advertising and partnership inquiries',
          email: siteConfig.email,
          availableLanguage: ['ko'],
        },
      },
      breadcrumb: {
        '@id': BREADCRUMB_ID,
      },
      hasPart: {
        '@id': FAQ_ID,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': BREADCRUMB_ID,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '홈',
          item: siteConfig.baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '광고·제휴 문의',
          item: ADVERTISE_URL,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': FAQ_ID,
      url: `${ADVERTISE_URL}#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

const colors = {
  background: '#0a0a0a',
  text: '#f5f2ed',
  textStrong: 'rgba(245,242,237,0.92)',
  textNormal: 'rgba(245,242,237,0.7)',
  textMuted: 'rgba(245,242,237,0.5)',
  textFaint: 'rgba(245,242,237,0.34)',
  line: 'rgba(245,242,237,0.11)',
  lineStrong: 'rgba(245,242,237,0.18)',
  panel: 'rgba(245,242,237,0.03)',
  panelStrong: 'rgba(245,242,237,0.055)',
  accent: '#c9a96e',
  accentHover: '#dbc08b',
};

const bodyFont =
  '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", Arial, sans-serif';

const serifFont =
  'var(--font-cormorant), "Noto Serif KR", Georgia, serif';

const monoFont =
  'var(--font-space-mono), "SFMono-Regular", Consolas, monospace';

const sectionStyle: CSSProperties = {
  borderTop: `0.5px solid ${colors.line}`,
  padding: 'clamp(48px, 8vw, 76px) 0',
  scrollMarginTop: '100px',
};

const eyebrowStyle: CSSProperties = {
  margin: '0 0 16px',
  fontFamily: monoFont,
  fontSize: '9px',
  lineHeight: 1.7,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: colors.textFaint,
};

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 24px',
  maxWidth: '820px',
  fontFamily: serifFont,
  fontSize: 'clamp(1.75rem, 5vw, 2.55rem)',
  lineHeight: 1.35,
  fontWeight: 300,
  letterSpacing: '-0.025em',
  color: colors.textStrong,
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
};

const leadStyle: CSSProperties = {
  margin: '0',
  maxWidth: '840px',
  fontFamily: serifFont,
  fontSize: 'clamp(1.28rem, 4vw, 1.8rem)',
  lineHeight: 1.75,
  fontWeight: 300,
  letterSpacing: '-0.018em',
  color: colors.textStrong,
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
};

const paragraphStyle: CSSProperties = {
  margin: '0 0 20px',
  maxWidth: '820px',
  fontFamily: bodyFont,
  fontSize: 'clamp(15px, 2vw, 16px)',
  lineHeight: 1.9,
  letterSpacing: '-0.012em',
  color: colors.textNormal,
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
};

const cardTitleStyle: CSSProperties = {
  margin: '0 0 12px',
  fontFamily: bodyFont,
  fontSize: '16px',
  lineHeight: 1.55,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  color: colors.textStrong,
  wordBreak: 'keep-all',
};

const cardTextStyle: CSSProperties = {
  margin: 0,
  fontFamily: bodyFont,
  fontSize: '14px',
  lineHeight: 1.85,
  letterSpacing: '-0.01em',
  color: colors.textNormal,
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
};

const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '14px',
};

export default function AdvertisePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main
        style={{
          minHeight: '100vh',
          boxSizing: 'border-box',
          background: colors.background,
          paddingTop: 'clamp(96px, 14vw, 140px)',
          paddingBottom: 'clamp(80px, 12vw, 130px)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '960px',
            boxSizing: 'border-box',
            margin: '0 auto',
            padding: '0 clamp(18px, 5vw, 32px)',
          }}
        >
          <header
            style={{
              paddingBottom: 'clamp(48px, 9vw, 82px)',
            }}
          >
            <p style={eyebrowStyle}>Advertise · 광고·제휴</p>

            <h1
              style={{
                margin: '0 0 24px',
                maxWidth: '900px',
                fontFamily: serifFont,
                fontSize: 'clamp(2.65rem, 10vw, 5rem)',
                lineHeight: 1.08,
                fontWeight: 300,
                letterSpacing: '-0.045em',
                color: colors.text,
                wordBreak: 'keep-all',
              }}
            >
              광고·제휴 문의
            </h1>

            <time
              dateTime={UPDATED_DATE}
              style={{
                display: 'block',
                fontFamily: monoFont,
                fontSize: '9px',
                lineHeight: 1.7,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: colors.textFaint,
              }}
            >
              Partnership information · Updated {UPDATED_DATE_DISPLAY}
            </time>
          </header>

          <section
            aria-labelledby="advertise-summary-title"
            style={{
              ...sectionStyle,
              paddingTop: 'clamp(42px, 7vw, 64px)',
            }}
          >
            <p style={eyebrowStyle}>Direct answer · 핵심 안내</p>

            <h2
              id="advertise-summary-title"
              style={{
                ...leadStyle,
                marginBottom: '30px',
              }}
            >
              PAGEONEWORKS는 부동산·의료·안티에이징·법률·세무·미식·여행·교육
              분야의 브랜드와 광고·콘텐츠·미디어 제휴를 진행하는
              프리미엄 라이프스타일 매거진입니다.
            </h2>

            <p style={paragraphStyle}>
              브랜드의 제품과 서비스를 단순히 노출하는 광고보다 독자가
              새로운 정보와 실제 판단 기준을 얻을 수 있는 협업을
              우선합니다. 브랜드 콘텐츠, 인터뷰, 체험 콘텐츠, 배너,
              공동 캠페인과 장기 콘텐츠 파트너십을 협의할 수 있습니다.
            </p>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '38px',
              }}
            >
              광고·협찬·제휴 관계가 있는 콘텐츠는 일반 편집 콘텐츠와
              구분해 표시합니다. 의료·법률·세무처럼 전문성과 규정 검토가
              필요한 분야는 자격, 사실관계, 표현과 공식 근거를 더욱
              신중하게 확인합니다.
            </p>

            <div
              aria-label="PAGEONEWORKS 광고·제휴 핵심 정보"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '1px',
                border: `0.5px solid ${colors.line}`,
                background: colors.line,
              }}
            >
              {[
                {
                  label: '매체 성격',
                  value: '독립 프리미엄 라이프스타일 매거진',
                },
                {
                  label: '주요 분야',
                  value:
                    '부동산·의료·안티에이징·법률·세무·미식·여행·교육',
                },
                {
                  label: '협업 방식',
                  value:
                    '브랜드 콘텐츠·인터뷰·배너·캠페인·장기 파트너십',
                },
                {
                  label: '편집 원칙',
                  value: '광고 표시·사실 확인·독자 가치·편집 기준',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    minWidth: 0,
                    padding: '24px',
                    background: colors.background,
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontFamily: monoFont,
                      fontSize: '9px',
                      lineHeight: 1.6,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: colors.textFaint,
                    }}
                  >
                    {item.label}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontFamily: bodyFont,
                      fontSize: '14px',
                      lineHeight: 1.75,
                      fontWeight: 500,
                      letterSpacing: '-0.015em',
                      color: colors.textNormal,
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="partnership-fields-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Partnership fields · 협업 분야</p>

            <h2
              id="partnership-fields-title"
              style={sectionTitleStyle}
            >
              PAGEONEWORKS는 어떤 브랜드와 협업하나요?
            </h2>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '38px',
              }}
            >
              PAGEONEWORKS가 다루는 분야와 관련이 있고, 독자에게 새로운
              정보나 선택 기준을 제공할 수 있는 브랜드, 기업, 기관과의
              협업을 검토합니다. 단순한 인지도 노출보다 콘텐츠로 설명할
              가치가 있는 제품·서비스·공간·사람·프로젝트를 우선합니다.
            </p>

            <div style={gridStyle}>
              {partnershipFields.map((item, index) => (
                <article
                  key={item.title}
                  style={{
                    minWidth: 0,
                    padding: '26px',
                    border: `0.5px solid ${colors.line}`,
                    background:
                      index % 2 === 0
                        ? colors.panel
                        : colors.background,
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 18px',
                      fontFamily: monoFont,
                      fontSize: '9px',
                      lineHeight: 1.5,
                      letterSpacing: '0.14em',
                      color: colors.textFaint,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </p>

                  <h3 style={cardTitleStyle}>{item.title}</h3>
                  <p style={cardTextStyle}>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="partnership-types-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Partnership types · 협업 유형</p>

            <h2
              id="partnership-types-title"
              style={sectionTitleStyle}
            >
              어떤 광고와 제휴가 가능한가요?
            </h2>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '38px',
              }}
            >
              협업 목적, 독자, 제작 범위와 캠페인 기간에 따라 적합한
              형식을 결정합니다. 모든 콘텐츠는 PAGEONEWORKS 사이트의
              디자인과 편집 기준에 맞게 제작됩니다.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1px',
                border: `0.5px solid ${colors.line}`,
                background: colors.line,
              }}
            >
              {partnershipTypes.map((item) => (
                <article
                  key={item.title}
                  style={{
                    minWidth: 0,
                    padding: '28px',
                    background: colors.background,
                  }}
                >
                  <h3 style={cardTitleStyle}>{item.title}</h3>
                  <p style={cardTextStyle}>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="editorial-principles-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Editorial policy · 광고 편집 원칙</p>

            <h2
              id="editorial-principles-title"
              style={sectionTitleStyle}
            >
              광고 콘텐츠는 일반 기사와 어떻게 구분하나요?
            </h2>

            <p style={paragraphStyle}>
              PAGEONEWORKS는 광고, 협찬, 제품 제공, 제휴 또는 비용 지급
              관계가 있는 콘텐츠에 해당 사실을 표시합니다. 광고주의
              의견과 자료를 존중하지만 최종 제목, 문장, 사실 표현과
              구성은 PAGEONEWORKS의 편집 기준에 따라 결정합니다.
            </p>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '38px',
              }}
            >
              독자를 오인하게 하거나 검증할 수 없는 효과를 주장하는
              광고는 진행하지 않습니다. 광고 콘텐츠에도 일반 기사와
              동일하게 정확성, 가독성, 출처와 책임 있는 표현 기준을
              적용합니다.
            </p>

            <div style={gridStyle}>
              {editorialPrinciples.map((item) => (
                <article
                  key={item.title}
                  style={{
                    minWidth: 0,
                    padding: '26px',
                    border: `0.5px solid ${colors.line}`,
                    background: colors.panel,
                  }}
                >
                  <h3 style={cardTitleStyle}>{item.title}</h3>
                  <p style={cardTextStyle}>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="process-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Process · 진행 절차</p>

            <h2 id="process-title" style={sectionTitleStyle}>
              광고·제휴는 어떻게 진행되나요?
            </h2>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '28px',
              }}
            >
              제안 접수부터 공개까지 필요한 사실과 권리 관계를 확인하고,
              제작 범위와 일정을 명확히 협의합니다.
            </p>

            <ol
              style={{
                margin: 0,
                padding: 0,
                listStyle: 'none',
                borderTop: `0.5px solid ${colors.lineStrong}`,
              }}
            >
              {processItems.map((item) => (
                <li
                  key={item.number}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '44px minmax(0, 1fr)',
                    gap: '18px',
                    padding: '28px 0',
                    borderBottom: `0.5px solid ${colors.line}`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: monoFont,
                      fontSize: '10px',
                      lineHeight: 1.7,
                      letterSpacing: '0.12em',
                      color: colors.textFaint,
                    }}
                  >
                    {item.number}
                  </span>

                  <div style={{ minWidth: 0 }}>
                    <h3 style={cardTitleStyle}>{item.title}</h3>
                    <p style={cardTextStyle}>{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="inquiry-information-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Inquiry information · 문의 준비사항</p>

            <h2
              id="inquiry-information-title"
              style={sectionTitleStyle}
            >
              광고·제휴 문의 시 어떤 정보를 보내야 하나요?
            </h2>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '32px',
              }}
            >
              아래 정보를 함께 보내주시면 협업 적합성과 제작 범위를 더
              정확하게 검토할 수 있습니다. 아직 확정되지 않은 항목은
              예상 범위로 작성해도 됩니다.
            </p>

            <ul
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1px',
                margin: 0,
                padding: 0,
                listStyle: 'none',
                border: `0.5px solid ${colors.line}`,
                background: colors.line,
              }}
            >
              {inquiryItems.map((item, index) => (
                <li
                  key={item}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '28px minmax(0, 1fr)',
                    gap: '12px',
                    minWidth: 0,
                    padding: '20px',
                    background: colors.background,
                    fontFamily: bodyFont,
                    fontSize: '14px',
                    lineHeight: 1.75,
                    letterSpacing: '-0.01em',
                    color: colors.textNormal,
                    wordBreak: 'keep-all',
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: monoFont,
                      fontSize: '9px',
                      color: colors.textFaint,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="unavailable-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Unavailable · 진행하지 않는 광고</p>

            <h2 id="unavailable-title" style={sectionTitleStyle}>
              PAGEONEWORKS가 진행하지 않는 광고는 무엇인가요?
            </h2>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '30px',
              }}
            >
              독자를 오인하게 하거나 사실 확인이 어렵고 관련 법률,
              권리 또는 플랫폼 정책을 위반할 가능성이 있는 광고는
              진행하지 않습니다.
            </p>

            <div
              style={{
                padding: 'clamp(24px, 5vw, 34px)',
                border: `0.5px solid ${colors.line}`,
                background: colors.panel,
              }}
            >
              <ul
                style={{
                  display: 'grid',
                  gap: '14px',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                }}
              >
                {unavailableItems.map((item) => (
                  <li
                    key={item}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '12px minmax(0, 1fr)',
                      gap: '12px',
                      minWidth: 0,
                      fontFamily: bodyFont,
                      fontSize: '14px',
                      lineHeight: 1.75,
                      letterSpacing: '-0.01em',
                      color: colors.textNormal,
                      wordBreak: 'keep-all',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        color: colors.accent,
                      }}
                    >
                      ·
                    </span>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section
            id="faq"
            aria-labelledby="faq-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>FAQ · 자주 묻는 질문</p>

            <h2 id="faq-title" style={sectionTitleStyle}>
              광고·제휴에 대해 자주 묻는 질문
            </h2>

            <p
              style={{
                ...paragraphStyle,
                marginBottom: '28px',
              }}
            >
              협업 가능한 콘텐츠, 광고 표시, 제작 방식, 비용과 사용
              범위를 질문과 답변 형식으로 정리했습니다.
            </p>

            <div
              style={{
                borderTop: `0.5px solid ${colors.lineStrong}`,
              }}
            >
              {faqItems.map((item, index) => (
                <details
                  key={item.question}
                  style={{
                    borderBottom: `0.5px solid ${colors.line}`,
                  }}
                >
                  <summary
                    style={{
                      minHeight: '68px',
                      boxSizing: 'border-box',
                      padding: '22px 4px',
                      cursor: 'pointer',
                      fontFamily: bodyFont,
                      fontSize: '15px',
                      lineHeight: 1.65,
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      color: colors.textStrong,
                      wordBreak: 'keep-all',
                      overflowWrap: 'break-word',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        marginRight: '10px',
                        fontFamily: monoFont,
                        fontSize: '9px',
                        lineHeight: 1.5,
                        letterSpacing: '0.08em',
                        color: colors.textFaint,
                      }}
                    >
                      Q{String(index + 1).padStart(2, '0')}
                    </span>

                    {item.question}
                  </summary>

                  <div
                    style={{
                      padding: '0 4px 28px',
                    }}
                  >
                    <p
                      style={{
                        ...paragraphStyle,
                        maxWidth: '850px',
                        marginBottom: 0,
                        paddingLeft: '34px',
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="contact-title"
            style={{
              ...sectionStyle,
              paddingBottom: 0,
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                padding: 'clamp(28px, 7vw, 48px)',
                border: `0.5px solid ${colors.lineStrong}`,
                background: colors.panelStrong,
              }}
            >
              <p style={eyebrowStyle}>Contact · 광고·제휴 문의</p>

              <h2
                id="contact-title"
                style={{
                  ...sectionTitleStyle,
                  marginBottom: '18px',
                }}
              >
                PAGEONEWORKS와 협업을 제안해 주세요
              </h2>

              <p
                style={{
                  ...paragraphStyle,
                  marginBottom: '28px',
                }}
              >
                브랜드와 독자 모두에게 의미 있는 콘텐츠, 인터뷰,
                캠페인과 파트너십을 검토합니다. 문의 내용을 확인한 뒤
                협업 가능 여부와 필요한 추가 정보를 안내드립니다.
              </p>

              <a
                href={mailtoHref}
                aria-label={`${siteConfig.name} 광고·제휴 이메일 문의`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '380px',
                  minHeight: '50px',
                  boxSizing: 'border-box',
                  padding: '14px 20px',
                  border: `1px solid ${colors.accent}`,
                  background: colors.accent,
                  fontFamily: bodyFont,
                  fontSize: '14px',
                  lineHeight: 1.4,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#0a0a0a',
                  wordBreak: 'keep-all',
                }}
              >
                광고·제휴 이메일 문의
              </a>

              <p
                style={{
                  margin: '18px 0 0',
                  fontFamily: monoFont,
                  fontSize: '11px',
                  lineHeight: 1.8,
                  color: colors.textMuted,
                  overflowWrap: 'anywhere',
                }}
              >
                {siteConfig.email}
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}