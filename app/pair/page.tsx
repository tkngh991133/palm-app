'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '../components/ImageUploader'
import DiagnosisResult from '../components/DiagnosisResult'

type Step = 'personA' | 'personB' | 'loading' | 'result'

interface PersonData {
  name: string
  imageBase64: string
  imageMime: string
  imageUrl: string
  birthdate: string
  gender: string
  job: string
}

const emptyPerson = (): PersonData => ({
  name: '', imageBase64: '', imageMime: '', imageUrl: '',
  birthdate: '', gender: '', job: '',
})

export default function PairPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('personA')
  const [personA, setPersonA] = useState<PersonData>(emptyPerson())
  const [personB, setPersonB] = useState<PersonData>(emptyPerson())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'compat'>('compat')

  const canNextA = personA.imageBase64 && personA.birthdate && personA.gender && personA.name
  const canNextB = personB.imageBase64 && personB.birthdate && personB.gender && personB.name

  const handleDiagnose = async () => {
    setStep('loading')
    setError('')
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'pair', personA, personB }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
      setStep('result')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '診断に失敗しました'
      setError(message)
      setStep('personB')
    }
  }

  const PersonForm = ({ 
    person, setPerson, label, color 
  }: { 
    person: PersonData
    setPerson: (p: PersonData) => void
    label: string
    color: string
  }) => (
    <div>
      <div style={{
        textAlign: 'center', marginBottom: 20,
        fontSize: 13, color, letterSpacing: '0.2em',
      }}>
        {label}
      </div>

      <div className="card">
        <div style={{marginBottom: 16}}>
          <label className="form-label">名前</label>
          <input
            type="text"
            className="form-input"
            placeholder="お名前を入力"
            value={person.name}
            onChange={e => setPerson({...person, name: e.target.value})}
          />
        </div>

        <ImageUploader
          imageUrl={person.imageUrl || null}
          onImage={(b64, mime, url) => setPerson({...person, imageBase64: b64, imageMime: mime, imageUrl: url})}
          label="手のひら画像"
        />
      </div>

      <div className="card">
        <div style={{marginBottom: 16}}>
          <label className="form-label">生年月日</label>
          <input
            type="date"
            className="form-input"
            value={person.birthdate}
            onChange={e => setPerson({...person, birthdate: e.target.value})}
            max={new Date().toISOString().split('T')[0]}
            style={{colorScheme: 'dark'}}
          />
        </div>

        <div style={{marginBottom: 16}}>
          <label className="form-label">性別</label>
          <select
            className="form-select"
            value={person.gender}
            onChange={e => setPerson({...person, gender: e.target.value})}
          >
            <option value="">選択してください</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="その他">その他</option>
          </select>
        </div>

        <div>
          <label className="form-label">職業（任意）</label>
          <input
            type="text"
            className="form-input"
            placeholder="例：会社員、自営業、学生..."
            value={person.job}
            onChange={e => setPerson({...person, job: e.target.value})}
          />
        </div>
      </div>
    </div>
  )

  const stepLabels: Record<Step, string> = {
    personA: '一人目の情報',
    personB: '二人目の情報',
    loading: '鑑定中',
    result: '鑑定結果',
  }

  return (
    <div className="page-container">
      <div className="app-header">
        <button className="btn-back" onClick={() => {
          if (step === 'personA') router.back()
          else if (step === 'personB') setStep('personA')
          else if (step === 'result') { setResult(null); setStep('personA') }
        }}>
          ← 戻る
        </button>
        <div className="app-title">徳永の手相診断</div>
        <div className="app-subtitle">二人鑑定</div>
        <div className="gold-divider"><span>✦</span></div>
        {step !== 'loading' && step !== 'result' && (
          <div style={{fontSize: 12, color: 'var(--text-dim)', letterSpacing: '0.1em'}}>
            {stepLabels[step]}
          </div>
        )}
      </div>

      {/* ステップインジケーター */}
      {(step === 'personA' || step === 'personB') && (
        <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24}}>
          {(['personA', 'personB'] as const).map((s, i) => (
            <div key={s} style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step === s ? 'var(--gold)' : step === 'personB' && s === 'personA' ? 'var(--gold-dim)' : 'var(--border)',
                color: step === s ? '#1a1208' : 'var(--text-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                transition: 'all 0.3s',
              }}>
                {i + 1}
              </div>
              {i === 0 && (
                <div style={{width: 40, height: 1, background: step === 'personB' ? 'var(--gold-dim)' : 'var(--border)'}} />
              )}
            </div>
          ))}
        </div>
      )}

      {step === 'personA' && (
        <div className="fade-in">
          <PersonForm
            person={personA}
            setPerson={setPersonA}
            label="▶ 一人目"
            color="var(--gold2)"
          />
          <button
            className="btn-gold"
            onClick={() => setStep('personB')}
            disabled={!canNextA}
          >
            次へ → 二人目の入力
          </button>
        </div>
      )}

      {step === 'personB' && (
        <div className="fade-in">
          <PersonForm
            person={personB}
            setPerson={setPersonB}
            label="▶ 二人目"
            color="var(--accent2)"
          />
          {error && (
            <div style={{
              background: 'rgba(212,96,122,0.1)', border: '1px solid rgba(212,96,122,0.3)',
              borderRadius: 10, padding: '12px 16px', marginBottom: 16,
              fontSize: 13, color: '#d4607a', lineHeight: 1.7,
            }}>
              {error}
            </div>
          )}
          <button
            className="btn-gold"
            onClick={handleDiagnose}
            disabled={!canNextB}
          >
            ✦ 二人の相性を鑑定する ✦
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="loading-container">
          <div className="palm-loader" />
          <div style={{textAlign: 'center'}}>
            <div className="loading-text">二人の運命を読み解いています...</div>
            <div style={{fontSize: 12, color: 'var(--text-dim)', marginTop: 8, letterSpacing: '0.1em'}}>
              それぞれの手相と相性を深く分析中です
            </div>
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="fade-in">
          {/* タブ */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'compat' ? 'active' : ''}`}
              onClick={() => setActiveTab('compat')}
            >
              ⚡ 相性
            </button>
            <button
              className={`tab ${activeTab === 'A' ? 'active' : ''}`}
              onClick={() => setActiveTab('A')}
            >
              {personA.name}
            </button>
            <button
              className={`tab ${activeTab === 'B' ? 'active' : ''}`}
              onClick={() => setActiveTab('B')}
            >
              {personB.name}
            </button>
          </div>

          {activeTab === 'compat' && result.相性 && (
            <div>
              <div className="compat-score">
                <div className="compat-score-number">{result.相性.スコア}</div>
                <div className="compat-score-label">COMPATIBILITY SCORE</div>
              </div>

              {[
                { key: '恋愛相性', emoji: '💕' },
                { key: '仕事相性', emoji: '💼' },
                { key: '信頼関係', emoji: '🤝' },
              ].map(({ key, emoji }) => (
                <div key={key} className="card" style={{marginBottom: 12}}>
                  <div style={{
                    fontSize: 12, color: 'var(--gold)', letterSpacing: '0.15em', marginBottom: 10,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span>{emoji}</span>
                    {key}
                  </div>
                  <div style={{fontSize: 14, lineHeight: 1.9, color: 'var(--text)'}}>
                    {result.相性[key]}
                  </div>
                </div>
              ))}

              <div className="result-summary">
                <div className="result-summary-title">✦ 相性総評 ✦</div>
                <div className="result-summary-text">{result.相性.総評}</div>
              </div>
            </div>
          )}

          {activeTab === 'A' && result.personA && (
            <DiagnosisResult result={result.personA} name={personA.name} />
          )}

          {activeTab === 'B' && result.personB && (
            <DiagnosisResult result={result.personB} name={personB.name} />
          )}

          <div style={{marginTop: 24}}>
            <button className="btn-primary" onClick={() => {
              setPersonA(emptyPerson())
              setPersonB(emptyPerson())
              setResult(null)
              setStep('personA')
            }}>
              もう一度鑑定する
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
