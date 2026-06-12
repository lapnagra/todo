import { useState } from 'react'

const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function makeDeck() {
  const deck = SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank })))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function cardValue(rank) {
  if (rank === 'A') return 11
  if (['J', 'Q', 'K'].includes(rank)) return 10
  return parseInt(rank)
}

function handTotal(hand) {
  let total = hand.reduce((sum, c) => sum + cardValue(c.rank), 0)
  let aces = hand.filter(c => c.rank === 'A').length
  while (total > 21 && aces > 0) { total -= 10; aces-- }
  return total
}

function isBust(hand) { return handTotal(hand) > 21 }
function isBlackjack(hand) { return hand.length === 2 && handTotal(hand) === 21 }

function Card({ card, hidden }) {
  const red = card.suit === '♥' || card.suit === '♦'
  return (
    <div style={{
      width: 60, height: 90, border: '2px solid #555', borderRadius: 8,
      background: hidden ? '#1a6b3a' : '#fff',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '4px 6px', fontSize: '1rem', fontWeight: 'bold',
      color: hidden ? 'transparent' : (red ? '#c0392b' : '#222'),
      boxShadow: '2px 2px 6px rgba(0,0,0,0.2)', flexShrink: 0,
    }}>
      {!hidden && <><span>{card.rank}{card.suit}</span><span style={{ alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>{card.rank}{card.suit}</span></>}
    </div>
  )
}

function Hand({ hand, hideSecond, label, total, bust, blackjack }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: 6, fontWeight: 'bold', fontSize: '1.1rem' }}>
        {label}
        {!hideSecond && <span style={{ marginLeft: 8, fontWeight: 'normal', color: bust ? '#c0392b' : '#333' }}>
          {bust ? 'BUST' : blackjack ? 'BLACKJACK!' : `(${total})`}
        </span>}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {hand.map((card, i) => <Card key={i} card={card} hidden={hideSecond && i === 1} />)}
      </div>
    </div>
  )
}

function initGame() {
  const deck = makeDeck()
  const p1 = [deck.pop(), deck.pop()]
  const p2 = [deck.pop(), deck.pop()]
  return { deck, p1, p2, turn: 1, p1Done: false, p2Done: false, phase: 'playing' }
}

function getResult(state) {
  const t1 = handTotal(state.p1)
  const t2 = handTotal(state.p2)
  const b1 = isBust(state.p1)
  const b2 = isBust(state.p2)
  const bj1 = isBlackjack(state.p1)
  const bj2 = isBlackjack(state.p2)
  if (b1 && b2) return 'Both bust — tie!'
  if (b1) return 'Player 1 busts — Player 2 wins!'
  if (b2) return 'Player 2 busts — Player 1 wins!'
  if (bj1 && bj2) return 'Both have Blackjack — tie!'
  if (bj1) return 'Player 1 wins with Blackjack!'
  if (bj2) return 'Player 2 wins with Blackjack!'
  if (t1 > t2) return `Player 1 wins! (${t1} vs ${t2})`
  if (t2 > t1) return `Player 2 wins! (${t2} vs ${t1})`
  return `Tie! Both have ${t1}`
}

export default function HomePage() {
  const [game, setGame] = useState(() => initGame())

  const { deck, p1, p2, turn, p1Done, p2Done, phase } = game
  const currentHand = turn === 1 ? p1 : p2

  function hit() {
    if (phase !== 'playing') return
    const newDeck = [...deck]
    const card = newDeck.pop()
    const newHand = [...currentHand, card]
    const bust = isBust(newHand)
    if (turn === 1) {
      const nowDone = bust
      setGame(g => ({ ...g, deck: newDeck, p1: newHand, p1Done: nowDone, turn: nowDone ? 2 : 1, phase: (nowDone && g.p2Done) ? 'done' : 'playing' }))
    } else {
      setGame(g => ({ ...g, deck: newDeck, p2: newHand, p2Done: bust, phase: (g.p1Done && bust) ? 'done' : 'playing' }))
    }
  }

  function stand() {
    if (phase !== 'playing') return
    if (turn === 1) {
      setGame(g => ({ ...g, p1Done: true, turn: 2, phase: g.p2Done ? 'done' : 'playing' }))
    } else {
      setGame(g => ({ ...g, p2Done: true, phase: 'done' }))
    }
  }

  // Recalculate after state updates by deriving from game
  const isDone = phase === 'done' || (p1Done && p2Done)
  const result = isDone ? getResult({ p1, p2 }) : null

  const btnStyle = (color) => ({
    padding: '10px 28px', fontSize: '1rem', cursor: 'pointer',
    borderRadius: 8, border: 'none', background: color, color: '#fff', fontWeight: 'bold',
  })

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 20, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Blackjack</h1>

      {!isDone && (
        <div style={{ fontSize: '1.1rem', background: '#2c3e50', color: '#fff', padding: '8px 20px', borderRadius: 20 }}>
          Player {turn}'s turn
        </div>
      )}

      <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div>
          <Hand
            hand={p1} label="Player 1"
            hideSecond={!p1Done && turn === 2 && !isDone}
            total={handTotal(p1)} bust={isBust(p1)} blackjack={isBlackjack(p1)}
          />
        </div>
        <div>
          <Hand
            hand={p2} label="Player 2"
            hideSecond={!p2Done && turn === 1 && !isDone}
            total={handTotal(p2)} bust={isBust(p2)} blackjack={isBlackjack(p2)}
          />
        </div>
      </div>

      {!isDone && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={btnStyle('#27ae60')} onClick={hit}>Hit</button>
          <button style={btnStyle('#e67e22')} onClick={stand}>Stand</button>
        </div>
      )}

      {isDone && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 16 }}>{result}</div>
          <button style={btnStyle('#2c3e50')} onClick={() => setGame(initGame())}>New Game</button>
        </div>
      )}
    </main>
  )
}
