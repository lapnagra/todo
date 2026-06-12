import { useState } from 'react'
import Blackjack from './Blackjack'
import TicTacToe from './TicTacToe'

const GAMES = [
  {
    id: 'blackjack',
    title: 'Blackjack',
    description: 'Multiplayer card game. A dealer manages the lobby, deals cards last, and sees all hands.',
    emoji: '🃏',
    bg: '#2c3e50',
  },
  {
    id: 'tictactoe',
    title: 'Tic-Tac-Toe',
    description: 'Two-player classic. Take turns placing X and O — first to get three in a row wins.',
    emoji: '⭕',
    bg: '#8e44ad',
  },
]

export default function HomePage() {
  const [selected, setSelected] = useState(null)

  if (selected === 'blackjack') return <Blackjack onBack={() => setSelected(null)} />
  if (selected === 'tictactoe') return <TicTacToe onBack={() => setSelected(null)} />

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 32, padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 8px' }}>Game Room</h1>
        <p style={{ color: '#666', margin: 0 }}>Choose a game to play</p>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {GAMES.map(game => (
          <button
            key={game.id}
            onClick={() => setSelected(game.id)}
            style={{
              width: 220, padding: '28px 20px', borderRadius: 16, border: 'none',
              background: game.bg, color: '#fff', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)', transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{game.emoji}</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: 8 }}>{game.title}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: 1.4 }}>{game.description}</div>
          </button>
        ))}
      </div>
    </main>
  )
}
