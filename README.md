# Tic-Tac-Toe

A two-player Tic-Tac-Toe game built with React 19 and Vite.

## Features

- Two-player gameplay — X always goes first, players alternate turns
- Win detection across all rows, columns, and diagonals
- Winning squares are highlighted in yellow
- Draw detection when the board fills with no winner
- Restart button to reset the game at any time

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
  App.jsx          # Root component
  HomePage.jsx     # Tic-Tac-Toe game (Square + board logic)
  App.css          # Global styles
  index.css        # Base reset
  main.jsx         # React entry point
```

## How to Play

1. The board starts empty. **X** goes first.
2. Click any empty square to place your mark.
3. The first player to get three in a row (horizontally, vertically, or diagonally) wins — their squares are highlighted.
4. If all nine squares are filled with no winner, the game ends in a draw.
5. Click **Restart** to start a new game.

## Tech Stack

| Tool | Version |
|------|---------|
| React | 19 |
| Vite | 6 |
| ESLint | 9 |
