'use client'

import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { User, LogOut, Trash2, ChevronRight, AlertTriangle } from 'lucide-react'

export default function MyPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'withdraw'>('profile')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawConfirm, setWithdrawConfirm] = useState('')
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [])

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleWithdraw = async () => {
    if (withdrawConfirm !== '탈퇴합니다') return
    setWithdrawLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch {
      showToast('오류가 발생했습니다. 고객센터에 문의해주세요.', 'error')
      setWithdrawLoading(false)
    }
  }

  const avatarUrl = user?.user_metadata?.avatar_url || null
  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '회원'
  const email = user?.email || ''
  const provider = user?.app_metadata?.provider || 'email'
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('ko-KR') : ''
  const providerLabel: Record<string, string> = { google: 'Google', kakao: '카카오', naver: '네이버', email: '이메일' }

  const s = {
    page: { minHeight: '100vh', background: '#0a0a0a', paddingTop: '80px', paddingBottom: '60px' } as React.CSSProperties,
    inner: { maxWidth: '720px', margin: '0 auto', padding: '0 20px' } as React.CSSProperties,
    pageSub: { fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', color: 'rgba(245,242,237,0.3)', textTransform: 'uppercase' as const, marginBottom: '8px' } as React.CSSProperties,
    pageTitle: { fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 400, color: '#f5f2ed', marginBottom: '40px' } as React.CSSProperties,
    card: { background: '#141414', border: '1px solid rgba(245,242,237,0.08)', padding: 'clamp(20px, 4vw, 32px)', marginBottom: '16px' } as React.CSSProperties,
    cardTitle: { fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(245,242,237,0.35)', textTransform: 'uppercase' as const, marginBottom: '20px' } as React.CSSProperties,
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid rgba(245,242,237,0.06)', gap: '12px' } as React.CSSProperties,
    rl: { fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(245,242,237,0.35)', textTransform: 'uppercase' as const, flexShrink: 0 } as React.CSSProperties,
    rv: { fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, color: 'rgba(245,242,237,0.65)', textAlign: 'right' as const } as React.CSSProperties,
    badge: { fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '0.1em', padding: '3px 10px', border: '1px solid rgba(245,242,237,0.15)', color: 'rgba(245,242,237,0.4)', textTransform: 'uppercase' as const, flexShrink: 0 } as React.CSSProperties,
    btnSub: { width: '100%', padding: '13px', background: 'rgba(245,242,237,0.05)', border: '1px solid rgba(245,242,237,0.18)', color: 'rgba(245,242,237,0.75)', fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' } as React.CSSProperties,
    btnLogout: { width: '100%', padding: '13px', background: 'transparent', border: '1px solid rgba(245,242,237,0.12)', color: 'rgba(245,242,237,0.4)', fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' } as React.CSSProperties,
    btnRed: { width: '100%', padding: '13px', background: 'transparent', border: '1px solid rgba(220,50,50,0.3)', color: 'rgba(220,80,80,0.7)', fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' } as React.CSSProperties,
  }

  if (loading) return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '0.15em', color: 'rgba(245,242,237,0.3)' }}>LOADING...</p>
      </div>
    </>
  )

  return (
    <>
      <Header />

      {/* 토스트 */}
      {toast && (
        <div style={{ position: 'fixed', top: '72px', right: '20px', zIndex: 9999, background: toast.type === 'success' ? '#1a3a1a' : '#3a1a1a', border: `1px solid ${toast.type === 'success' ? 'rgba(80,200,80,0.3)' : 'rgba(220,50,50,0.3)'}`, padding: '12px 20px', fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.1em', color: toast.type === 'success' ? 'rgba(150,240,150,0.9)' : 'rgba(240,150,150,0.9)' }}>
          {toast.msg}
        </div>
      )}

      <div style={s.page}>
        <div style={s.inner}>

          <p style={s.pageSub}>My Account</p>
          <h1 style={s.pageTitle}>마이페이지</h1>

          {/* 프로필 카드 */}
          <div style={{ ...s.card, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' as const, marginBottom: '32px' }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="프로필" style={{ width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245,242,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User style={{ width: '22px', height: '22px', color: 'rgba(245,242,237,0.3)' }} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.5rem', fontWeight: 400, color: '#f5f2ed', marginBottom: '4px', wordBreak: 'keep-all' }}>{fullName}</p>
              <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 300, color: 'rgba(245,242,237,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</p>
            </div>
            <div style={s.badge}>무료 플랜</div>
          </div>

          {/* 탭 */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(245,242,237,0.08)', marginBottom: '32px', overflowX: 'auto' as const }}>
            {(['profile', 'security', 'withdraw'] as const).map((tab) => {
              const labels = { profile: '내 정보', security: '보안 설정', withdraw: '계정 관리' }
              const active = activeTab === tab
              return (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '12px 20px', background: 'transparent', border: 'none', cursor: 'pointer', color: active ? '#f5f2ed' : 'rgba(245,242,237,0.35)', borderBottom: active ? '1px solid #f5f2ed' : '1px solid transparent', marginBottom: '-1px', whiteSpace: 'nowrap' as const }}>
                  {labels[tab]}
                </button>
              )
            })}
          </div>

          {/* 내 정보 */}
          {activeTab === 'profile' && (
            <>
              <div style={s.card}>
                <p style={s.cardTitle}>기본 정보</p>
                <div style={s.row}><span style={s.rl}>이름</span><span style={s.rv}>{fullName}</span></div>
                <div style={s.row}><span style={s.rl}>이메일</span><span style={{ ...s.rv, wordBreak: 'break-all' as const }}>{email}</span></div>
                <div style={s.row}>
                  <span style={s.rl}>가입 경로</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {provider === 'google' && (
                      <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    )}
                    <span style={s.rv}>{providerLabel[provider] || provider} 소셜 로그인</span>
                  </div>
                </div>
                <div style={{ ...s.row, borderBottom: 'none' }}><span style={s.rl}>가입일</span><span style={s.rv}>{createdAt}</span></div>
              </div>

              <div style={s.card}>
                <p style={s.cardTitle}>멤버십</p>
                <div style={s.row}><span style={s.rl}>현재 플랜</span><span style={s.rv}>무료 플랜</span></div>
                <div style={{ ...s.row, borderBottom: 'none' }}><span style={s.rl}>이용 콘텐츠</span><span style={s.rv}>전체 아티클</span></div>
                <button onClick={() => router.push('/community')} style={s.btnSub}>
                  프리미엄 구독 알아보기 <ChevronRight style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            </>
          )}

          {/* 보안 설정 */}
          {activeTab === 'security' && (
            <>
              <div style={s.card}>
                <p style={s.cardTitle}>로그인 정보</p>
                <div style={s.row}><span style={s.rl}>로그인 방식</span><span style={s.rv}>{providerLabel[provider] || provider} 소셜 로그인</span></div>
                <div style={{ ...s.row, borderBottom: 'none' }}><span style={s.rl}>비밀번호</span><span style={{ ...s.rv, fontSize: '12px' }}>{provider !== 'email' ? `${providerLabel[provider]} 계정에서 관리됩니다` : '변경 가능'}</span></div>
              </div>

              <div style={s.card}>
                <p style={s.cardTitle}>개인정보 처리방침</p>
                <div style={s.row}><span style={s.rl}>수집 항목</span><span style={{ ...s.rv, fontSize: '12px' }}>이름, 이메일, 프로필 사진</span></div>
                <div style={s.row}><span style={s.rl}>보유 기간</span><span style={s.rv}>탈퇴 시 즉시 파기</span></div>
                <div style={{ ...s.row, borderBottom: 'none' }}><span style={s.rl}>이용 목적</span><span style={{ ...s.rv, fontSize: '12px' }}>서비스 제공, 회원 식별, 고객 지원</span></div>
              </div>

              <div style={s.card}>
                <p style={s.cardTitle}>접속 정보</p>
                <div style={s.row}><span style={s.rl}>마지막 로그인</span><span style={{ ...s.rv, fontSize: '12px' }}>{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('ko-KR') : '-'}</span></div>
                <div style={{ ...s.row, borderBottom: 'none' }}><span style={s.rl}>이메일 인증</span><span style={{ ...s.rv, color: user?.email_confirmed_at ? 'rgba(100,200,100,0.8)' : 'rgba(220,100,100,0.8)' }}>{user?.email_confirmed_at ? '완료' : '미완료'}</span></div>
              </div>
            </>
          )}

          {/* 계정 관리 */}
          {activeTab === 'withdraw' && (
            <>
              <div style={s.card}>
                <p style={s.cardTitle}>로그아웃</p>
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, color: 'rgba(245,242,237,0.45)', marginBottom: '20px', lineHeight: 1.7, wordBreak: 'keep-all' }}>
                  현재 기기에서 로그아웃합니다. 언제든지 다시 로그인할 수 있습니다.
                </p>
                <button onClick={handleLogout} disabled={logoutLoading} style={s.btnLogout}>
                  <LogOut style={{ width: '14px', height: '14px' }} />
                  {logoutLoading ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>

              <div style={{ ...s.card, borderColor: 'rgba(220,50,50,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <AlertTriangle style={{ width: '14px', height: '14px', color: 'rgba(220,50,50,0.7)', flexShrink: 0 }} />
                  <p style={{ ...s.cardTitle, marginBottom: 0, color: 'rgba(220,100,100,0.55)' }}>회원 탈퇴</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  {['계정 및 개인정보가 즉시 삭제됩니다', '저장된 북마크, 댓글 등 모든 데이터가 삭제됩니다', '삭제된 데이터는 복구할 수 없습니다', '동일 이메일로 재가입은 가능합니다'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: 'rgba(220,50,50,0.5)', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>—</span>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', fontWeight: 300, color: 'rgba(245,242,237,0.4)', lineHeight: 1.6, wordBreak: 'keep-all' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setShowWithdrawModal(true)} style={s.btnRed}>
                  <Trash2 style={{ width: '14px', height: '14px' }} />
                  회원 탈퇴하기
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 탈퇴 확인 모달 */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowWithdrawModal(false); setWithdrawConfirm('') } }}>
          <div style={{ background: '#141414', border: '1px solid rgba(220,50,50,0.3)', padding: 'clamp(24px, 5vw, 40px)', width: '100%', maxWidth: '440px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <AlertTriangle style={{ width: '18px', height: '18px', color: 'rgba(220,50,50,0.8)', flexShrink: 0 }} />
              <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.4rem', fontWeight: 400, color: '#f5f2ed' }}>정말 탈퇴하시겠습니까?</p>
            </div>
            <p style={{ fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, color: 'rgba(245,242,237,0.45)', lineHeight: 1.7, marginBottom: '20px', wordBreak: 'keep-all' }}>
              확인을 위해 아래에 <strong style={{ color: 'rgba(245,242,237,0.7)', fontWeight: 500 }}>탈퇴합니다</strong> 를 입력하세요.
            </p>
            <input
              type="text"
              value={withdrawConfirm}
              onChange={(e) => setWithdrawConfirm(e.target.value)}
              placeholder="탈퇴합니다"
              style={{ width: '100%', padding: '12px 16px', background: '#0a0a0a', border: '1px solid rgba(245,242,237,0.15)', color: '#f5f2ed', fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 300, outline: 'none', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowWithdrawModal(false); setWithdrawConfirm('') }}
                style={{ flex: 1, padding: '13px', background: 'transparent', border: '1px solid rgba(245,242,237,0.15)', color: 'rgba(245,242,237,0.5)', fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: 'pointer' }}>
                취소
              </button>
              <button onClick={handleWithdraw} disabled={withdrawConfirm !== '탈퇴합니다' || withdrawLoading}
                style={{ flex: 1, padding: '13px', background: withdrawConfirm === '탈퇴합니다' ? 'rgba(180,30,30,0.4)' : 'transparent', border: `1px solid ${withdrawConfirm === '탈퇴합니다' ? 'rgba(220,50,50,0.5)' : 'rgba(220,50,50,0.2)'}`, color: withdrawConfirm === '탈퇴합니다' ? 'rgba(240,150,150,0.9)' : 'rgba(220,50,50,0.3)', fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, cursor: withdrawConfirm === '탈퇴합니다' ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                {withdrawLoading ? '처리 중...' : '탈퇴 확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}