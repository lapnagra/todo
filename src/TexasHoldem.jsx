import { useState } from 'react'

// ===================== Deck =====================
const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const RANK_VAL = Object.fromEntries(RANKS.map((r, i) => [r, i + 2]))

function makeDeck() {
  const deck = SUITS.flatMap(s => RANKS.map(r => ({ suit: s, rank: r })))
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

// ===================== Hand Evaluation =====================
function combos5(arr) {
  const out = []
  const n = arr.length
  for (let a = 0; a < n - 4; a++)
  for (let b = a + 1; b < n - 3; b++)
  for (let c = b + 1; c < n - 2; c++)
  for (let d = c + 1; d < n - 1; d++)
  for (let e = d + 1; e < n; e++)
    out.push([arr[a], arr[b], arr[c], arr[d], arr[e]])
  return out
}

function score5(hand) {
  const vals = hand.map(c => RANK_VAL[c.rank]).sort((a, b) => b - a)
  const isFlush = new Set(hand.map(c => c.suit)).size === 1
  const isStraight =
    (new Set(vals).size === 5 && vals[0] - vals[4] === 4) ||
    (vals[0] === 14 && vals[1] === 5 && vals[2] === 4 && vals[3] === 3 && vals[4] === 2)
  const highStraight = vals[0] === 14 && vals[1] === 5 ? 5 : vals[0]

  const cnt = {}
  vals.forEach(v => (cnt[v] = (cnt[v] || 0) + 1))
  const groups = Object.entries(cnt)
    .map(([v, c]) => [+v, c])
    .sort((a, b) => b[1] - a[1] || b[0] - a[0])
  const gc = groups.map(g => g[1])
  const gv = groups.map(g => g[0])

  if (isFlush && isStraight) return { rank: 8, name: 'Straight Flush', tb: [highStraight] }
  if (gc[0] === 4) return { rank: 7, name: 'Four of a Kind', tb: gv }
  if (gc[0] === 3 && gc[1] === 2) return { rank: 6, name: 'Full House', tb: gv }
  if (isFlush) return { rank: 5, name: 'Flush', tb: vals }
  if (isStraight) return { rank: 4, name: 'Straight', tb: [highStraight] }
  if (gc[0] === 3) return { rank: 3, name: 'Three of a Kind', tb: gv }
  if (gc[0] === 2 && gc[1] === 2) return { rank: 2, name: 'Two Pair', tb: gv }
  if (gc[0] === 2) return { rank: 1, name: 'Pair', tb: gv }
  return { rank: 0, name: 'High Card', tb: vals }
}

function cmpScore(a, b) {
  if (a.rank !== b.rank) return a.rank - b.rank
  for (let i = 0; i < Math.min(a.tb.length, b.tb.length); i++) {
    if (a.tb[i] !== b.tb[i]) return a.tb[i] - b.tb[i]
  }
  return 0
}

function bestHand(hole, community) {
  if (community.length < 3) return null
  return combos5([...hole, ...community]).map(score5).sort(cmpScore).pop()
}

// ===================== Constants =====================
const STARTING_CHIPS = 1000
const SMALL_BLIND = 10
const BIG_BLIND = 20
const ROUND_ORDER = ['preflop', 'flop', 'turn', 'river']
const ROUND_LABELS = { preflop: 'Pre-Flop', flop: 'Flop', turn: 'Turn', river: 'River' }

// ===================== Styles =====================
const btn = (bg, disabled) => ({
  padding: '10px 24px', fontSize: '1rem', cursor: disabled ? 'not-allowed' : 'pointer',
  borderRadius: 8, border: 'none', background: disabled ? '#999' : bg,
  color: '#fff', fontWeight: 'bold', opacity: disabled ? 0.6 : 1,
})

// ===================== PlayingCard =====================
function PlayingCard({ card, faceDown }) {
  if (faceDown) return (
    <div style={{
      width: 55, height: 80, borderRadius: 6, border: '2px solid #555', flexShrink: 0,
      background: 'repeating-linear-gradient(45deg,#1a5276,#1a5276 5px,#154360 5px,#154360 10px)',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
    }} />
  )
  const red = card.suit === '♥' || card.suit === '♦'
  return (
    <div style={{
      width: 55, height: 80, borderRadius: 6, border: '2px solid #555', background: '#fff',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '3px 5px', fontSize: '0.9rem', fontWeight: 'bold', flexShrink: 0,
      color: red ? '#c0392b' : '#111', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    }}>
      <span>{card.rank}{card.suit}</span>
      <span style={{ alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>{card.rank}{card.suit}</span>
    </div>
  )
}

// ===================== Lobby =====================
function Lobby({ players, onJoin, onStart, onBack }) {
  const [name, setName] = useState('')
  const full = players.length >= 4
  const duplicate = name.trim() && players.some(p => p.name.toLowerCase() === name.trim().toLowerCase())

  function join(e) {
    e.preventDefault()
    if (!name.trim() || duplicate || full) return
    onJoin(name.trim())
    setName('')
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 24, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Texas Hold'em</h1>
      <div style={{ background: '#f4f4f4', borderRadius: 12, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 4px' }}>Game Lobby</h2>
        <p style={{ margin: '0 0 16px', color: '#666', fontSize: '0.9rem' }}>Exactly 4 players · {STARTING_CHIPS} chips each · Blinds {SMALL_BLIND}/{BIG_BLIND}</p>
        {!full && (
          <form onSubmit={join} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
              style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '2px solid #ccc', fontSize: '1rem' }} />
            <button type="submit" style={btn('#2c3e50', !name.trim() || duplicate)}>Join</button>
          </form>
        )}
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px' }}>
          {[0, 1, 2, 3].map(i => (
            <li key={i} style={{ padding: '8px 12px', background: players[i] ? '#fff' : '#eee', borderRadius: 8, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: players[i] ? '#111' : '#bbb', boxShadow: players[i] ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              <span style={{ fontWeight: players[i] ? 'bold' : 'normal' }}>{players[i]?.name ?? `Seat ${i + 1}`}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {players[i] && i === 0 && <span style={{ fontSize: '0.75rem', background: '#e67e22', color: '#fff', padding: '2px 8px', borderRadius: 10 }}>Dealer</span>}
                <span style={{ fontSize: '0.85rem', color: '#999' }}>{players[i] ? `${STARTING_CHIPS} chips` : 'waiting…'}</span>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ borderTop: '1px solid #ddd', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button style={btn('#888')} onClick={onBack}>← Back</button>
          <button style={btn('#27ae60', players.length < 4)} disabled={players.length < 4} onClick={onStart}>Start Game</button>
        </div>
      </div>
    </main>
  )
}

// ===================== Gate =====================
function Gate({ player, round, onReveal }) {
  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 24, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Texas Hold'em</h1>
      <div style={{ background: '#f4f4f4', borderRadius: 12, padding: 32, textAlign: 'center', maxWidth: 360, width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#888', margin: '0 0 6px', fontSize: '0.9rem' }}>{ROUND_LABELS[round]}</p>
        <p style={{ fontSize: '1.1rem', margin: '0 0 8px' }}>Pass the device to</p>
        <h2 style={{ margin: '0 0 6px', fontSize: '2rem' }}>{player.name}</h2>
        <p style={{ color: '#888', margin: '0 0 24px', fontSize: '0.9rem' }}>{player.chips} chips</p>
        <button style={btn('#2c3e50')} onClick={onReveal}>I'm {player.name} — show my cards</button>
      </div>
    </main>
  )
}

// ===================== Action Screen =====================
function ActionScreen({ player, players, community, pot, currentBet, bettingRound, dealerIdx, onFold, onCheck, onCall, onRaise }) {
  const toCall = Math.min(currentBet - player.roundContrib, player.chips)
  const canCheck = currentBet === player.roundContrib
  const minRaise = Math.max(currentBet + BIG_BLIND, currentBet * 2)
  const maxRaise = player.chips + player.roundContrib
  const canRaise = maxRaise > currentBet
  const [raiseAmt, setRaiseAmt] = useState(() => Math.min(minRaise, maxRaise))
  const effectiveRaise = Math.max(minRaise, Math.min(raiseAmt, maxRaise))
  const hand = bestHand(player.hand, community)

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 16, padding: 24, paddingTop: 32 }}>
      <h1 style={{ margin: 0 }}>Texas Hold'em — {ROUND_LABELS[bettingRound]}</h1>

      {/* Community cards */}
      <div style={{ width: '100%', maxWidth: 580 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#555' }}>Community Cards</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {community.map((c, i) => <PlayingCard key={i} card={c} />)}
          {Array(5 - community.length).fill(null).map((_, i) => (
            <div key={i} style={{ width: 55, height: 80, borderRadius: 6, border: '2px dashed #ddd', flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* Other players */}
      <div style={{ width: '100%', maxWidth: 580 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#555' }}>Table</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {players.map((p, i) => {
            if (p.name === player.name) return null
            const isDealer = i === dealerIdx
            return (
              <div key={p.name} style={{ background: p.folded ? '#f0f0f0' : '#fff', borderRadius: 10, padding: '10px 14px', border: isDealer ? '2px solid #e67e22' : '2px solid #eee', opacity: p.folded ? 0.5 : 1, minWidth: 110 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{p.name} {isDealer ? '🎯' : ''}</div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>{p.folded ? 'Folded' : `${p.chips} chips`}</div>
                {!p.folded && p.roundContrib > 0 && <div style={{ color: '#e67e22', fontSize: '0.8rem' }}>Bet: {p.roundContrib}</div>}
                {p.allIn && <div style={{ color: '#c0392b', fontSize: '0.8rem', fontWeight: 'bold' }}>ALL IN</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pot */}
      <div style={{ background: '#2c3e50', color: '#fff', borderRadius: 10, padding: '10px 24px', display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span>Pot: <strong>{pot}</strong></span>
        {currentBet > 0 && <span>Current bet: <strong>{currentBet}</strong></span>}
        {toCall > 0 && <span style={{ color: '#f39c12' }}>To call: <strong>{toCall}</strong></span>}
      </div>

      {/* Player's hand */}
      <div style={{ width: '100%', maxWidth: 580 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
          Your hand — {player.chips} chips
          {player.roundContrib > 0 && <span style={{ color: '#e67e22', fontWeight: 'normal' }}> (bet {player.roundContrib})</span>}
          {hand && <span style={{ marginLeft: 10, color: '#27ae60', fontWeight: 'normal' }}>{hand.name}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {player.hand.map((c, i) => <PlayingCard key={i} card={c} />)}
        </div>
      </div>

      {/* Actions */}
      <div style={{ width: '100%', maxWidth: 580, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={btn('#c0392b')} onClick={onFold}>Fold</button>
          {canCheck
            ? <button style={btn('#27ae60')} onClick={onCheck}>Check</button>
            : <button style={btn('#27ae60')} onClick={() => onCall(toCall)}>Call {toCall}</button>
          }
          {canRaise && (
            <button style={btn('#e67e22')} onClick={() => onRaise(effectiveRaise)}>
              {effectiveRaise >= maxRaise ? `All In (${maxRaise})` : `Raise to ${effectiveRaise}`}
            </button>
          )}
        </div>
        {canRaise && minRaise < maxRaise && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#888', whiteSpace: 'nowrap' }}>Raise amount:</span>
            <input type="range" min={minRaise} max={maxRaise} step={BIG_BLIND}
              value={effectiveRaise} onChange={e => setRaiseAmt(+e.target.value)} style={{ flex: 1 }} />
            <span style={{ minWidth: 70, fontSize: '0.9rem', textAlign: 'right' }}>{effectiveRaise} chips</span>
          </div>
        )}
      </div>
    </main>
  )
}

// ===================== Showdown =====================
function Showdown({ players, community, pot, onNewHand, onBack }) {
  const active = players.filter(p => !p.folded)
  let winners
  if (active.length === 1) {
    winners = [active[0].name]
  } else {
    const scored = active.map(p => ({ name: p.name, best: bestHand(p.hand, community) }))
    const top = scored.reduce((a, b) => cmpScore(a.best, b.best) >= 0 ? a : b).best
    winners = scored.filter(p => cmpScore(p.best, top) === 0).map(p => p.name)
  }
  const share = Math.floor(pot / winners.length)

  return (
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', gap: 20, padding: 24 }}>
      <h1 style={{ margin: 0 }}>Showdown</h1>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#555' }}>Community Cards</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {community.map((c, i) => <PlayingCard key={i} card={c} />)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 560 }}>
        {players.map(p => {
          const isWinner = winners.includes(p.name)
          const hand = !p.folded && community.length >= 3 ? bestHand(p.hand, community) : null
          return (
            <div key={p.name} style={{ background: isWinner ? '#eafaf1' : p.folded ? '#fafafa' : '#f4f4f4', borderRadius: 12, padding: 16, border: `2px solid ${isWinner ? '#27ae60' : 'transparent'}`, boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {p.name} {isWinner ? '🏆' : ''}
                  {p.folded && <span style={{ color: '#aaa', fontWeight: 'normal', fontSize: '0.9rem' }}> (folded)</span>}
                </span>
                <div style={{ textAlign: 'right' }}>
                  {hand && <div style={{ color: '#27ae60', fontSize: '0.85rem' }}>{hand.name}</div>}
                  {isWinner && <div style={{ color: '#27ae60', fontWeight: 'bold' }}>+{share} chips</div>}
                </div>
              </div>
              {!p.folded && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {p.hand.map((c, i) => <PlayingCard key={i} card={c} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 16 }}>
          {winners.length === 1
            ? `${winners[0]} wins ${pot} chips!`
            : `Split pot — ${winners.join(' & ')} each win ${share} chips!`}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button style={btn('#2c3e50')} onClick={onNewHand}>Next Hand</button>
          <button style={btn('#888')} onClick={onBack}>← Back to games</button>
        </div>
      </div>
    </main>
  )
}

// ===================== Main =====================
function buildGameState(players, dealerIdx, deck, community, pot, currentBet, bettingRound, actionQueue) {
  return { phase: 'betting', subPhase: 'gate', bettingRound, players, deck, community, pot, currentBet, dealerIdx, actionQueue }
}

export default function TexasHoldem({ onBack }) {
  const [names, setNames] = useState([])
  const [game, setGame] = useState(null)

  function joinLobby(name) {
    setNames(n => [...n, name])
  }

  function initHand(playerBases, dealerIdx) {
    const deck = makeDeck()
    const sbIdx = (dealerIdx + 1) % 4
    const bbIdx = (dealerIdx + 2) % 4
    const utgIdx = (dealerIdx + 3) % 4

    const players = playerBases.map((p, i) => {
      const blind = i === sbIdx ? SMALL_BLIND : i === bbIdx ? BIG_BLIND : 0
      return { ...p, hand: [deck.pop(), deck.pop()], folded: false, roundContrib: blind, allIn: false, chips: p.chips - blind }
    })

    setGame(buildGameState(
      players, dealerIdx, deck, [],
      SMALL_BLIND + BIG_BLIND, BIG_BLIND, 'preflop',
      [utgIdx, dealerIdx, sbIdx, bbIdx],
    ))
  }

  function startGame() {
    initHand(names.map(name => ({ name, chips: STARTING_CHIPS })), 0)
  }

  if (!game) {
    return <Lobby players={names.map(n => ({ name: n }))} onJoin={joinLobby} onStart={startGame} onBack={onBack} />
  }

  const { phase, subPhase, bettingRound, players, deck, community, pot, currentBet, dealerIdx, actionQueue } = game

  function handleNewHand() {
    const active = players.filter(p => !p.folded)
    let winnerNames
    if (active.length === 1) {
      winnerNames = [active[0].name]
    } else {
      const scored = active.map(p => ({ name: p.name, best: bestHand(p.hand, community) }))
      const top = scored.reduce((a, b) => cmpScore(a.best, b.best) >= 0 ? a : b).best
      winnerNames = scored.filter(p => cmpScore(p.best, top) === 0).map(p => p.name)
    }
    const share = Math.floor(pot / winnerNames.length)
    const updatedBases = players.map(p => ({
      name: p.name,
      chips: p.chips + (winnerNames.includes(p.name) ? share : 0),
    }))
    initHand(updatedBases, (dealerIdx + 1) % 4)
  }

  if (phase === 'showdown') {
    return <Showdown players={players} community={community} pot={pot} onNewHand={handleNewHand} onBack={onBack} />
  }

  const actorIdx = actionQueue[0]
  const actor = players[actorIdx]

  if (subPhase === 'gate') {
    return <Gate player={actor} round={bettingRound} onReveal={() => setGame(g => ({ ...g, subPhase: 'action' }))} />
  }

  // ---- Betting action handlers ----
  function afterAction(updatedPlayers, newPot, newCurrentBet, newQueue) {
    const nonFolded = updatedPlayers.filter(p => !p.folded)
    if (nonFolded.length === 1) {
      setGame(g => ({ ...g, phase: 'showdown', players: updatedPlayers, pot: newPot }))
      return
    }
    if (newQueue.length === 0) {
      endBettingRound(updatedPlayers, newPot)
    } else {
      setGame(g => ({ ...g, players: updatedPlayers, pot: newPot, currentBet: newCurrentBet, actionQueue: newQueue, subPhase: 'gate' }))
    }
  }

  function endBettingRound(updatedPlayers, finalPot) {
    const nextRoundIdx = ROUND_ORDER.indexOf(bettingRound) + 1
    if (nextRoundIdx >= ROUND_ORDER.length) {
      setGame(g => ({ ...g, phase: 'showdown', players: updatedPlayers, pot: finalPot }))
      return
    }
    const nextRound = ROUND_ORDER[nextRoundIdx]
    const newDeck = [...deck]
    let newCommunity = [...community]
    if (nextRound === 'flop') newCommunity = [newDeck.pop(), newDeck.pop(), newDeck.pop()]
    else newCommunity.push(newDeck.pop())

    const resetPlayers = updatedPlayers.map(p => ({ ...p, roundContrib: 0 }))
    const queue = []
    for (let i = 1; i <= 4; i++) {
      const idx = (dealerIdx + i) % 4
      if (!resetPlayers[idx].folded && !resetPlayers[idx].allIn) queue.push(idx)
    }

    setGame(buildGameState(resetPlayers, dealerIdx, newDeck, newCommunity, finalPot, 0, nextRound, queue))
  }

  function handleFold() {
    const updated = players.map((p, i) => i === actorIdx ? { ...p, folded: true } : p)
    afterAction(updated, pot, currentBet, actionQueue.slice(1))
  }

  function handleCheck() {
    afterAction(players, pot, currentBet, actionQueue.slice(1))
  }

  function handleCall(amount) {
    const updated = players.map((p, i) => i === actorIdx
      ? { ...p, chips: p.chips - amount, roundContrib: p.roundContrib + amount, allIn: p.chips - amount === 0 }
      : p)
    afterAction(updated, pot + amount, currentBet, actionQueue.slice(1))
  }

  function handleRaise(totalBet) {
    const additional = Math.min(totalBet - actor.roundContrib, actor.chips)
    const newTotal = actor.roundContrib + additional
    const updated = players.map((p, i) => i === actorIdx
      ? { ...p, chips: p.chips - additional, roundContrib: newTotal, allIn: p.chips - additional === 0 }
      : p)
    // All other active players must act again, clockwise from raiser
    const newQueue = []
    for (let i = 1; i <= 4; i++) {
      const idx = (actorIdx + i) % 4
      if (!updated[idx].folded && !updated[idx].allIn) newQueue.push(idx)
    }
    afterAction(updated, pot + additional, newTotal, newQueue)
  }

  return (
    <ActionScreen
      key={actor.name + bettingRound + actionQueue.length}
      player={actor}
      players={players}
      community={community}
      pot={pot}
      currentBet={currentBet}
      bettingRound={bettingRound}
      dealerIdx={dealerIdx}
      onFold={handleFold}
      onCheck={handleCheck}
      onCall={handleCall}
      onRaise={handleRaise}
    />
  )
}
