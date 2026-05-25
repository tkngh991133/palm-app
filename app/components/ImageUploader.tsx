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
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const MAX = 1024
      let w = img.width, h = img.height
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX }
        else { w = Math.round(w * MAX / h); h = MAX }
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      const base64 = dataUrl.split(',')[1]
      URL.revokeObjectURL(objectUrl)
      onImage(base64, 'image/jpeg', dataUrl)
    }
    img.src = objectUrl
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
            <div style={{fontSize: 40, marginBottom: 12, filter: 'grayscale(1)', opacity: 0.4}}>✋</div>
            <div style={{fontSize: 14, color: 'var(--text-dim)', marginBottom: 6, letterSpacing: '0.05em'}}>
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
        onChange={handleChange}
        style={{display: 'none'}}
      />
    </div>
  )
}
