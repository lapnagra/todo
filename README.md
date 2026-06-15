# Game Room

A multi-game React app built with React 19 and Vite. Launch from a central game selection screen and choose from three games: Blackjack, Tic-Tac-Toe, or Texas Hold'em Poker.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output is placed in the `dist/` directory.

## Project Structure

```
src/
  App.jsx          # Root component — renders HomePage
  HomePage.jsx     # Game selection screen
  Blackjack.jsx    # Multiplayer Blackjack game
  TicTacToe.jsx    # Two-player Tic-Tac-Toe game
  TexasHoldem.jsx  # 4-player Texas Hold'em poker game
  App.css          # Global styles
  index.css        # Base reset
  main.jsx         # React entry point
```

---

## Games

### Blackjack

A pass-the-device multiplayer Blackjack game supporting 2–6 players.

#### Rules

- The first player to join the lobby becomes the **dealer**.
- Standard card values: numbered cards at face value, face cards (J/Q/K) worth 10, Ace worth 11 or 1 (whichever avoids busting).
- Players aim to get as close to 21 as possible without going over (busting).
- A natural **Blackjack** (Ace + 10-value card on the initial deal) beats all non-blackjack hands.
- Each non-dealer player's hand is compared against the dealer's at the end — higher total wins.

#### How to Play

1. **Lobby** — each player enters their name and clicks **Join**. The first to join is labelled Dealer.
2. **Start** — once at least 2 players have joined, the dealer clicks **Start Game**.
3. **Dealing** — all non-dealer players receive 2 cards first; the dealer is dealt last.
4. **Turns** — a pass-the-device gate screen appears before each turn. The named player confirms their identity, then sees only their own cards.
5. **Hit or Stand** — the active player hits (draws a card) or stands (ends their turn). Busting or hitting Blackjack ends the turn automatically.
6. **Dealer's turn** — the dealer goes last and can see all other players' hands and totals when deciding to hit or stand.
7. **Results** — all hands are revealed with win/loss/tie outcome per player. Only the dealer can start a **New Game** or return to the selection screen.

---

### Tic-Tac-Toe

A classic two-player game on a 3×3 grid.

#### Rules

- Players take turns placing their mark — **X** always goes first.
- The first player to get three marks in a row (horizontally, vertically, or diagonally) wins.
- If all nine squares are filled with no winner, the game ends in a draw.

#### How to Play

1. The board starts empty — click any square to place your mark.
2. Players alternate turns until there is a winner or a draw.
3. Winning squares are highlighted in yellow.
4. Click **Restart** to reset the board, or **← Back to games** to return to the selection screen.

---

### Texas Hold'em Poker

A full pass-the-device 4-player Texas Hold'em poker game with blinds, community cards, and multi-round betting.

#### Setup

- Exactly 4 players are required.
- Each player starts with **1,000 chips**.
- Blinds: small blind **10**, big blind **20**.
- The dealer button rotates clockwise after each hand.

#### Rules

- Each player is dealt 2 private hole cards.
- 5 community cards are revealed in stages: **Flop** (3 cards), **Turn** (1 card), **River** (1 card).
- The best 5-card hand from any combination of hole cards and community cards wins.
- Hand rankings (low to high): High Card, Pair, Two Pair, Three of a Kind, Straight, Flush, Full House, Four of a Kind, Straight Flush.
- Ties split the pot equally.

#### Betting Rounds

| Round | Community Cards | First to Act |
|-------|----------------|--------------|
| Pre-Flop | None | Left of big blind (UTG) |
| Flop | 3 cards revealed | Left of dealer |
| Turn | 4th card revealed | Left of dealer |
| River | 5th card revealed | Left of dealer |

On each turn a player may:
- **Fold** — discard their hand and forfeit any chips bet.
- **Check** — pass the action (only when no bet is outstanding).
- **Call** — match the current bet.
- **Raise** — increase the bet using the slider (min raise = current bet + big blind; max = all in).

#### How to Play

1. **Lobby** — all 4 players enter their names. Player 1 is the initial dealer.
2. **Start Game** — the lobby shows the Start button once all 4 seats are filled.
3. **Dealing** — each player receives 2 hole cards. Blinds are posted automatically.
4. **Turns** — a pass-the-device gate screen appears before each player acts. The named player confirms their identity, then sees their hole cards, the community cards, and the current pot.
5. **Betting** — players act in order each round. A raise restarts the action so all remaining players must respond.
6. **Showdown** — after the river (or when all but one player folds), all remaining hands are revealed, the winner is announced, and chips are awarded.
7. **Next Hand** — click **Next Hand** to deal again with the rotated dealer button. Click **← Back to games** to exit.

---

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| Vite | 6 |
| ESLint | 9 |
