# Chess Engine Adapters

## Overview

React-native-chessground provides a **clean adapter interface** that allows you to integrate any chess engine without creating a dependency on specific libraries like chess.js or chessops.

The library defines the `ChessEngineAdapter` interface, and you implement it for your chosen engine.

## Architecture

```
┌─────────────────────────┐
│   Your Chess Engine     │
│   (chess.js, chessops)  │
└───────────┬─────────────┘
            │
            │ implements
            ▼
┌─────────────────────────┐
│  ChessEngineAdapter     │◄──── Interface defined by
│  - getValidMoves()      │      react-native-chessground
│  - makeMove()           │
│  - getSideToMove()      │
│  - isCheck()            │
└───────────┬─────────────┘
            │
            │ createGameData()
            ▼
┌─────────────────────────┐
│    Chessboard           │
│    Component            │
└─────────────────────────┘
```

## Interface

```typescript
export interface ChessEngineAdapter {
  getValidMoves(): Map<Key, Set<Key>>;
  makeMove(move: Move): boolean;
  getSideToMove(): Side;
  isCheck(): boolean;
}
```

## Usage

### Step 1: Implement the Adapter

```typescript
import { Chess } from 'chess.js';
import { ChessEngineAdapter, Side } from 'react-native-chessground';

class MyChessJsAdapter implements ChessEngineAdapter {
  constructor(private chess: Chess) {}

  getValidMoves() {
    const moves = new Map();
    const legalMoves = this.chess.moves({ verbose: true });
    for (const move of legalMoves) {
      if (!moves.has(move.from)) {
        moves.set(move.from, new Set());
      }
      moves.get(move.from)!.add(move.to);
    }
    return moves;
  }

  makeMove(move) {
    const result = this.chess.move({ from: move.from, to: move.to });
    return result !== null;
  }

  getSideToMove() {
    return this.chess.turn() === 'w' ? Side.WHITE : Side.BLACK;
  }

  isCheck() {
    return this.chess.inCheck();
  }
}
```

### Step 2: Create GameData

```typescript
import { createGameData } from 'react-native-chessground';

const chess = new Chess();
const adapter = new MyChessJsAdapter(chess);

const gameData = createGameData(adapter, {
  onMoveComplete: (move) => {
    setFen(chess.fen());
  },
  onMoveError: (move, error) => {
    console.error('Invalid move:', error);
  },
});
```

### Step 3: Use with Chessboard

```typescript
<Chessboard fen={fen} game={gameData} />
```

## Example Implementations

We provide **reference implementations** for popular engines:

### chess.js

See [`example/src/adapters/ChessJsAdapter.ts`](../example/src/adapters/ChessJsAdapter.ts)

```typescript
import { ChessJsAdapter } from './adapters/ChessJsAdapter';

const adapter = new ChessJsAdapter(chess);
```

### chessops

See [`example/src/adapters/ChessopsAdapter.ts`](../example/src/adapters/ChessopsAdapter.ts)

```typescript
import { ChessopsAdapter } from './adapters/ChessopsAdapter';

const adapter = new ChessopsAdapter(position);
```

## Why This Design?

### ✅ Clean Separation of Concerns

- **react-native-chessground**: UI rendering and interactions
- **Your adapter**: Chess logic and engine integration
- **Chess engine**: Move generation and validation

### ✅ No Forced Dependencies

The library doesn't force you to use chess.js or chessops. Use any engine you want:

- Stockfish WASM
- Custom chess engine
- Server-based validation

### ✅ Easy to Extend

Need to support a new engine? Just implement 4 methods!

### ✅ Long-term Maintainability

When the library updates, your adapter stays the same. When your engine updates, the library stays the same.

Copy the example adapters from `src/examples/adapters/` to get started!
