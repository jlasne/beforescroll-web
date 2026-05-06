'use client'
import { useEffect } from 'react'

interface Props {
  destination: string
  slug: string
}

export default function GoRedirect({ destination, slug }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = destination
    }, 150)
    return () => clearTimeout(timer)
  }, [destination])

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'system-ui', color: '#666' }}>Redirecting…</p>
    </div>
  )
}
