'use client'
import { useState } from 'react'

type SectionData = Record<string, string>

interface SoloResult {
  四大基本線: SectionData
  主要補助線: SectionData
  '特殊線・紋様': SectionData
  '性格・行動': SectionData
  ラッキーサイン: SectionData
  総評: string
}

interface Props {
  result: SoloResult
  name?: string
}

const SECTIONS = [
  { key: '四大基本線', emoji: '🌿', desc: '人生の基盤' },
  { key: '主要補助線', emoji: '✨', desc: '成功・幸福を補足' },
  { key: '特殊線・紋様', emoji: '🔮', desc: '才能や強運' },
  { key: '性格・行動', emoji: '🌙', desc: 'ライフスタイル' },
  { key: 'ラッキーサイン', emoji: '⭐', desc: '記号' },
] as const

export default function DiagnosisResult({ result, name }: Props) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['四大基本線']))

  const toggle = (key: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div>
      {name && (
        <div style={{
          textAlign: 'center', marginBottom: 20,
          fontSize: 16, color: 'var(--gold2)', letterSpacing: '0.1em',
        }}>
          {name} の手相鑑定
        </div>
      )}

      {result.総評 && (
        <div className="result-summary fade-in" style={{marginBottom: 16}}>
          <div className="result-summary-title">✦ 総 評 ✦</div>
          <div className="result-summary-text">{result.総評}</div>
        </div>
      )}

      {SECTIONS.map(({ key, emoji, desc }) => {
        const sectionData = result[key as keyof typeof result]
        if (!sectionData || typeof sectionData === 'string') return null
        const isOpen = openSections.has(key)

        return (
          <div key={key} className="result-section fade-in">
            <div
              className="result-section-header"
              onClick={() => toggle(key)}
              style={{borderRadius: isOpen ? '10px 10px 0 0' : '10px'}}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <span style={{fontSize: 18}}>{emoji}</span>
                <div>
                  <div className="result-section-title">{key}</div>
                  <div style={{fontSize: 11, color: 'var(--text-dim)', marginTop: 2}}>{desc}</div>
                </div>
              </div>
              <span style={{
                color: 'var(--gold-dim)', fontSize: 18,
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
                display: 'inline-block',
              }}>⌄</span>
            </div>

            {isOpen && (
              <div className="result-section-content">
                {Object.entries(sectionData as SectionData).map(([name, text]) => (
                  <div key={name} className="result-item">
                    <div className="result-item-name">◆ {name}</div>
                    <div className="result-item-text">{text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
