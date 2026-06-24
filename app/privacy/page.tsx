import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/lib/site.config';

export const metadata: Metadata = {
  title: '개인정보처리방침 | PAGEONEWORKS',
  description:
    'PAGEONEWORKS 개인정보처리방침. 수집 항목, 이용 목적, 보유 기간, 위탁, 이용자 권리 및 안전성 확보 조치를 안내합니다.',
  alternates: { canonical: 'https://www.pageoneworks.com/privacy' },
  openGraph: {
    title: '개인정보처리방침 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 개인정보처리방침.',
    url: 'https://www.pageoneworks.com/privacy',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '개인정보처리방침 | PAGEONEWORKS',
    description: 'PAGEONEWORKS 개인정보처리방침.',
  },
};

const EFFECTIVE_DATE = '2026년 1월 1일';
const GOLD = '#C9A96E';

const sections: { id: string; title: string; body: string }[] = [
  {
    id: 'purpose',
    title: '1. 개인정보 처리 목적',
    body:
      'PAGEONEWORKS(이하 "사이트")는 다음 목적을 위해 개인정보를 처리합니다. 처리한 개인정보는 아래 목적 이외의 용도로는 이용하지 않으며, 목적이 변경되는 경우 관련 법령에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.\n· 회원 식별 및 소셜 로그인 기반 서비스 제공\n· 콘텐츠·커뮤니티 기능(게시글, 댓글, 프로필) 운영\n· 상담 신청 시 신청 내용 확인, 문의 검토, 상담 일정 안내 및 연락\n· 고객 문의 응대 및 불만 처리\n· 서비스 운영·개선 및 통계 분석',
  },
  {
    id: 'items',
    title: '2. 처리하는 개인정보 항목',
    body:
      '사이트는 서비스 이용 과정에서 아래 항목을 처리할 수 있습니다.\n\n[회원/로그인]\n· 필수: 이메일 주소, 닉네임 또는 이름, 소셜 로그인(Google·Kakao) 제공 프로필 정보\n· 선택: 프로필 이미지\n\n[상담예약 신청]\n· 필수: 이름, 회사명 또는 기관명, 연락처, 업종\n· 선택: 필요한 도움, 연락받기 좋은 시간, 웹사이트 주소, 문의 내용, 광고성 정보 수신 동의 여부\n\n[AI Q&A 등 문의]\n· 이용자가 입력한 질문 내용\n\n[자동 생성·수집]\n· 서비스 이용 과정에서 생성되는 접속 기록 및 로그인 세션 정보, 쿠키\n\n※ 콘텐츠 조회수 집계는 글(URL) 단위의 집계 수치만 처리하며, 이를 특정 개인과 연결하여 식별하지 않습니다.',
  },
  {
    id: 'retention',
    title: '3. 개인정보 처리 및 보유 기간',
    body:
      '사이트는 개인정보의 수집·이용 목적이 달성되면 해당 정보를 지체 없이 파기합니다. 다만 관계 법령에서 보존을 요구하는 경우 해당 기간 동안 안전하게 보관합니다.\n· 회원 정보: 회원 탈퇴 시까지(탈퇴 시 지체 없이 파기, 법령상 보존 의무가 있는 항목은 제외)\n· 상담 신청 정보: 상담 목적 달성 후 지체 없이 파기\n· 문의 기록: 처리 완료 후 관련 법령이 정한 기간\n· 관계 법령에 따른 보존이 필요한 경우: 해당 법령에서 정한 기간',
  },
  {
    id: 'third-party',
    title: '4. 개인정보 제3자 제공 여부',
    body:
      '사이트는 이용자의 개인정보를 본 방침에 명시한 범위를 넘어 제3자에게 제공하지 않습니다. 다만 다음의 경우에는 예외로 합니다.\n· 이용자가 사전에 동의한 경우\n· 법령에 특별한 규정이 있거나 수사기관이 적법한 절차에 따라 요청하는 경우',
  },
  {
    id: 'consignment',
    title: '5. 개인정보 처리업무 위탁 여부',
    body:
      '사이트는 서비스 운영을 위해 다음과 같은 외부 서비스를 이용합니다. 각 서비스는 회원 인증, 데이터 저장 등 서비스 제공에 필요한 범위에서 정보를 처리합니다.\n· 인증·데이터베이스·스토리지 인프라(Supabase)\n· 소셜 로그인 제공자(Google, Kakao)\n\n※ 본 방침은 초안이며, 상담예약 전송 기능 및 추가 외부 저장소 연결 시 위탁 대상·범위·수탁자를 구체적으로 명시하여 갱신합니다.',
  },
  {
    id: 'oversea',
    title: '6. 국외 이전 여부',
    body:
      '사이트가 이용하는 일부 클라우드 인프라(인증·데이터베이스 등) 및 소셜 로그인 제공자는 국외에 서버를 둘 수 있습니다. 정확한 국외 이전 항목·국가·이전 방법·보유 기간 등은 서비스 정식 운영 및 상담예약 전송 기능 연결 시점에 확정하여 본 방침에 반영합니다. 국외 이전이 발생하는 경우 관련 법령에 따라 필요한 고지 및 동의 절차를 이행합니다.',
  },
  {
    id: 'destruction',
    title: '7. 개인정보 파기 절차와 방법',
    body:
      '· 파기 절차: 보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.\n· 파기 방법: 전자적 파일 형태의 정보는 복구·재생이 불가능한 방법으로 삭제하며, 출력물 등은 분쇄하거나 소각합니다.',
  },
  {
    id: 'rights',
    title: '8. 정보주체의 권리와 행사 방법',
    body:
      '이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 권리 행사는 아래 연락처로 요청할 수 있으며, 사이트는 관계 법령이 정한 기간 내에 지체 없이 조치합니다. 동의를 거부할 권리가 있으며, 필수 항목에 대한 동의를 거부할 경우 해당 서비스(예: 상담예약)의 이용이 제한될 수 있습니다.',
  },
  {
    id: 'safety',
    title: '9. 안전성 확보 조치',
    body:
      '사이트는 개인정보의 안전성 확보를 위해 합리적인 범위에서 다음과 같은 조치를 시행합니다.\n· 개인정보 접근 권한의 최소화 및 관리\n· 인증·데이터 저장 인프라의 접근 통제\n· 전송 구간 암호화(HTTPS) 적용\n· 처리 현황 점검 및 개선',
  },
  {
    id: 'cookies',
    title: '10. 자동 수집 장치(쿠키)와 거부 방법',
    body:
      '사이트는 로그인 세션 유지 및 서비스 제공을 위해 쿠키를 사용할 수 있습니다. 이용자는 웹 브라우저의 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 쿠키 저장을 거부할 경우 로그인 등 일부 서비스 이용에 제한이 있을 수 있습니다. 현재 사이트는 광고 식별·행태정보 수집을 위한 별도의 분석·광고 도구를 사용하지 않습니다.',
  },
  {
    id: 'contact',
    title: '11. 개인정보 보호 담당부서와 연락처',
    body:
      `개인정보 처리에 관한 문의, 불만 처리, 권리 행사는 아래로 연락해 주시기 바랍니다.\n· 운영: ${siteConfig.name} (${siteConfig.operatorDisplayName})\n· 대표자: ${siteConfig.representative}\n· 사업자등록번호: ${siteConfig.businessNumber}\n· 주소: ${siteConfig.address.display}\n· 이메일: ${siteConfig.email}\n· 전화: ${siteConfig.phone.display}\n\n※ 별도의 개인정보 보호책임자 지정 정보는 서비스 정식 운영 시 확정하여 본 방침에 반영합니다.`,
  },
  {
    id: 'remedy',
    title: '12. 권익침해 구제 방법',
    body:
      '개인정보 침해로 인한 상담 및 분쟁 조정이 필요한 경우 아래 기관에 도움을 요청할 수 있습니다.\n· 개인정보분쟁조정위원회 (kopico.go.kr / 1833-6972)\n· 개인정보침해신고센터 (privacy.kisa.or.kr / 118)\n· 대검찰청 사이버수사과 (spo.go.kr / 1301)\n· 경찰청 사이버수사국 (ecrm.police.go.kr / 182)',
  },
  {
    id: 'consult-status',
    title: '13. 상담예약 폼의 현재 상태',
    body:
      '현재 사이트의 상담예약 폼은 미리보기 단계로, 입력하신 내용은 외부 저장소로 전송되거나 저장되지 않습니다. 상담예약 정보의 실제 수집·전송 기능이 연결되는 시점에 수집 항목, 위탁, 국외 이전, 보유 기간 등을 반영하여 본 방침을 다시 안내합니다.',
  },
  {
    id: 'change',
    title: '14. 처리방침의 변경과 시행일',
    body:
      `본 개인정보처리방침은 법령·서비스의 변경에 따라 내용이 추가, 삭제 및 수정될 수 있으며, 변경 시 사이트를 통해 공지합니다.\n· 시행일: ${EFFECTIVE_DATE}`,
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0a', paddingTop: '96px', paddingBottom: '96px' }}>
      {/*
        개발 주석:
        상담예약 폼은 현재 외부 저장소로 전송·저장되지 않는 미리보기 단계다.
        향후 Google Sheets 등 외부 저장소/전송 기능을 연결하기 전에
        본 방침의 수집 항목·이용 목적·위탁·국외 이전·보유 기간을 반드시 재검토할 것.
        본 문서는 법률 초안이며 배포 전 전문가 검토가 필요하다.
      */}
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>
        {/* 헤더 */}
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.3em', color: GOLD, textTransform: 'uppercase', marginBottom: '16px' }}>
          Privacy Policy
        </p>
        <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', fontWeight: 300, color: '#f5f2ed', lineHeight: 1.2, marginBottom: '20px' }}>
          개인정보처리방침
        </h1>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', fontWeight: 300, color: 'rgba(245,242,237,0.7)', lineHeight: 1.8, maxWidth: '70ch' }}>
          PAGEONEWORKS는 이용자의 개인정보를 소중히 여기며 관련 법령을 준수합니다. 본 방침은 사이트가
          어떤 정보를, 어떤 목적으로, 어떻게 처리하는지 안내합니다.
        </p>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(245,242,237,0.4)', marginTop: '16px' }}>
          시행일 · {EFFECTIVE_DATE}
        </p>

        <div style={{ height: '1px', background: 'rgba(201,169,110,0.25)', margin: '40px 0' }} />

        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-14">
          {/* 목차 */}
          <nav aria-label="목차" className="mb-10 md:mb-0">
            {/* 모바일: 접기형 */}
            <details className="md:hidden group rounded-lg border border-white/10">
              <summary
                className="flex items-center justify-between gap-3 cursor-pointer list-none px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40 [&::-webkit-details-marker]:hidden"
                style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.18em', color: 'rgba(245,242,237,0.7)', textTransform: 'uppercase', minHeight: '48px' }}
              >
                <span>목차</span>
                <svg className="w-4 h-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <ul className="px-4 pb-4 flex flex-col gap-1">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block py-2 outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]/40" style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', color: 'rgba(245,242,237,0.6)' }}>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>

            {/* 데스크톱: 상시 노출 */}
            <ul className="hidden md:flex md:flex-col md:gap-1 md:sticky md:top-24">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="block py-1.5 outline-none transition-colors hover:text-[#C9A96E] focus-visible:text-[#C9A96E]" style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: 'rgba(245,242,237,0.5)', lineHeight: 1.5 }}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 본문 */}
          <div>
            {sections.map((section) => (
              <section key={section.id} id={section.id} style={{ marginBottom: '40px', scrollMarginTop: '96px' }}>
                <h2 style={{ fontFamily: 'var(--font-inter)', fontSize: 'clamp(1.05rem, 2.4vw, 1.25rem)', fontWeight: 600, color: '#f5f2ed', marginBottom: '14px' }}>
                  {section.title}
                </h2>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', fontWeight: 300, color: 'rgba(245,242,237,0.72)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>
                  {section.body}
                </p>
              </section>
            ))}

            <div style={{ borderTop: '1px solid rgba(245,242,237,0.1)', paddingTop: '28px', marginTop: '8px' }}>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: 'rgba(245,242,237,0.55)', lineHeight: 1.8 }}>
                함께 보기:{' '}
                <Link href="/terms" style={{ color: GOLD, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  이용약관
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
