'use client'
import { useRef, useEffect } from 'react'

interface Props {
  placeholder?: string
  initialValue?: string
  onBlur: (value: string) => void
  className?: string
}

export default function TextInput({ placeholder, initialValue = '', onBlur, className }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current && initialValue) {
      ref.current.value = initialValue
    }
  }, [])

  return (
    <input
      ref={ref}
      type="text"
      className={className}
      placeholder={placeholder}
      defaultValue={initialValue}
      onBlur={e => onBlur(e.target.value)}
    />
  )
}
