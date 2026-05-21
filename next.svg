'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="page-container">
      {/* 星のデコレーション */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
      }}>
        {Array.from({length: 40}).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() > 0.8 ? '2px' : '1px',
            height: Math.random() > 0.8 ? '2px' : '1px',
            background: 'white',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
            animation: `pulse ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
          }} />
        ))}
      </div>

      <div className="app-header fade-in">
        <div className="app-title">Palm Reading</div>
        <div className="app-subtitle">徳永の手相診断</div>
        <div className="gold-divider"><span>✦</span></div>
        <p style={{fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.8, margin: 0}}>
          手のひらの線が語る、あなたの運命
        </p>
      </div>

      {/* 手のひらイラスト */}
      <div style={{
        textAlign: 'center', margin: '32px 0',
        position: 'relative',
      }} className="fade-in-1">
        <div style={{
          width: 120, height: 140, margin: '0 auto',
          background: 'linear-gradient(135deg, var(--surface2), var(--surface))',
          border: '1px solid var(--border)',
          borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
          position: 'relative',
          boxShadow: '0 0 40px rgba(201,168,76,0.1)',
        }}>
          {/* 線のデコレーション */}
          <svg width="120" height="140" style={{position:'absolute',top:0,left:0}} viewBox="0 0 120 140">
            <path d="M30 100 Q50 70 60 40" stroke="rgba(201,168,76,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M25 110 Q55 90 80 75" stroke="rgba(155,111,212,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M35 105 Q60 85 85 70" stroke="rgba(201,168,76,0.3)" strokeWidth="1" fill="none" strokeLinecap="round"/>
            <path d="M50 50 Q60 80 65 110" stroke="rgba(232,201,122,0.3)" strokeWidth="1" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            background: 'radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.05), transparent)',
          }}/>
        </div>
      </div>

      {/* モード選択 */}
      <div className="fade-in-2">
        <div style={{
          fontSize: '11px', letterSpacing: '0.25em', color: 'var(--text-dim)',
          textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase',
        }}>
          診断モードを選択
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          <button className="btn-primary" onClick={() => router.push('/solo')} style={{
            padding: '22px 20px', textAlign: 'left', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{fontSize: '17px', marginBottom: '4px'}}>一人鑑定</div>
              <div style={{fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.05em'}}>
                あなた自身の手相を鑑定します
              </div>
            </div>
            <span style={{color: 'var(--gold-dim)', fontSize: '20px'}}>→</span>
          </button>

          <button className="btn-primary" onClick={() => router.push('/pair')} style={{
            padding: '22px 20px', textAlign: 'left', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{fontSize: '17px', marginBottom: '4px'}}>二人鑑定</div>
              <div style={{fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '0.05em'}}>
                二人の手相と相性を鑑定します
              </div>
            </div>
            <span style={{color: 'var(--gold-dim)', fontSize: '20px'}}>→</span>
          </button>
        </div>
      </div>

      <div style={{
        textAlign: 'center', marginTop: '40px',
        fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em', lineHeight: 2,
      }} className="fade-in-3">
        <div>Powered by Gemini AI</div>
        <div>※診断結果は占いであり、医療・法律上の助言ではありません</div>
      </div>
    </div>
  )
}
