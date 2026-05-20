'use client'
import { useRef } from 'react'

interface Props {
  imageUrl: string | null
  onImage: (base64: string, mime: string, url: string) => void
  label?: string
}

export default function ImageUploader({ imageUrl, onImage, label }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      const base64 = result.split(',')[1]
      const url = result
      onImage(base64, file.type, url)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <div
        className={`upload-area ${imageUrl ? 'has-image' : ''}`}
        onClick={() => fileRef.current?.click()}
      >
        {imageUrl ? (
          <div style={{position: 'relative'}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="手のひら" />
            <div style={{
              position: 'absolute', bottom: 12, right: 12,
              background: 'rgba(0,0,0,0.6)', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: 'var(--gold)',
              letterSpacing: '0.1em',
            }}>
              タップして変更
            </div>
          </div>
        ) : (
          <div>
            <div style={{
              fontSize: 40, marginBottom: 12,
              filter: 'grayscale(1)', opacity: 0.4,
            }}>✋</div>
            <div style={{
              fontSize: 14, color: 'var(--text-dim)', marginBottom: 6,
              letterSpacing: '0.05em',
            }}>
              タップして手のひら画像を選択
            </div>
            <div style={{fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.05em'}}>
              カメラ撮影またはライブラリから選択
            </div>
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{display: 'none'}}
      />
    </div>
  )
}
