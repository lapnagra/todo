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

const btn = (bg, disabled) => ({
  padding: '10px 28px', fontSize: '1rem', cursor: disabled ? 'not-allowed' : 'pointer',
  borderRadius: 8, border: 'none', background: disabled ? '#aaa' : bg,
  color: '#fff', fontWeight: 'bold', opacity: disabled ? 0.6 : 1,
})

function Card({ card }) {
  const red = card.suit === '♥' || card.suit === '♦'
  return (
    <div style={{
      width: 60, height: 90, border: '2px solid #555', borderRadius: 8, background: '#fff',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '4px 6px', fontSize: '1rem', fontWeight: 'bold',
      color: red ? '#c0392b' : '#222', boxShadow: '2px 2px 6px rgba(0,0,0,0.2)', flexShrink: 0,
    }}>
      <span>{card.rank}{card.suit}</span>
      <span style={{ alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>{card.rank}{card.suit}</span>
    </div>
  )
}

function NameEntry({ players, onJoin, onStart, onBack, maxPlayers = 6 }) {
  const [name, setName] = useState('')
  const canStart = players.length >= 2
  const full = players.length >= maxPlayers
  const alreadyJoined = name.trim() && players.some(p => p.name.toLowerCase() === name.trim().toLowerCase())

  function join(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || alreadyJoined) return
    onJoin(trimmed)
    setName('')
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 24, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Blackjack</h1>
      <div style={{ background: '#f4f4f4', borderRadius: 12, padding: 28, width: '100%', maxWidth: 400, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 16px' }}>Game Lobby</h2>
        {!full && (
          <form onSubmit={join} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '2px solid #ccc', fontSize: '1rem' }}
            />
            <button type="submit" style={btn('#2c3e50', !name.trim() || alreadyJoined)}>Join</button>
          </form>
        )}
        {players.length === 0 ? (
          <p style={{ color: '#888', margin: 0 }}>No players yet. Be the first to join — you'll be the dealer.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
            {players.map((p, i) => (
              <li key={p.name} style={{ padding: '8px 12px', background: '#fff', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <span>{p.name}</span>
                {i === 0 && <span style={{ fontSize: '0.8rem', background: '#2c3e50', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>Dealer</span>}
              </li>
            ))}
          </ul>
        )}
        {players.length > 0 && (
          <div style={{ borderTop: '1px solid #ddd', paddingTop: 16 }}>
            <p style={{ margin: '0 0 12px', color: '#555', fontSize: '0.9rem' }}>
              {players[0].name} (dealer) starts the game when everyone has joined.
            </p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: '#888' }}>Dealer only:</span>
              <button style={btn('#27ae60', !canStart)} disabled={!canStart} onClick={onStart}>Start Game</button>
            </div>
            {!canStart && <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: '8px 0 0' }}>Need at least 2 players to start.</p>}
          </div>
        )}
      </div>
      <button style={{ ...btn('#888'), marginTop: 8 }} onClick={onBack}>← Back to games</button>
    </main>
  )
}

function PlayerTurnGate({ player, onReveal }) {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 24, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Blackjack</h1>
      <div style={{ background: '#f4f4f4', borderRadius: 12, padding: 32, textAlign: 'center', maxWidth: 360, width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: 8 }}>Pass the device to</p>
        <h2 style={{ margin: '0 0 24px', fontSize: '2rem' }}>{player.name}</h2>
        <button style={btn('#2c3e50')} onClick={onReveal}>I'm {player.name} — show my cards</button>
      </div>
    </main>
  )
}

function PlayerTurn({ player, isDealer, allPlayers, onHit, onStand }) {
  const total = handTotal(player.hand)
  const bust = isBust(player.hand)
  const bj = isBlackjack(player.hand)

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 20, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Blackjack</h1>
      <div style={{ background: '#2c3e50', color: '#fff', padding: '8px 20px', borderRadius: 20, fontSize: '1.1rem' }}>
        {player.name}'s turn {isDealer ? '(Dealer)' : ''}
      </div>
      {isDealer && allPlayers.filter(p => p.name !== player.name).length > 0 && (
        <div style={{ width: '100%', maxWidth: 560 }}>
          <h3 style={{ margin: '0 0 10px', color: '#555' }}>All player hands</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allPlayers.filter(p => p.name !== player.name).map(p => {
              const pt = handTotal(p.hand)
              const pb = isBust(p.hand)
              const pbj = isBlackjack(p.hand)
              return (
                <div key={p.name} style={{ background: '#f4f4f4', borderRadius: 10, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    {p.name} — <span style={{ color: pb ? '#c0392b' : '#333' }}>{pb ? 'BUST' : pbj ? 'BLACKJACK!' : `Total: ${pt}`}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {p.hand.map((card, i) => <Card key={i} card={card} />)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Your hand — {bust ? 'BUST' : bj ? 'BLACKJACK!' : `Total: ${total}`}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {player.hand.map((card, i) => <Card key={i} card={card} />)}
        </div>
      </div>
      {!bust && !bj && (
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={btn('#27ae60')} onClick={onHit}>Hit</button>
          <button style={btn('#e67e22')} onClick={onStand}>Stand</button>
        </div>
      )}
      {(bust || bj) && (
        <p style={{ color: bust ? '#c0392b' : '#27ae60', fontWeight: 'bold', fontSize: '1.1rem' }}>
          {bust ? 'You busted! Your turn is over.' : 'Blackjack! Your turn is over.'}
        </p>
      )}
    </main>
  )
}

function Results({ players, onNewGame, onBack }) {
  const dealer = players[0]
  const dealerTotal = handTotal(dealer.hand)
  const dealerBust = isBust(dealer.hand)

  function outcome(player) {
    const pt = handTotal(player.hand)
    const pb = isBust(player.hand)
    const pbj = isBlackjack(player.hand)
    const dbj = isBlackjack(dealer.hand)
    if (pb) return { label: 'Bust', color: '#c0392b' }
    if (pbj && dbj) return { label: 'Tie (both Blackjack)', color: '#888' }
    if (pbj) return { label: 'Blackjack! Win', color: '#27ae60' }
    if (dealerBust) return { label: 'Win (dealer bust)', color: '#27ae60' }
    if (dbj) return { label: 'Loss (dealer Blackjack)', color: '#c0392b' }
    if (pt > dealerTotal) return { label: `Win (${pt} vs ${dealerTotal})`, color: '#27ae60' }
    if (pt < dealerTotal) return { label: `Loss (${pt} vs ${dealerTotal})`, color: '#c0392b' }
    return { label: `Tie (${pt})`, color: '#888' }
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 20, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Results</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 500 }}>
        {players.map((p, i) => {
          const total = handTotal(p.hand)
          const bust = isBust(p.hand)
          const bj = isBlackjack(p.hand)
          const result = i === 0 ? null : outcome(p)
          return (
            <div key={p.name} style={{ background: '#f4f4f4', borderRadius: 12, padding: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{p.name} {i === 0 ? '(Dealer)' : ''}</span>
                {result
                  ? <span style={{ fontWeight: 'bold', color: result.color }}>{result.label}</span>
                  : <span style={{ color: '#555' }}>{bust ? 'BUST' : bj ? 'BLACKJACK!' : `Total: ${total}`}</span>
                }
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {p.hand.map((card, ci) => <Card key={ci} card={card} />)}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#555', margin: '0 0 12px', fontSize: '0.9rem' }}>Dealer only:</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button style={btn('#2c3e50')} onClick={onNewGame}>New Game</button>
          <button style={btn('#888')} onClick={onBack}>← Back to games</button>
        </div>
      </div>
    </main>
  )
}

export default function Blackjack({ onBack }) {
  const [phase, setPhase] = useState('lobby')
  const [players, setPlayers] = useState([])
  const [deck, setDeck] = useState([])
  const [turnOrder, setTurnOrder] = useState([])
  const [turnStep, setTurnStep] = useState(0)

  function joinLobby(name) {
    setPlayers(prev => [...prev, { name, hand: [], done: false }])
  }

  function startGame() {
    const newDeck = makeDeck()
    const order = [...players.slice(1).map((_, i) => i + 1), 0]
    const dealt = players.map(p => ({ ...p, hand: [], done: false }))
    order.forEach(i => { dealt[i] = { ...dealt[i], hand: [newDeck.pop(), newDeck.pop()] } })
    setDeck(newDeck)
    setPlayers(dealt)
    setTurnOrder(order)
    setTurnStep(0)
    setPhase('gate')
  }

  const currentPlayerIndex = turnOrder[turnStep]

  function advanceTurn(updatedPlayers) {
    const next = turnStep + 1
    if (next >= turnOrder.length) { setPlayers(updatedPlayers); setPhase('done') }
    else { setPlayers(updatedPlayers); setTurnStep(next); setPhase('gate') }
  }

  function hit() {
    const newDeck = [...deck]
    const card = newDeck.pop()
    setDeck(newDeck)
    setPlayers(players.map((p, i) => i === currentPlayerIndex ? { ...p, hand: [...p.hand, card] } : p))
  }

  function stand() {
    advanceTurn(players.map((p, i) => i === currentPlayerIndex ? { ...p, done: true } : p))
  }

  function continueTurn() {
    advanceTurn(players.map((p, i) => i === currentPlayerIndex ? { ...p, done: true } : p))
  }

  function newGame() {
    setPlayers(players.map(p => ({ ...p, hand: [], done: false })))
    setTurnOrder([])
    setTurnStep(0)
    setPhase('lobby')
  }

  if (phase === 'lobby') return <NameEntry players={players} onJoin={joinLobby} onStart={startGame} onBack={onBack} />
  if (phase === 'gate') return <PlayerTurnGate player={players[currentPlayerIndex]} onReveal={() => setPhase('playing')} />
  if (phase === 'playing') {
    const player = players[currentPlayerIndex]
    const bust = isBust(player.hand)
    const bj = isBlackjack(player.hand)
    return (
      <div>
        <PlayerTurn player={player} isDealer={currentPlayerIndex === 0} allPlayers={players} onHit={hit} onStand={stand} />
        {(bust || bj) && (
          <div style={{ position: 'fixed', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <button style={btn('#2c3e50')} onClick={continueTurn}>Continue →</button>
          </div>
        )}
      </div>
    )
  }
  if (phase === 'done') return <Results players={players} onNewGame={newGame} onBack={onBack} />
}
