import { useState } from 'react'

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] }
    }
  }
  return null
}

function Square({ value, onClick, highlight }) {
  return (
    <button onClick={onClick} style={{
      width: 100, height: 100, fontSize: '2.5rem', fontWeight: 'bold',
      cursor: value ? 'default' : 'pointer',
      background: highlight ? '#ffe066' : '#fff',
      border: '3px solid #333', borderRadius: 8,
      color: value === 'X' ? '#e74c3c' : '#2980b9',
      transition: 'background 0.2s',
    }}>
      {value}
    </button>
  )
}

export default function TicTacToe({ onBack }) {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const result = calculateWinner(squares)
  const winLine = result?.line ?? []
  const isDraw = !result && squares.every(Boolean)

  function handleClick(i) {
    if (squares[i] || result) return
    const next = squares.slice()
    next[i] = xIsNext ? 'X' : 'O'
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  function reset() {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  let status
  if (result) status = `Winner: ${result.winner}`
  else if (isDraw) status = "It's a draw!"
  else status = `Next: ${xIsNext ? 'X' : 'O'}`

  const btn = (bg) => ({
    padding: '10px 28px', fontSize: '1rem', cursor: 'pointer',
    borderRadius: 8, border: 'none', background: bg, color: '#fff', fontWeight: 'bold',
  })

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 24 }}>
      <h1 style={{ margin: 0 }}>Tic-Tac-Toe</h1>
      <p style={{ fontSize: '1.25rem', margin: 0 }}>{status}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: 8 }}>
        {squares.map((sq, i) => (
          <Square key={i} value={sq} onClick={() => handleClick(i)} highlight={winLine.includes(i)} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button style={btn('#333')} onClick={reset}>Restart</button>
        <button style={btn('#888')} onClick={onBack}>← Back to games</button>
      </div>
    </main>
  )
}
