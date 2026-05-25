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

interface DateState {
  year: string
  month: string
  day: string
}

const emptyPerson = (): PersonData => ({
  name: '', imageBase64: '', imageMime: '', imageUrl: '',
  birthdate: '', gender: '', job: '',
})

const years = Array.from({length: 100}, (_, i) => 1930 + i).reverse()
const months = Array.from({length: 12}, (_, i) => i + 1)
const days = Array.from({length: 31}, (_, i) => i + 1)

const selectStyle = {
  flex: 1, padding: '12px 8px',
  background: '#110e1f', border: '1px solid #2e2850',
  borderRadius: '10px', color: '#e8e0d0',
  fontFamily: "'Noto Serif JP', serif", fontSize: '15px',
  outline: 'none', WebkitAppearance: 'none' as const, cursor: 'pointer',
}

export default function PairPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('personA')
  const [personA, setPersonA] = useState<PersonData>(emptyPerson())
  const [personB, setPersonB] = useState<PersonData>(emptyPerson())
  const [dateA, setDateA] = useState<DateState>({year:'1980', month:'1', day:'1'})
  const [dateB, setDateB] = useState<DateState>({year:'1980', month:'1', day:'1'})
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [jobA, setJobA] = useState('')
  const [jobB, setJobB] = useState('')
  const [validationError, setValidationError] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'compat'>('compat')

  const getBirthdate = (d: DateState) =>
    `${d.year}-${String(d.month).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`

  const handleNextA = () => {
    if (!nameA.trim()) { setValidationError('名前を入力してください'); return }
    if (!personA.imageBase64) { setValidationError('手のひら画像を選択してください'); return }
    if (!personA.gender) { setValidationError('性別を選択してください'); return }
    setValidationError('')
    setStep('personB')
  }

  const handleDiagnose = async () => {
    if (!nameB.trim()) { setValidationError('名前を入力してください'); return }
    if (!personB.imageBase64) { setValidationError('手のひら画像を選択してください'); return }
    if (!personB.gender) { setValidationError('性別を選択してください'); return }
    setValidationError('')
    setStep('loading')
    setError('')
    const pA = {...personA, name: nameA, job: jobA, birthdate: getBirthdate(dateA)}
    const pB = {...personB, name: nameB, job: jobB, birthdate: getBirthdate(dateB)}
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'pair', personA: pA, personB: pB }),
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
    person, setPerson, dateState, setDateState, label, color,
    name, onNameBlur, job, onJobBlur,
  }: {
    person: PersonData
    setPerson: (p: PersonData) => void
    dateState: DateState
    setDateState: (d: DateState) => void
    label: string
    color: string
    name: string
    onNameBlur: (v: string) => void
    job: string
    onJobBlur: (v: string) => void
  }) => (
    <div>
      <div style={{textAlign:'center', marginBottom:20, fontSize:13, color, letterSpacing:'0.2em'}}>
        {label}
      </div>
      <div className="card">
        <div style={{marginBottom: 14}}>
          <label className="form-label">名前</label>
          <input
            type="text"
            className="form-input"
            placeholder="お名前を入力"
            defaultValue={name}
            onBlur={e => onNameBlur(e.target.value)}
          />
        </div>
        <ImageUploader
          imageUrl={person.imageUrl || null}
          onImage={(b64, mime, url) => setPerson({...person, imageBase64: b64, imageMime: mime, imageUrl: url})}
          label="手のひら画像"
        />
      </div>
      <div className="card">
        <div style={{marginBottom: 14}}>
          <label className="form-label">生年月日</label>
          <div style={{display:'flex', gap:6}}>
            <select value={dateState.year} onChange={e => setDateState({...dateState, year: e.target.value})} style={selectStyle}>
              {years.map(y => <option key={y} value={y}>{y}年</option>)}
            </select>
            <select value={dateState.month} onChange={e => setDateState({...dateState, month: e.target.value})} style={selectStyle}>
              {months.map(m => <option key={m} value={m}>{m}月</option>)}
            </select>
            <select value={dateState.day} onChange={e => setDateState({...dateState, day: e.target.value})} style={selectStyle}>
              {days.map(d => <option key={d} value={d}>{d}日</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom: 14}}>
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
            defaultValue={job}
            onBlur={e => onJobBlur(e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-container">
      <div className="app-header">
        <button className="btn-back" onClick={() => {
          if (step === 'personA') router.back()
          else if (step === 'personB') { setValidationError(''); setStep('personA') }
          else if (step === 'result') { setResult(null); setStep('personA') }
        }}>
          ← 戻る
        </button>
        <div className="app-title">徳永の手相診断</div>
        <div className="app-subtitle">二人鑑定</div>
        <div className="gold-divider"><span>✦</span></div>
      </div>

      {(step === 'personA' || step === 'personB') && (
        <div style={{display:'flex', justifyContent:'center', gap:8, marginBottom:24}}>
          {(['personA','personB'] as const).map((s, i) => (
            <div key={s} style={{display:'flex', alignItems:'center', gap:8}}>
              <div style={{
                width:28, height:28, borderRadius:'50%',
                background: step === s ? 'var(--gold)' : (step === 'personB' && s === 'personA') ? 'var(--gold-dim)' : 'var(--border)',
                color: step === s ? '#1a1208' : 'var(--text-dim)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, fontWeight:700, transition:'all 0.3s',
              }}>{i + 1}</div>
              {i === 0 && <div style={{width:40, height:1, background: step === 'personB' ? 'var(--gold-dim)' : 'var(--border)'}} />}
            </div>
          ))}
        </div>
      )}

      {step === 'personA' && (
        <div className="fade-in">
          <PersonForm
            person={personA} setPerson={setPersonA}
            dateState={dateA} setDateState={setDateA}
            label="▶ 一人目" color="var(--gold2)"
            name={nameA} onNameBlur={setNameA}
            job={jobA} onJobBlur={setJobA}
          />
          {validationError && (
            <div style={{
              background:'rgba(212,96,122,0.1)', border:'1px solid rgba(212,96,122,0.3)',
              borderRadius:10, padding:'12px 16px', marginBottom:16,
              fontSize:13, color:'#d4607a', lineHeight:1.7,
            }}>{validationError}</div>
          )}
          <button className="btn-gold" onClick={handleNextA}>
            次へ → 二人目の入力
          </button>
        </div>
      )}

      {step === 'personB' && (
        <div className="fade-in">
          <PersonForm
            person={personB} setPerson={setPersonB}
            dateState={dateB} setDateState={setDateB}
            label="▶ 二人目" color="var(--accent2)"
            name={nameB} onNameBlur={setNameB}
            job={jobB} onJobBlur={setJobB}
          />
          {(validationError || error) && (
            <div style={{
              background:'rgba(212,96,122,0.1)', border:'1px solid rgba(212,96,122,0.3)',
              borderRadius:10, padding:'12px 16px', marginBottom:16,
              fontSize:13, color:'#d4607a', lineHeight:1.7,
            }}>{validationError || error}</div>
          )}
          <button className="btn-gold" onClick={handleDiagnose}>
            ✦ 二人の相性を鑑定する ✦
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="loading-container">
          <div className="palm-loader" />
          <div style={{textAlign:'center'}}>
            <div className="loading-text">二人の運命を読み解いています...</div>
            <div style={{fontSize:12, color:'var(--text-dim)', marginTop:8, letterSpacing:'0.1em'}}>
              それぞれの手相と相性を深く分析中です
            </div>
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="fade-in">
          <div className="tabs">
            <button className={`tab ${activeTab === 'compat' ? 'active' : ''}`} onClick={() => setActiveTab('compat')}>⚡ 相性</button>
            <button className={`tab ${activeTab === 'A' ? 'active' : ''}`} onClick={() => setActiveTab('A')}>{nameA}</button>
            <button className={`tab ${activeTab === 'B' ? 'active' : ''}`} onClick={() => setActiveTab('B')}>{nameB}</button>
          </div>

          {activeTab === 'compat' && result.相性 && (
            <div>
              <div className="compat-score">
                <div className="compat-score-number">{result.相性.スコア}</div>
                <div className="compat-score-label">COMPATIBILITY SCORE</div>
              </div>
              {[{key:'恋愛相性', emoji:'💕'}, {key:'仕事相性', emoji:'💼'}, {key:'信頼関係', emoji:'🤝'}].map(({key, emoji}) => (
                <div key={key} className="card" style={{marginBottom:12}}>
                  <div style={{fontSize:12, color:'var(--gold)', letterSpacing:'0.15em', marginBottom:10, display:'flex', alignItems:'center', gap:8}}>
                    <span>{emoji}</span>{key}
                  </div>
                  <div style={{fontSize:14, lineHeight:1.9, color:'var(--text)'}}>{result.相性[key]}</div>
                </div>
              ))}
              <div className="result-summary">
                <div className="result-summary-title">✦ 相性総評 ✦</div>
                <div className="result-summary-text">{result.相性.総評}</div>
              </div>
            </div>
          )}

          {activeTab === 'A' && result.personA && <DiagnosisResult result={result.personA} name={nameA} />}
          {activeTab === 'B' && result.personB && <DiagnosisResult result={result.personB} name={nameB} />}

          <div style={{marginTop:24}}>
            <button className="btn-primary" onClick={() => {
              setPersonA(emptyPerson()); setPersonB(emptyPerson())
              setDateA({year:'1980', month:'1', day:'1'})
              setDateB({year:'1980', month:'1', day:'1'})
              setNameA(''); setNameB('')
              setJobA(''); setJobB('')
              setResult(null); setStep('personA')
            }}>
              もう一度鑑定する
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
