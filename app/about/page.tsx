import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { siteConfig, absoluteUrl } from '@/lib/site.config';

const ABOUT_URL = absoluteUrl('/about');
const ABOUT_PAGE_ID = `${ABOUT_URL}#aboutpage`;
const BREADCRUMB_ID = `${ABOUT_URL}#breadcrumb`;
const FAQ_ID = `${ABOUT_URL}#faq`;

const LAST_UPDATED_DISPLAY = '2026.06.30';
const LAST_UPDATED_ISO = '2026-06-30';

const ABOUT_TITLE =
  `PAGEONEWORKS 소개 | 팩트 기반 프리미엄 라이프스타일 매거진`;

const ABOUT_DESCRIPTION =
  'PAGEONEWORKS는 부동산·의료·안티에이징·법률·세무·미식·여행·교육을 다루는 독립 프리미엄 라이프스타일 매거진입니다. 출처와 기준일을 확인한 콘텐츠를 질문 중심으로 제공합니다.';

const categoryItems = [
  {
    name: '부동산',
    description:
      '주거·매매·투자·개발·공간 선택에 필요한 시장 정보와 확인 기준을 다룹니다.',
  },
  {
    name: '의료',
    description:
      '병원과 의료 서비스를 선택하기 전에 확인해야 할 일반 정보, 절차와 주의사항을 설명합니다.',
  },
  {
    name: '안티에이징',
    description:
      '건강관리·뷰티·시술·라이프케어 분야의 원리와 선택 기준을 정리합니다.',
  },
  {
    name: '법률',
    description:
      '일상과 사업에서 접할 수 있는 법률 문제의 개념, 절차와 확인사항을 안내합니다.',
  },
  {
    name: '세무',
    description:
      '개인과 사업자가 알아야 할 세금, 신고, 비용과 재무 구조를 이해하기 쉽게 설명합니다.',
  },
  {
    name: '미식',
    description:
      '음식만이 아니라 재료, 공간, 사람과 지역 문화가 만드는 경험을 기록합니다.',
  },
  {
    name: '여행',
    description:
      '장소의 맥락과 동선, 비용, 체류 방식까지 실제 선택에 필요한 정보를 제공합니다.',
  },
  {
    name: '교육',
    description:
      '진학·학습·역량 개발·교육 환경의 변화를 독자의 관점에서 분석합니다.',
  },
];

const summaryItems = [
  {
    label: '정체성',
    value: '독립 프리미엄 라이프스타일 매거진',
  },
  {
    label: '콘텐츠',
    value: '8개 분야의 팩트 기반 가이드와 분석',
  },
  {
    label: '편집 방식',
    value: '질문·직접 답변·비교·주의사항·출처',
  },
  {
    label: '운영 원칙',
    value: '광고와 편집 콘텐츠의 명확한 구분',
  },
];

const editorialItems = [
  {
    title: '질문에 먼저 답합니다',
    description:
      '불필요한 서론으로 답을 미루지 않습니다. 독자가 가장 궁금해하는 내용을 첫 문단에서 직접 설명하고, 필요한 근거와 예외를 뒤에서 보완합니다.',
  },
  {
    title: '사실과 의견을 구분합니다',
    description:
      '확인된 사실, 일반적인 해석, 편집자의 관점을 같은 문장 안에 섞지 않습니다. 변경 가능한 정보에는 기준일과 조건을 함께 표시합니다.',
  },
  {
    title: '출처를 확인합니다',
    description:
      '법령, 공공기관, 공식 문서, 학술자료, 기업의 원문처럼 확인 가능한 자료를 우선합니다. 확인되지 않은 통계와 과장된 숫자는 사용하지 않습니다.',
  },
  {
    title: '광고를 기사처럼 위장하지 않습니다',
    description:
      '협찬·광고·제휴가 있는 콘텐츠는 독자가 알아볼 수 있도록 구분합니다. 편집 콘텐츠의 판단과 광고주의 이해관계를 분리합니다.',
  },
  {
    title: '수정과 정정을 공개합니다',
    description:
      '정책·법령·가격·서비스처럼 변경될 수 있는 내용은 다시 확인합니다. 핵심 내용이 바뀌면 수정일을 갱신하고 잘못된 정보는 정정합니다.',
  },
  {
    title: '결과를 보장하지 않습니다',
    description:
      '검색 순위, AI 인용, 의료 결과, 법률 결과, 투자 수익처럼 통제할 수 없는 결과를 보장하거나 확정적으로 표현하지 않습니다.',
  },
];

const optimizationItems = [
  {
    term: 'SEO',
    title: '검색엔진이 발견할 수 있는 구조',
    description:
      '명확한 제목, 하나의 H1, 논리적인 H2·H3, canonical, 내부 링크와 구조화 데이터를 사용해 페이지의 주제와 대표 URL을 분명하게 만듭니다.',
  },
  {
    term: 'AEO',
    title: '질문에 직접 답하는 구조',
    description:
      '실제 독자가 사용하는 질문을 기준으로 답변을 구성합니다. 첫 문단의 직접 답변, 정의, 비교, 절차, 주의사항과 FAQ를 분리해 제공합니다.',
  },
  {
    term: 'GEO',
    title: '생성형 AI가 요약하기 쉬운 구조',
    description:
      '한 문단에 하나의 주장만 담고, 주어와 대상을 명확하게 씁니다. 표, 단계, 기준일, 출처와 한계를 함께 제공해 문맥의 오해를 줄입니다.',
  },
  {
    term: 'LLMEO',
    title: '브랜드와 콘텐츠 Entity의 일관성',
    description:
      'PAGEONEWORKS의 명칭, 운영 주체, 카테고리, 공식 URL과 발행자 정보를 일관되게 관리해 언어모델이 서로 다른 대상을 혼동하지 않도록 합니다.',
  },
];

const processItems = [
  {
    step: '01',
    title: '독자의 질문을 정의합니다',
    description:
      '누가 무엇을 궁금해하는지, 어떤 결정을 앞두고 있는지, 한 페이지에서 해결해야 할 검색 의도가 무엇인지 먼저 정합니다.',
  },
  {
    step: '02',
    title: '원문과 근거를 확인합니다',
    description:
      '공식 문서와 1차 출처를 우선 확인하고, 숫자·날짜·적용 범위와 변경 가능성을 검토합니다.',
  },
  {
    step: '03',
    title: '답변 중심으로 구조화합니다',
    description:
      '직접 답변, 판단 기준, 비교, 실행 방법, 주의사항, FAQ 순서로 독자가 필요한 부분을 빠르게 찾을 수 있도록 작성합니다.',
  },
  {
    step: '04',
    title: '발행 후에도 갱신합니다',
    description:
      '오래된 정보, 깨진 링크, 변경된 정책과 독자의 추가 질문을 확인해 콘텐츠를 보완합니다.',
  },
];

const faqItems = [
  {
    question: 'PAGEONEWORKS는 어떤 매거진인가요?',
    answer:
      'PAGEONEWORKS는 부동산·의료·안티에이징·법률·세무·미식·여행·교육을 다루는 독립 프리미엄 라이프스타일 매거진입니다. 단순한 유행 소개보다 독자가 실제 선택과 판단에 활용할 수 있는 조건, 절차, 비교 기준, 주의사항과 출처를 함께 제공합니다.',
  },
  {
    question: 'PAGEONEWORKS는 어떤 독자를 위해 콘텐츠를 만드나요?',
    answer:
      '집이나 서비스를 선택하고, 병원·법률·세무 정보를 확인하고, 여행·교육·미식에 시간과 비용을 쓰기 전에 신뢰할 수 있는 판단 기준이 필요한 독자를 위해 만듭니다. 전문용어는 필요한 범위에서 설명하고 핵심 답변은 먼저 제시합니다.',
  },
  {
    question: '기사와 광고 콘텐츠는 어떻게 구분하나요?',
    answer:
      '광고, 협찬 또는 제휴 관계가 있는 콘텐츠는 독자가 확인할 수 있도록 표시하는 것을 원칙으로 합니다. 광고주의 요청이 기사 내용과 편집 판단을 대신하지 않으며, 일반 편집 콘텐츠를 광고처럼 작성하거나 광고를 독립 기사처럼 위장하지 않습니다.',
  },
  {
    question: '콘텐츠의 사실과 출처는 어떻게 확인하나요?',
    answer:
      '법령, 정부·공공기관 자료, 공식 플랫폼 문서, 학술자료, 기업 공시와 원문 자료를 우선 확인합니다. 출처가 확인되지 않는 통계나 과장된 수치는 사용하지 않으며, 변경될 수 있는 정보에는 기준일과 적용 조건을 함께 설명합니다.',
  },
  {
    question: 'SEO·AEO·GEO·LLMEO는 콘텐츠에 어떻게 적용되나요?',
    answer:
      '검색엔진이 페이지를 발견하고 이해할 수 있는 기술 구조, 질문에 직접 답하는 문장, 생성형 AI가 문맥을 요약하기 쉬운 섹션, 일관된 브랜드와 발행자 정보를 함께 적용합니다. 다만 이러한 구성은 검색 순위나 AI 답변 인용을 보장하는 방법이 아니라 정확한 이해 가능성을 높이기 위한 정보 설계입니다.',
  },
  {
    question: '의료·법률·세무 콘텐츠는 개인을 위한 전문 자문인가요?',
    answer:
      '아닙니다. PAGEONEWORKS의 의료·법률·세무 콘텐츠는 일반적인 정보와 판단 기준을 제공하기 위한 편집 콘텐츠입니다. 개인의 건강 상태, 계약 관계, 관할, 소득과 사업 구조에 따라 결론이 달라질 수 있으므로 중요한 결정은 해당 분야의 자격 있는 전문가에게 확인해야 합니다.',
  },
  {
    question: '잘못된 정보나 수정이 필요한 내용을 발견하면 어떻게 하나요?',
    answer: `기사 제목, 해당 URL, 수정이 필요하다고 판단한 이유와 확인 가능한 근거를 ${siteConfig.email}로 보내주시면 검토합니다. 오류가 확인되거나 핵심 정보가 변경된 경우 해당 콘텐츠의 내용과 수정일을 갱신합니다.`,
  },
];

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: [
    'PAGEONEWORKS',
    '페이지원웍스',
    '페이지원웍스 매거진',
    '프리미엄 라이프스타일 매거진',
    '독립 웹매거진',
    '팩트 기반 콘텐츠',
    '부동산 매거진',
    '의료 정보 콘텐츠',
    '법률 세무 콘텐츠',
    '미식 여행 교육',
    'SEO 콘텐츠',
    'AEO',
    'GEO',
    'LLMEO',
    'AI 검색 최적화',
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
    canonical: ABOUT_URL,
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: ABOUT_URL,
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteUrl(siteConfig.ogImagePath),
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} 소개`,
      },
    ],
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: [absoluteUrl(siteConfig.ogImagePath)],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': ABOUT_PAGE_ID,
      url: ABOUT_URL,
      name: ABOUT_TITLE,
      description: ABOUT_DESCRIPTION,
      inLanguage: siteConfig.locale.replace('_', '-'),
      dateModified: LAST_UPDATED_ISO,
      mainEntity: {
        '@id': siteConfig.publisherId,
      },
      publisher: {
        '@id': siteConfig.publisherId,
      },
      about: categoryItems.map((item) => ({
        '@type': 'Thing',
        name: item.name,
        description: item.description,
      })),
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
          name: '소개',
          item: ABOUT_URL,
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': FAQ_ID,
      url: `${ABOUT_URL}#faq`,
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
  textNormal: 'rgba(245,242,237,0.72)',
  textMuted: 'rgba(245,242,237,0.48)',
  textFaint: 'rgba(245,242,237,0.34)',
  line: 'rgba(245,242,237,0.11)',
  lineStrong: 'rgba(245,242,237,0.18)',
  panel: 'rgba(245,242,237,0.035)',
  panelStrong: 'rgba(245,242,237,0.055)',
};

const bodyFont =
  '"Pretendard", "Noto Sans KR", "Apple SD Gothic Neo", Arial, sans-serif';

const serifFont =
  'var(--font-cormorant), "Noto Serif KR", Georgia, serif';

const monoFont =
  'var(--font-space-mono), "SFMono-Regular", Consolas, monospace';

const sectionStyle: CSSProperties = {
  borderTop: `0.5px solid ${colors.line}`,
  padding: 'clamp(44px, 7vw, 72px) 0',
};

const eyebrowStyle: CSSProperties = {
  margin: '0 0 16px',
  fontFamily: monoFont,
  fontSize: '10px',
  lineHeight: 1.6,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: colors.textFaint,
};

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 24px',
  fontFamily: serifFont,
  fontSize: 'clamp(1.75rem, 4vw, 2.45rem)',
  lineHeight: 1.35,
  fontWeight: 300,
  letterSpacing: '-0.02em',
  color: colors.textStrong,
  wordBreak: 'keep-all',
};

const leadStyle: CSSProperties = {
  margin: '0',
  maxWidth: '780px',
  fontFamily: serifFont,
  fontSize: 'clamp(1.25rem, 3vw, 1.7rem)',
  lineHeight: 1.8,
  fontWeight: 300,
  letterSpacing: '-0.015em',
  color: colors.textStrong,
  wordBreak: 'keep-all',
  overflowWrap: 'break-word',
};

const paragraphStyle: CSSProperties = {
  margin: '0 0 20px',
  maxWidth: '780px',
  fontFamily: bodyFont,
  fontSize: '15px',
  lineHeight: 1.95,
  letterSpacing: '-0.01em',
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

export default function AboutPage() {
  const companyItems = [
    {
      label: '설립',
      value: siteConfig.foundingDate,
    },
    {
      label: '대표',
      value: siteConfig.representative,
    },
    {
      label: '사업자번호',
      value: siteConfig.businessNumber,
    },
    {
      label: '주소',
      value: siteConfig.address.display,
    },
    {
      label: '이메일',
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
    },
    {
      label: '카테고리',
      value: '부동산·의료·안티에이징·법률·세무·미식·여행·교육',
    },
  ];

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
          background: colors.background,
          paddingTop: 'clamp(100px, 12vw, 140px)',
          paddingBottom: '120px',
        }}
      >
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto',
            padding: '0 clamp(20px, 5vw, 32px)',
          }}
        >
          <header style={{ paddingBottom: 'clamp(48px, 8vw, 80px)' }}>
            <p style={eyebrowStyle}>About · 소개</p>

            <h1
              style={{
                margin: '0 0 22px',
                fontFamily: serifFont,
                fontSize: 'clamp(2.5rem, 8vw, 4.7rem)',
                lineHeight: 1.04,
                fontWeight: 300,
                letterSpacing: '-0.035em',
                color: colors.text,
              }}
            >
              PAGEONEWORKS
            </h1>

            <p
              style={{
                margin: 0,
                fontFamily: monoFont,
                fontSize: '10px',
                lineHeight: 1.7,
                letterSpacing: '0.12em',
                color: colors.textFaint,
              }}
            >
              FACT-BASED PREMIUM LIFESTYLE MAGAZINE · UPDATED{' '}
              {LAST_UPDATED_DISPLAY}
            </p>
          </header>

          <section
            aria-labelledby="about-summary-title"
            style={{
              ...sectionStyle,
              paddingTop: 'clamp(40px, 6vw, 64px)',
            }}
          >
            <p style={eyebrowStyle}>Direct answer · 핵심 답변</p>

            <h2
              id="about-summary-title"
              style={{
                ...leadStyle,
                marginBottom: '30px',
              }}
            >
              PAGEONEWORKS는 삶의 중요한 선택에 필요한 정보와 판단
              기준을 제공하는 독립 프리미엄 라이프스타일 매거진입니다.
            </h2>

            <p style={paragraphStyle}>
              부동산, 의료, 안티에이징, 법률, 세무, 미식, 여행, 교육을
              다루며 독자가 무엇을 선택해야 하는지 판단할 수 있도록{' '}
              <strong style={{ color: colors.textStrong, fontWeight: 600 }}>
                사실, 조건, 절차, 비교 기준, 주의사항과 출처
              </strong>
              를 함께 제공합니다.
            </p>

            <p style={{ ...paragraphStyle, marginBottom: '38px' }}>
              단순한 유행 소개나 광고 문구를 반복하기보다 질문에 먼저
              답하고, 그 답을 이해하는 데 필요한 맥락과 근거를 뒤에
              배치합니다. PAGEONEWORKS의 목표는 더 많은 정보를 쌓는 것이
              아니라 독자가 더 나은 결정을 내릴 수 있도록 정보를
              정리하는 것입니다.
            </p>

            <div
              aria-label="PAGEONEWORKS 핵심 요약"
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '1px',
                background: colors.line,
                border: `0.5px solid ${colors.line}`,
              }}
            >
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    minHeight: '132px',
                    padding: '24px',
                    background: colors.background,
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 12px',
                      fontFamily: monoFont,
                      fontSize: '9px',
                      lineHeight: 1.5,
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
                      color: colors.textNormal,
                      wordBreak: 'keep-all',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="identity-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Identity · 정체성</p>

            <h2 id="identity-title" style={sectionTitleStyle}>
              독자가 판단할 수 있도록 정보를 편집합니다
            </h2>

            <p style={paragraphStyle}>
              인터넷에는 정보가 많지만, 실제 결정에 필요한 조건과
              예외까지 설명하는 콘텐츠는 많지 않습니다. 제목에서는
              확신을 말하지만 본문에는 근거가 없거나, 광고와 정보의
              경계가 분명하지 않은 경우도 있습니다.
            </p>

            <p style={paragraphStyle}>
              PAGEONEWORKS는 독자가 처음부터 끝까지 읽지 않아도 필요한
              답을 찾을 수 있도록 콘텐츠를 구성합니다. 핵심 답변은
              상단에 배치하고, 그다음에 개념, 조건, 비교, 절차,
              주의사항과 출처를 제공합니다.
            </p>

            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              중요한 것은 어려운 전문용어를 많이 사용하는 것이 아니라,
              복잡한 정보를 정확한 문장과 읽기 쉬운 구조로 바꾸는
              것입니다. 이것이 PAGEONEWORKS가 생각하는 프리미엄
              콘텐츠의 기준입니다.
            </p>
          </section>

          <section
            aria-labelledby="categories-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Editorial categories · 주요 분야</p>

            <h2 id="categories-title" style={sectionTitleStyle}>
              삶과 사업의 중요한 선택을 다루는 8개 분야
            </h2>

            <p style={{ ...paragraphStyle, marginBottom: '38px' }}>
              각 분야를 서로 분리된 정보로만 보지 않습니다. 주거와
              자산, 건강과 안티에이징, 법률과 세무, 여행과 미식,
              교육과 역량은 실제 생활 안에서 서로 연결되기 때문입니다.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '14px',
              }}
            >
              {categoryItems.map((item, index) => (
                <article
                  key={item.name}
                  style={{
                    minHeight: '196px',
                    padding: '24px',
                    border: `0.5px solid ${colors.line}`,
                    background:
                      index % 2 === 0
                        ? colors.panel
                        : colors.background,
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 20px',
                      fontFamily: monoFont,
                      fontSize: '9px',
                      letterSpacing: '0.16em',
                      color: colors.textFaint,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </p>

                  <h3 style={cardTitleStyle}>{item.name}</h3>
                  <p style={cardTextStyle}>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="editorial-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Editorial principles · 편집 원칙</p>

            <h2 id="editorial-title" style={sectionTitleStyle}>
              신뢰할 수 있는 콘텐츠를 위한 여섯 가지 기준
            </h2>

            <p style={{ ...paragraphStyle, marginBottom: '38px' }}>
              PAGEONEWORKS는 검색 노출만을 목적으로 의미 없는 문장을
              늘리거나 동일한 키워드를 반복하지 않습니다. 독자가 화면에서
              확인할 수 있는 정보와 검색엔진·AI에 제공하는 구조화 데이터도
              서로 일치하도록 관리합니다.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1px',
                background: colors.line,
                border: `0.5px solid ${colors.line}`,
              }}
            >
              {editorialItems.map((item) => (
                <article
                  key={item.title}
                  style={{
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
            aria-labelledby="optimization-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>
              Search & AI readability · 검색과 AI를 위한 정보 설계
            </p>

            <h2 id="optimization-title" style={sectionTitleStyle}>
              사람에게 읽기 쉽고 검색엔진과 AI에도 이해하기 쉬운 구조
            </h2>

            <p style={paragraphStyle}>
              PAGEONEWORKS의 콘텐츠는 사람을 위한 글을 먼저 작성한 뒤,
              검색엔진과 생성형 AI가 제목, 질문, 답변, 발행자, 주제와
              출처의 관계를 정확히 이해할 수 있도록 기술 구조를
              연결합니다.
            </p>

            <p style={{ ...paragraphStyle, marginBottom: '38px' }}>
              특정 검색 순위나 AI 답변 인용을 보장하는 비밀 태그는
              존재하지 않습니다. 명확한 정보, 안정적인 URL, 일관된
              Entity, 공개된 출처와 지속적인 업데이트가 기본입니다.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '14px',
              }}
            >
              {optimizationItems.map((item) => (
                <article
                  key={item.term}
                  style={{
                    padding: '28px',
                    border: `0.5px solid ${colors.line}`,
                    background: colors.panel,
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 16px',
                      fontFamily: monoFont,
                      fontSize: '11px',
                      lineHeight: 1.5,
                      letterSpacing: '0.16em',
                      color: colors.textMuted,
                    }}
                  >
                    {item.term}
                  </p>

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
            <p style={eyebrowStyle}>Content process · 제작 과정</p>

            <h2 id="process-title" style={sectionTitleStyle}>
              하나의 콘텐츠가 만들어지는 방식
            </h2>

            <p style={{ ...paragraphStyle, marginBottom: '38px' }}>
              좋은 콘텐츠는 글을 길게 쓰는 것만으로 완성되지 않습니다.
              독자의 질문을 정확히 정의하고, 근거를 확인하고, 답변을
              구조화하고, 발행 후에도 다시 검토해야 합니다.
            </p>

            <div>
              {processItems.map((item) => (
                <article
                  key={item.step}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '52px minmax(0, 1fr)',
                    gap: '20px',
                    padding: '28px 0',
                    borderTop: `0.5px solid ${colors.line}`,
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontFamily: monoFont,
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      color: colors.textFaint,
                    }}
                  >
                    {item.step}
                  </p>

                  <div>
                    <h3 style={cardTitleStyle}>{item.title}</h3>
                    <p style={cardTextStyle}>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="responsibility-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Scope & responsibility · 정보의 범위</p>

            <h2 id="responsibility-title" style={sectionTitleStyle}>
              정보는 판단을 돕지만 개인의 결정을 대신하지 않습니다
            </h2>

            <p style={paragraphStyle}>
              PAGEONEWORKS의 콘텐츠는 일반적인 정보와 비교 기준을
              제공합니다. 의료 상태, 법률 관계, 세무 구조, 투자 조건처럼
              개인별 상황에 따라 결과가 달라지는 분야에서는 하나의
              콘텐츠만으로 결론을 확정해서는 안 됩니다.
            </p>

            <p style={{ ...paragraphStyle, marginBottom: 0 }}>
              중요한 의료·법률·세무·재무 결정을 앞두고 있다면 해당
              분야의 자격 있는 전문가와 개별 상황을 확인해야 합니다.
              PAGEONEWORKS는 정보를 더 쉽게 이해할 수 있도록 돕지만,
              진단·처방·법률 자문·세무 대리 또는 수익 보장을 제공하지
              않습니다.
            </p>
          </section>

          <section
            aria-labelledby="company-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>Publisher information · 운영 정보</p>

            <h2 id="company-title" style={sectionTitleStyle}>
              PAGEONEWORKS 발행자 정보
            </h2>

            <p style={{ ...paragraphStyle, marginBottom: '38px' }}>
              브랜드와 발행 주체를 명확히 공개하고, 사이트의 회사 정보,
              메타데이터와 구조화 데이터가 동일한 정보를 사용하도록
              관리합니다.
            </p>

            <dl
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '1px',
                margin: 0,
                background: colors.line,
                border: `0.5px solid ${colors.line}`,
              }}
            >
              {companyItems.map((item) => (
                <div
                  key={item.label}
                  style={{
                    minHeight: '126px',
                    padding: '24px',
                    background: colors.background,
                  }}
                >
                  <dt
                    style={{
                      margin: '0 0 10px',
                      fontFamily: monoFont,
                      fontSize: '9px',
                      lineHeight: 1.5,
                      letterSpacing: '0.14em',
                      color: colors.textFaint,
                    }}
                  >
                    {item.label}
                  </dt>

                  <dd
                    style={{
                      margin: 0,
                      fontFamily: bodyFont,
                      fontSize: '13px',
                      lineHeight: 1.75,
                      color: colors.textNormal,
                      wordBreak: 'keep-all',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        style={{
                          color: 'inherit',
                          textDecorationColor: colors.lineStrong,
                          textUnderlineOffset: '4px',
                        }}
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section
            id="faq"
            aria-labelledby="faq-title"
            style={sectionStyle}
          >
            <p style={eyebrowStyle}>FAQ · 자주 묻는 질문</p>

            <h2 id="faq-title" style={sectionTitleStyle}>
              PAGEONEWORKS에 대해 자주 묻는 질문
            </h2>

            <p style={{ ...paragraphStyle, marginBottom: '28px' }}>
              매거진의 정체성, 콘텐츠 검증 방식, 광고 구분과 검색·AI
              최적화 원칙을 질문과 답변 형식으로 정리했습니다.
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
                      minHeight: '72px',
                      padding: '22px 4px',
                      cursor: 'pointer',
                      fontFamily: bodyFont,
                      fontSize: '15px',
                      lineHeight: 1.65,
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      color: colors.textStrong,
                      wordBreak: 'keep-all',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        marginRight: '12px',
                        fontFamily: monoFont,
                        fontSize: '10px',
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
                        marginBottom: 0,
                        paddingLeft: '38px',
                        maxWidth: '820px',
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>

          <footer
            style={{
              borderTop: `0.5px solid ${colors.line}`,
              paddingTop: '36px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: monoFont,
                fontSize: '9px',
                lineHeight: 1.8,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: colors.textFaint,
              }}
            >
              PAGEONEWORKS · INDEPENDENT PREMIUM LIFESTYLE MAGAZINE
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}