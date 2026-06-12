# Game Room

A multi-game React app built with React 19 and Vite. Launch from a central game selection screen and choose between Blackjack or Tic-Tac-Toe.

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
- Standard card values apply: numbered cards at face value, face cards (J/Q/K) worth 10, Ace worth 11 or 1.
- Players aim to reach a hand total as close to 21 as possible without going over (busting).
- A natural **Blackjack** (Ace + 10-value card on the opening deal) beats all non-blackjack hands.
- At the end of each round, every non-dealer player's hand is compared against the dealer's — higher total wins.

#### How to Play

1. **Lobby** — each player enters their name and clicks **Join**. The first to join is labelled Dealer.
2. **Start** — once at least 2 players have joined, the dealer clicks **Start Game**.
3. **Dealing** — all non-dealer players receive 2 cards first; the dealer is dealt last.
4. **Turns** — a "pass the device" gate screen appears before each turn. The named player confirms their identity, then sees only their own cards.
5. **Hit or Stand** — the active player hits (draws a card) or stands (ends their turn). Busting or hitting Blackjack ends the turn automatically.
6. **Dealer's turn** — the dealer goes last and can see all other players' hands and totals when deciding to hit or stand.
7. **Results** — all hands are revealed with win/loss/tie outcome for each player. Only the dealer can start a **New Game** or return to the game selection screen.

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
4. Click **Restart** to reset the board and play again.

---

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| Vite | 6 |
| ESLint | 9 |
