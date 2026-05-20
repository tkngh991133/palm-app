'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from '../components/ImageUploader'
import DiagnosisResult from '../components/DiagnosisResult'

type Step = 'input' | 'loading' | 'result'

interface PersonData {
  imageBase64: string
  imageMime: string
  imageUrl: string
  birthdate: string
  gender: string
  job: string
}

export default function SoloPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('input')
  const [person, setPerson] = useState<PersonData>({
    imageBase64: '', imageMime: '', imageUrl: '',
    birthdate: '', gender: '', job: '',
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const canSubmit = person.imageBase64 && person.birthdate && person.gender

  const handleDiagnose = async () => {
    setStep('loading')
    setError('')
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'solo', personA: person }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.result)
      setStep('result')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '診断に失敗しました'
      setError(message)
      setStep('input')
    }
  }

  return (
    <div className="page-container">
      <div className="app-header">
        <button className="btn-back" onClick={() => step === 'result' ? setStep('input') : router.back()}>
          ← 戻る
        </button>
        <div className="app-title">徳永の手相診断</div>
        <div className="app-subtitle">一人鑑定</div>
        <div className="gold-divider"><span>✦</span></div>
      </div>

      {step === 'input' && (
        <div className="fade-in">
          <div className="card">
            <ImageUploader
              imageUrl={person.imageUrl || null}
              onImage={(b64, mime, url) => setPerson(p => ({...p, imageBase64: b64, imageMime: mime, imageUrl: url}))}
              label="手のひら画像"
            />
            <p style={{fontSize: 11, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.7}}>
              ※ 手のひらを広げ、線がよく見えるよう明るい場所で撮影してください
            </p>
          </div>

          <div className="card">
            <div style={{marginBottom: 16}}>
              <label className="form-label">生年月日</label>
              <input
                type="date"
                className="form-input"
                value={person.birthdate}
                onChange={e => setPerson(p => ({...p, birthdate: e.target.value}))}
                max={new Date().toISOString().split('T')[0]}
                style={{colorScheme: 'dark'}}
              />
            </div>

            <div style={{marginBottom: 16}}>
              <label className="form-label">性別</label>
              <select
                className="form-select"
                value={person.gender}
                onChange={e => setPerson(p => ({...p, gender: e.target.value}))}
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
                onChange={e => setPerson(p => ({...p, job: e.target.value}))}
              />
            </div>
          </div>

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
            disabled={!canSubmit}
          >
            ✦ 鑑定する ✦
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div className="loading-container">
          <div className="palm-loader" />
          <div style={{textAlign: 'center'}}>
            <div className="loading-text">手相を読み解いています...</div>
            <div style={{fontSize: 12, color: 'var(--text-dim)', marginTop: 8, letterSpacing: '0.1em'}}>
              AIが深く思考中です。しばらくお待ちください
            </div>
          </div>
          <div style={{
            display: 'flex', gap: 8, marginTop: 8,
          }}>
            {['生命線', '感情線', '運命線'].map((line, i) => (
              <div key={line} style={{
                fontSize: 11, color: 'var(--gold-dim)', letterSpacing: '0.1em',
                animation: `pulse 1.5s ease-in-out ${i * 0.5}s infinite`,
              }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="fade-in">
          <div style={{
            textAlign: 'center', marginBottom: 24,
            padding: '16px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 12,
          }}>
            <div style={{fontSize: 12, color: 'var(--text-dim)', marginBottom: 4}}>鑑定完了</div>
            <div style={{fontSize: 14, color: 'var(--text)', lineHeight: 1.7}}>
              {person.birthdate} 生まれ　{person.gender}
              {person.job ? `　${person.job}` : ''}
            </div>
          </div>

          <DiagnosisResult result={result} />

          <div style={{marginTop: 24}}>
            <button className="btn-primary" onClick={() => {
              setPerson({ imageBase64: '', imageMime: '', imageUrl: '', birthdate: '', gender: '', job: '' })
              setResult(null)
              setStep('input')
            }}>
              もう一度鑑定する
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
