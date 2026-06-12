import { useState, useEffect } from 'react'

export default function HomePage() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Welcome</h1>
      <p style={{ fontSize: '1.5rem' }}>{now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>{now.toLocaleTimeString()}</p>
    </main>
  )
}
