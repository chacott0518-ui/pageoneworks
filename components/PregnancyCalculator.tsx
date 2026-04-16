'use client'
import { useState } from 'react'

const FD: Record<number,{s:number;w:number|null;f:string;e:string;d:string}> = {
  4:{s:.2,w:null,f:'양귀비 씨앗',e:'🌱',d:'수정란이 자궁벽에 착상을 완료합니다. 배아 크기는 아직 1mm도 되지 않습니다.'},
  5:{s:.4,w:null,f:'참깨',e:'🌿',d:'심장이 뛰기 시작합니다. 뇌와 척수를 형성하는 신경관이 발달합니다.'},
  6:{s:.6,w:null,f:'완두콩',e:'🫛',d:'초음파로 심장 박동이 확인됩니다. 팔다리 싹이 나타나기 시작합니다.'},
  7:{s:1.3,w:1,f:'블루베리',e:'🫐',d:'얼굴 윤곽과 팔다리가 형성됩니다. 뇌가 빠르게 성장 중입니다.'},
  8:{s:1.6,w:1,f:'강낭콩',e:'🫘',d:'손발가락이 생기기 시작합니다. 눈꺼풀이 눈을 덮기 시작합니다.'},
  9:{s:2.3,w:2,f:'포도 한 알',e:'🍇',d:'귀·코의 윤곽이 뚜렷해집니다. 배아에서 태아로 전환됩니다.'},
  10:{s:3.1,w:4,f:'딸기',e:'🍓',d:'손톱이 자라기 시작하고 모든 주요 기관 형성이 완료됩니다.'},
  11:{s:4.1,w:7,f:'무화과',e:'🍈',d:'성별 구분이 시작됩니다. 뼈가 단단해지기 시작합니다.'},
  12:{s:5.4,w:14,f:'라임',e:'🍋',d:'모든 기관이 완성됩니다. 손발가락에 지문이 생기기 시작합니다.'},
  13:{s:7.4,w:23,f:'레몬',e:'🍋',d:'태아가 손가락을 빨기 시작합니다. 성별 확인이 점점 가능해집니다.'},
  14:{s:8.7,w:43,f:'복숭아',e:'🍑',d:'2분기 시작. 솜털(lanugo)이 온몸을 덮기 시작합니다.'},
  15:{s:10.1,w:70,f:'사과',e:'🍎',d:'태아가 빛에 반응합니다. 근육과 뼈가 성장합니다.'},
  16:{s:11.6,w:100,f:'아보카도',e:'🥑',d:'청각이 발달해 엄마 목소리를 들을 수 있습니다.'},
  17:{s:13.0,w:140,f:'배',e:'🍐',d:'지방이 쌓이기 시작해 체온 조절 능력이 생깁니다.'},
  18:{s:14.2,w:190,f:'고구마',e:'🍠',d:'처음으로 태동을 느낄 수 있습니다. 초산부는 좀 더 늦기도 합니다.'},
  19:{s:15.3,w:240,f:'망고',e:'🥭',d:'태지(vernix caseosa)가 피부를 보호하기 시작합니다.'},
  20:{s:16.4,w:300,f:'바나나',e:'🍌',d:'중기 정밀 초음파 핵심 시점. 기형 검사의 가장 중요한 시기입니다.'},
  21:{s:26.7,w:360,f:'당근',e:'🥕',d:'위장이 양수를 삼키는 연습을 합니다.'},
  22:{s:27.8,w:430,f:'파파야',e:'🍈',d:'눈꺼풀이 완전히 발달합니다. 초음파에 손 빠는 모습이 포착됩니다.'},
  23:{s:28.9,w:500,f:'자몽',e:'🍊',d:'청각이 완성되어 태교 음악의 효과가 극대화됩니다.'},
  24:{s:30.0,w:600,f:'옥수수',e:'🌽',d:'폐가 발달합니다. 24주부터 의료 개입 시 생존 가능성이 생깁니다.'},
  25:{s:34.6,w:660,f:'콜리플라워',e:'🥦',d:'피부가 발달합니다. 손가락 지문이 완성됩니다.'},
  26:{s:35.6,w:760,f:'양상추',e:'🥬',d:'눈이 뜨이기 시작합니다. 폐 표면 활성제 분비가 시작됩니다.'},
  27:{s:36.6,w:875,f:'양배추',e:'🥬',d:'2분기 마지막 주. 뇌가 급격히 성장합니다.'},
  28:{s:37.6,w:1005,f:'가지',e:'🍆',d:'3분기 시작. 조산 시 생존 가능성이 크게 높아집니다.'},
  29:{s:38.6,w:1153,f:'작은 호박',e:'🎃',d:'뼈가 계속 단단해집니다. 체지방이 쌓이기 시작합니다.'},
  30:{s:39.9,w:1319,f:'큰 오이',e:'🥒',d:'눈이 완전히 열리고 빛에 반응합니다.'},
  31:{s:41.1,w:1502,f:'파인애플',e:'🍍',d:'면역 글로불린이 태반을 통해 전달됩니다.'},
  32:{s:42.4,w:1702,f:'단호박',e:'🎃',d:'태아가 머리를 아래로 돌리기 시작합니다.'},
  33:{s:43.7,w:1918,f:'파인애플',e:'🍍',d:'신경계와 뇌가 거의 완성됩니다. 폐 성숙이 진행됩니다.'},
  34:{s:45.0,w:2146,f:'멜론',e:'🍈',d:'34주 이후 출산 시 특별한 지원 없이도 건강하게 성장 가능합니다.'},
  35:{s:46.2,w:2383,f:'코코넛',e:'🥥',d:'폐가 거의 완전히 발달합니다. 머리카락이 보입니다.'},
  36:{s:47.4,w:2622,f:'큰 파파야',e:'🍈',d:'만삭에 가까워졌습니다. 태아가 골반 안으로 내려오기 시작합니다.'},
  37:{s:48.6,w:2859,f:'작은 수박',e:'🍉',d:'37주부터 만삭(full term). 언제 출산해도 건강합니다.'},
  38:{s:49.8,w:3083,f:'수박',e:'🍉',d:'모든 기관이 완전히 발달했습니다. 분만이 임박했습니다.'},
  39:{s:50.7,w:3288,f:'작은 호박',e:'🎃',d:'출산이 임박했습니다. 두개골이 출산을 위해 유연하게 유지됩니다.'},
  40:{s:51.2,w:3462,f:'큰 호박',e:'🎃',d:'만삭입니다! 분만예정일 — 언제든 출산이 가능합니다.'},
}

const WEEK_NAV = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,24,26,28,30,32,34,36,37,38,40]
const TABLE_WEEKS = [4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40]
const KAKAO = 'https://pf.kakao.com/_TpaBj/chat'

const FAQS = [
  {q:'임신 테스트기가 양성인데 왜 임신 4주라고 나오나요?',a:'임신주수는 실제 수정일이 아닌 마지막 생리 시작일부터 계산합니다. 배란은 생리 시작 약 14일 후이므로, 테스트기 양성 시점은 이미 임신 4~5주가 됩니다.'},
  {q:'초음파 주수와 생리 기준 주수가 1~2주 차이 납니다. 어느 쪽이 맞나요?',a:'초음파 측정값이 우선입니다. 임신 7~13주 사이 CRL(머리-엉덩이 길이) 초음파가 가장 정확합니다. 생리 주기가 불규칙하다면 초음파 주수를 따르세요.'},
  {q:'분만예정일이 지나도 출산이 안 되면 어떻게 하나요?',a:'41~42주부터 태반 기능 저하가 시작될 수 있어 의료진 판단에 따라 유도 분만을 고려합니다. 42주를 넘기면 정기 진료를 빠짐없이 받아야 합니다.'},
  {q:'임신중절수술 전 주수 확인은 왜 중요한가요?',a:'임신주수에 따라 시술 방법과 가능한 의료기관이 달라집니다. 10주 이내, 11~14주, 15주 이상 기준으로 시술 방법이 크게 달라지기 때문에 정확한 주수 확인(초음파)이 반드시 선행되어야 합니다.'},
  {q:'태동을 언제부터 느낄 수 있나요?',a:'초산부는 보통 18~22주경, 경산부는 16~18주로 더 빠릅니다. 24주 이후에도 태동이 전혀 느껴지지 않는다면 산부인과 진찰이 필요합니다.'},
]

const box: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,26,26,.1)',
  borderRadius: '4px',
  padding: '24px 20px',
  marginBottom: '14px',
  width: '100%',
  boxSizing: 'border-box',
}

const label: React.CSSProperties = {
  fontFamily: 'var(--font-space-mono)',
  fontSize: '10px',
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'rgba(26,26,26,.4)',
  marginBottom: '14px',
  display: 'block',
}

export default function PregnancyCalculator() {
  const today = new Date()
  const def = new Date(today); def.setDate(today.getDate() - 70)
  const defStr = def.toISOString().split('T')[0]

  const [lmp, setLmp] = useState(defStr)
  const [result, setResult] = useState<{
    weeks:number; days:number; totalDays:number; dueDate:string
    stageLabel:string; stageCls:string; daysLeft:number; pct:number
  }|null>(null)
  const [fw, setFw] = useState(12)
  const [openFaq, setOpenFaq] = useState<number|null>(null)

  function calc() {
    const d = new Date(lmp)
    const now = new Date(); now.setHours(0,0,0,0)
    const diff = Math.floor((now.getTime()-d.getTime())/86400000)
    if(diff<0||diff>320){alert('날짜를 다시 확인해주세요.');return}
    const weeks=Math.floor(diff/7), days=diff%7
    const due=new Date(d.getTime()+280*86400000)
    const daysLeft=Math.ceil((due.getTime()-now.getTime())/86400000)
    const pct=Math.min(100,Math.round(diff/280*100))
    let stageLabel:string, stageCls:string
    if(weeks<=13){stageLabel='초기 (1분기)';stageCls='early'}
    else if(weeks<=27){stageLabel='중기 (2분기)';stageCls='mid'}
    else{stageLabel='후기 (3분기)';stageCls='late'}
    const dueDate=`${due.getFullYear()}년 ${due.getMonth()+1}월 ${due.getDate()}일`
    setResult({weeks,days,totalDays:diff,dueDate,stageLabel,stageCls,daysLeft,pct})
    setFw(Math.max(4,Math.min(40,weeks||12)))
  }

  const fetal = FD[fw]||FD[40]
  const fetalSize = fetal.s<1?`${(fetal.s*10).toFixed(1)}mm`:`${fetal.s.toFixed(1)}cm`
  const fetalWeight = fetal.w?`${fetal.w.toLocaleString()}g`:'측정 어려움'

  const stageColor:{[k:string]:{bg:string;color:string}} = {
    early:{bg:'rgba(52,211,153,.12)',color:'#059669'},
    mid:{bg:'rgba(251,191,36,.12)',color:'#d97706'},
    late:{bg:'rgba(239,68,68,.12)',color:'#dc2626'},
  }

  return (
    <div style={{
      margin:'32px 0',
      fontFamily:'var(--font-inter)',
      width:'100%',
      maxWidth:'100%',
      overflowX:'hidden',
      boxSizing:'border-box',
    }}>

      {/* ── CALC 1 임신주수 ── */}
      <div style={box}>
        <span style={label}>TOOL 01 — 임신주수 계산기</span>
        <label style={{
          display:'block',
          fontFamily:'var(--font-space-mono)',
          fontSize:'10px',
          letterSpacing:'0.1em',
          textTransform:'uppercase',
          color:'rgba(26,26,26,.5)',
          marginBottom:'8px',
        }}>
          마지막 생리 시작일 (LMP)
        </label>
        <input
          type="date"
          value={lmp}
          onChange={e=>setLmp(e.target.value)}
          style={{
            width:'100%',
            padding:'12px 14px',
            border:'1px solid rgba(26,26,26,.15)',
            borderRadius:'2px',
            fontSize:'16px',
            fontFamily:'var(--font-inter)',
            color:'#1a1a1a',
            background:'#fafafa',
            outline:'none',
            marginBottom:'10px',
            boxSizing:'border-box',
          }}
        />
        <button
          onClick={calc}
          style={{
            width:'100%',
            padding:'13px',
            background:'#1a1a1a',
            color:'#fff',
            border:'none',
            borderRadius:'2px',
            fontSize:'13px',
            fontFamily:'var(--font-space-mono)',
            letterSpacing:'0.1em',
            cursor:'pointer',
            boxSizing:'border-box',
          }}
        >
          임신주수 계산하기 →
        </button>

        {result && (
          <div style={{
            marginTop:'18px',
            padding:'18px 16px',
            background:'#f8f7f4',
            borderRadius:'2px',
            boxSizing:'border-box',
          }}>
            {/* 주수 크게 */}
            <p style={{
              fontFamily:'var(--font-cormorant)',
              fontSize:'clamp(2rem,10vw,3rem)',
              fontWeight:400,
              color:'#1a1a1a',
              lineHeight:1.1,
              marginBottom:'2px',
            }}>
              {result.weeks}주 {result.days}일
            </p>
            <p style={{
              fontFamily:'var(--font-space-mono)',
              fontSize:'10px',
              color:'rgba(26,26,26,.4)',
              letterSpacing:'0.08em',
              marginBottom:'16px',
            }}>
              임신 {result.totalDays}일째
            </p>

            {/* 4칸 그리드 */}
            <div style={{
              display:'grid',
              gridTemplateColumns:'1fr 1fr',
              gap:'8px',
              marginBottom:'14px',
            }}>
              {[
                {l:'분만 예정일', v:result.dueDate},
                {l:'임신 단계', v:result.stageLabel, badge:true, sc:result.stageCls},
                {l:'예정일까지', v:result.daysLeft>0?`D-${result.daysLeft}`:'예정일 경과'},
                {l:'진행률', v:`${result.pct}%`},
              ].map(item=>(
                <div key={item.l} style={{
                  background:'#fff',
                  border:'1px solid rgba(26,26,26,.08)',
                  padding:'10px 12px',
                  borderRadius:'2px',
                  minWidth:0,
                }}>
                  <p style={{
                    fontFamily:'var(--font-space-mono)',
                    fontSize:'9px',
                    letterSpacing:'0.06em',
                    textTransform:'uppercase',
                    color:'rgba(26,26,26,.35)',
                    marginBottom:'5px',
                    whiteSpace:'nowrap',
                    overflow:'hidden',
                    textOverflow:'ellipsis',
                  }}>{item.l}</p>
                  {item.badge ? (
                    <span style={{
                      ...stageColor[item.sc!],
                      padding:'2px 7px',
                      borderRadius:'2px',
                      fontSize:'11px',
                      fontFamily:'var(--font-space-mono)',
                      fontWeight:600,
                    }}>{item.v}</span>
                  ) : (
                    <p style={{
                      fontSize:'13px',
                      fontWeight:500,
                      color:'#1a1a1a',
                      overflow:'hidden',
                      textOverflow:'ellipsis',
                      whiteSpace:'nowrap',
                    }}>{item.v}</p>
                  )}
                </div>
              ))}
            </div>

            {/* 진행바 */}
            <div>
              <div style={{
                display:'flex',
                justifyContent:'space-between',
                fontFamily:'var(--font-space-mono)',
                fontSize:'9px',
                color:'rgba(26,26,26,.35)',
                marginBottom:'5px',
              }}>
                <span>0주</span>
                <span>{result.weeks}주 / 40주</span>
              </div>
              <div style={{
                height:'4px',
                background:'rgba(26,26,26,.1)',
                borderRadius:'100px',
                overflow:'hidden',
              }}>
                <div style={{
                  height:'100%',
                  width:`${result.pct}%`,
                  background:'#1a1a1a',
                  borderRadius:'100px',
                  transition:'width .6s ease',
                }}/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CALC 2 태아 크기 ── */}
      <div style={box}>
        <span style={label}>TOOL 02 — 태아 크기 비교기</span>

        <div style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          marginBottom:'10px',
        }}>
          <span style={{
            fontFamily:'var(--font-space-mono)',
            fontSize:'10px',
            color:'rgba(26,26,26,.4)',
            textTransform:'uppercase',
            letterSpacing:'0.08em',
          }}>임신 주수 선택</span>
          <span style={{
            fontFamily:'var(--font-cormorant)',
            fontSize:'1.8rem',
            fontWeight:400,
            color:'#1a1a1a',
          }}>{fw}주</span>
        </div>

        {/* 슬라이더 */}
        <input
          type="range" min="4" max="40" step="1" value={fw}
          onChange={e=>setFw(Number(e.target.value))}
          style={{width:'100%',marginBottom:'6px',accentColor:'#1a1a1a',boxSizing:'border-box'}}
        />
        <div style={{
          display:'flex',
          justifyContent:'space-between',
          fontFamily:'var(--font-space-mono)',
          fontSize:'9px',
          color:'rgba(26,26,26,.3)',
          marginBottom:'14px',
        }}>
          <span>4주</span><span>20주</span><span>40주</span>
        </div>

        {/* 주수 버튼 — 가로 스크롤 1줄 */}
        <div style={{
          display:'flex',
          overflowX:'auto',
          gap:'5px',
          paddingBottom:'8px',
          WebkitOverflowScrolling:'touch' as any,
          scrollbarWidth:'none' as any,
          marginBottom:'18px',
        }}>
          {WEEK_NAV.map(w=>(
            <button
              key={w}
              onClick={()=>setFw(w)}
              style={{
                flexShrink:0,
                padding:'6px 10px',
                fontSize:'11px',
                fontFamily:'var(--font-space-mono)',
                background: fw===w ? '#1a1a1a' : 'transparent',
                color: fw===w ? '#fff' : 'rgba(26,26,26,.5)',
                border:`1px solid ${fw===w ? '#1a1a1a' : 'rgba(26,26,26,.12)'}`,
                borderRadius:'2px',
                cursor:'pointer',
                whiteSpace:'nowrap',
              }}
            >{w}주</button>
          ))}
        </div>

        {/* 태아 결과 */}
        <div style={{
          background:'#f8f7f4',
          padding:'24px 16px',
          textAlign:'center',
          borderRadius:'2px',
          marginBottom:'14px',
          boxSizing:'border-box',
        }}>
          <div style={{fontSize:'clamp(64px,16vw,88px)',lineHeight:1,marginBottom:'10px'}}>{fetal.e}</div>
          <p style={{
            fontFamily:'var(--font-cormorant)',
            fontSize:'clamp(1.2rem,5vw,1.6rem)',
            fontWeight:400,
            color:'#1a1a1a',
            marginBottom:'4px',
          }}>{fetal.f}</p>
          <p style={{
            fontFamily:'var(--font-inter)',
            fontSize:'13px',
            fontWeight:300,
            color:'rgba(26,26,26,.5)',
            marginBottom:'18px',
            lineHeight:1.5,
          }}>지금 우리 아기는 {fetal.f}만 합니다</p>

          {/* CRL / 체중 */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'1fr 1fr',
            gap:'8px',
            textAlign:'left',
            marginBottom:'12px',
          }}>
            {[
              {l:'머리~엉덩이 (CRL)',v:fetalSize},
              {l:'태아 체중 (추정)',v:fetalWeight},
            ].map(item=>(
              <div key={item.l} style={{
                background:'#fff',
                border:'1px solid rgba(26,26,26,.08)',
                padding:'12px',
                borderRadius:'2px',
                minWidth:0,
              }}>
                <p style={{
                  fontFamily:'var(--font-space-mono)',
                  fontSize:'9px',
                  letterSpacing:'0.06em',
                  textTransform:'uppercase',
                  color:'rgba(26,26,26,.35)',
                  marginBottom:'5px',
                  overflow:'hidden',
                  textOverflow:'ellipsis',
                  whiteSpace:'nowrap',
                }}>{item.l}</p>
                <p style={{
                  fontFamily:'var(--font-cormorant)',
                  fontSize:'clamp(1.2rem,5vw,1.5rem)',
                  fontWeight:400,
                  color:'#1a1a1a',
                }}>{item.v}</p>
              </div>
            ))}
          </div>

          {/* 발달 설명 */}
          <p style={{
            fontFamily:'var(--font-inter)',
            fontSize:'13px',
            fontWeight:300,
            color:'rgba(26,26,26,.6)',
            lineHeight:1.7,
            textAlign:'left',
            padding:'12px',
            background:'#fff',
            border:'1px solid rgba(26,26,26,.08)',
            borderRadius:'2px',
            wordBreak:'keep-all',
            overflowWrap:'break-word',
          }}>{fetal.d}</p>
        </div>
      </div>

      {/* ── 주수별 일람표 — 모바일 카드형 ── */}
      <div style={{...box, padding:'20px 16px'}}>
        <span style={label}>주수별 태아 크기 & 발달 일람표</span>

        {/* 모바일: 카드 리스트 / PC: 테이블 */}
        <div className="hide-on-mobile" style={{overflowX:'auto',WebkitOverflowScrolling:'touch' as any}}>
          <table style={{
            width:'100%',
            borderCollapse:'collapse',
            fontSize:'12px',
            tableLayout:'fixed',
          }}>
            <thead>
              <tr style={{background:'#1a1a1a'}}>
                {['주수','비교','크기','체중','핵심 발달'].map((h,i)=>(
                  <th key={h} style={{
                    padding:'9px 10px',
                    fontFamily:'var(--font-space-mono)',
                    fontSize:'9px',
                    letterSpacing:'0.08em',
                    textTransform:'uppercase',
                    color:'rgba(245,242,237,.7)',
                    textAlign:'left',
                    whiteSpace:'nowrap',
                    width: i===0?'48px': i===1?'80px': i===2?'48px': i===3?'56px': 'auto',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_WEEKS.map((w,idx)=>{
                const d=FD[w]; if(!d) return null
                return(
                  <tr key={w} style={{background:idx%2===0?'#fff':'#fafaf8'}}>
                    <td style={{padding:'9px 10px',fontFamily:'var(--font-space-mono)',fontSize:'11px',fontWeight:600,color:'#1a1a1a',whiteSpace:'nowrap'}}>{w}주</td>
                    <td style={{padding:'9px 10px',whiteSpace:'nowrap',color:'rgba(26,26,26,.75)',fontSize:'12px'}}>{d.e} {d.f}</td>
                    <td style={{padding:'9px 10px',whiteSpace:'nowrap',color:'rgba(26,26,26,.75)',fontSize:'12px'}}>{d.s<1?`${(d.s*10).toFixed(1)}mm`:`${d.s}cm`}</td>
                    <td style={{padding:'9px 10px',whiteSpace:'nowrap',color:'rgba(26,26,26,.75)',fontSize:'12px'}}>{d.w?`${d.w.toLocaleString()}g`:'—'}</td>
                    <td style={{padding:'9px 10px',fontSize:'11px',fontWeight:300,color:'rgba(26,26,26,.6)',lineHeight:1.5,wordBreak:'keep-all'}}>{d.d}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 모바일 카드 리스트 */}
        <div className="show-on-mobile">
          {TABLE_WEEKS.map(w=>{
            const d=FD[w]; if(!d) return null
            return(
              <div key={w} style={{
                borderBottom:'1px solid rgba(26,26,26,.06)',
                padding:'12px 0',
                display:'flex',
                alignItems:'flex-start',
                gap:'12px',
              }}>
                <div style={{
                  flexShrink:0,
                  width:'36px',
                  height:'36px',
                  background:'#1a1a1a',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  borderRadius:'2px',
                }}>
                  <span style={{
                    fontFamily:'var(--font-space-mono)',
                    fontSize:'10px',
                    color:'rgba(245,242,237,.8)',
                    fontWeight:600,
                  }}>{w}주</span>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{
                    display:'flex',
                    alignItems:'center',
                    gap:'8px',
                    marginBottom:'4px',
                    flexWrap:'wrap',
                  }}>
                    <span style={{fontSize:'18px'}}>{d.e}</span>
                    <span style={{
                      fontFamily:'var(--font-inter)',
                      fontSize:'13px',
                      fontWeight:500,
                      color:'#1a1a1a',
                    }}>{d.f}</span>
                    <span style={{
                      fontFamily:'var(--font-space-mono)',
                      fontSize:'10px',
                      color:'rgba(26,26,26,.4)',
                    }}>{d.s<1?`${(d.s*10).toFixed(1)}mm`:`${d.s}cm`}</span>
                    {d.w && (
                      <span style={{
                        fontFamily:'var(--font-space-mono)',
                        fontSize:'10px',
                        color:'rgba(26,26,26,.4)',
                      }}>{d.w.toLocaleString()}g</span>
                    )}
                  </div>
                  <p style={{
                    fontFamily:'var(--font-inter)',
                    fontSize:'12px',
                    fontWeight:300,
                    color:'rgba(26,26,26,.6)',
                    lineHeight:1.6,
                    wordBreak:'keep-all',
                    overflowWrap:'break-word',
                    margin:0,
                  }}>{d.d}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 카카오 CTA ── */}
      <div style={{
        ...box,
        background:'rgba(254,229,0,.07)',
        border:'1px solid rgba(254,229,0,.3)',
        textAlign:'center',
        padding:'24px 20px',
      }}>
        <p style={{
          fontFamily:'var(--font-space-mono)',
          fontSize:'9px',
          letterSpacing:'0.15em',
          textTransform:'uppercase',
          color:'rgba(26,26,26,.4)',
          marginBottom:'8px',
        }}>전문가 무료 상담</p>
        <p style={{
          fontFamily:'var(--font-cormorant)',
          fontSize:'clamp(1.1rem,4vw,1.5rem)',
          fontWeight:400,
          color:'#1a1a1a',
          marginBottom:'8px',
          lineHeight:1.3,
          wordBreak:'keep-all',
        }}>
          임신·임신중절 주수 관련<br/>궁금한 점이 있으신가요?
        </p>
        <p style={{
          fontFamily:'var(--font-inter)',
          fontSize:'13px',
          fontWeight:300,
          color:'rgba(26,26,26,.55)',
          marginBottom:'18px',
          lineHeight:1.65,
          wordBreak:'keep-all',
        }}>
          연세365산부인과 전문의에게 카카오톡으로 즉시 상담받으세요.<br/>
          비밀이 철저히 보장되며 부담 없이 질문하실 수 있습니다.
        </p>
        
          <a href={KAKAO}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:'inline-flex',
            alignItems:'center',
            justifyContent:'center',
            gap:'8px',
            background:'#fee500',
            color:'#1a1200',
            padding:'13px 22px',
            borderRadius:'2px',
            fontSize:'13px',
            fontFamily:'var(--font-space-mono)',
            fontWeight:700,
            letterSpacing:'0.06em',
            textDecoration:'none',
            width:'100%',
            boxSizing:'border-box',
          }}
        >
          연세365산부인과 카카오 상담하기
        </a>
      </div>

      {/* ── FAQ ── */}
      <div style={{
        ...box,
        padding:'8px 0',
        overflow:'hidden',
      }}>
        {FAQS.map((faq,i)=>(
          <div key={i} style={{
            borderBottom: i<FAQS.length-1 ? '1px solid rgba(26,26,26,.06)' : 'none',
          }}>
            <button
              onClick={()=>setOpenFaq(openFaq===i?null:i)}
              style={{
                width:'100%',
                background:'none',
                border:'none',
                padding:'14px 20px',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'flex-start',
                cursor:'pointer',
                gap:'12px',
                textAlign:'left',
                boxSizing:'border-box',
              }}
            >
              <span style={{
                fontFamily:'var(--font-inter)',
                fontSize:'13px',
                fontWeight:500,
                color:'#1a1a1a',
                lineHeight:1.55,
                flex:1,
                wordBreak:'keep-all',
                overflowWrap:'break-word',
              }}>{faq.q}</span>
              <span style={{
                fontSize:'18px',
                color:'rgba(26,26,26,.3)',
                flexShrink:0,
                transform:openFaq===i?'rotate(45deg)':'none',
                transition:'transform .2s',
                display:'inline-block',
                marginTop:'1px',
              }}>+</span>
            </button>
            {openFaq===i && (
              <div style={{
                padding:'0 20px 14px',
                fontFamily:'var(--font-inter)',
                fontSize:'13px',
                fontWeight:300,
                color:'rgba(26,26,26,.65)',
                lineHeight:1.75,
                wordBreak:'keep-all',
                overflowWrap:'break-word',
              }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* 모바일/PC 전환 CSS */}
      <style>{`
        .hide-on-mobile { display: block; }
        .show-on-mobile { display: none; }
        @media (max-width: 640px) {
          .hide-on-mobile { display: none !important; }
          .show-on-mobile { display: block !important; }
        }
      `}</style>

    </div>
  )
}