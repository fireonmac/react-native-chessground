# Porting Strategy & Goals

## Goal

The primary objective is to create a **React Native** port of the `chessground` library, named `react-native-chessground`.

## Reason

While `chessground` is written in TypeScript, it is designed for the **Web** (DOM-based). Direct porting is not feasible due to platform differences.
`flutter-chessground` is an existing mobile implementation that solves mobile-specific interaction and rendering challenges.

## Strategy

We will adopt a **Hybrid Approach**:

1.  **Logic & Behavior (Source: `flutter-chessground`)**

    - **Interactions**: Drag & drop, tapping, and move validation logic should strictly follow the mobile implementation.
    - **Mobile Specifics**: Features like "tap-to-move", "drag targets", and responsive sizing are taken from the Flutter version.
    - **State**: Transient UI state (e.g., dragging piece, selected square) follows the Flutter widget state model.

2.  **Code Structure & Conventions (Source: `chessground` Web)**
    - **Language**: Since both are JS/TS, we adhere to the coding style, naming conventions, and file organization of the original web library where possible.
    - **Type Definitions**: We prefer the functional TypeScript style of the web library (Interfaces > Classes) over Dart's object-oriented patterns, provided it doesn't conflict with mobile logic.

## Summary

- **Logic**: $\approx$ `flutter-chessground`
- **Structure**: $\approx$ `chessground` (Web)

---

## Chess Engine Integration

### Design Philosophy

To maintain **Flutter API compatibility** (critical for ongoing Flutter-chessground migrations) while enabling **flexible chess engine integration**, we use an **interface-based adapter pattern**.

### Architecture

```
react-native-chessground (defines interface)
        ↓
ChessEngineAdapter (abstract interface)
        ↓
User Implementation (chess.js, chessops, etc)
```

**Key principle:** The library defines the contract (`ChessEngineAdapter`), but does NOT depend on specific chess engines.

### Core API Design

The library maintains the **Flutter-chessground API structure**:

```typescript
interface GameData {
  onMove?: (move: Move, metadata?: MoveMetadata) => void;
  validMoves?: Map<Key, Set<Key>>;
  sideToMove?: Side;
  isCheck?: boolean;
  // ...
}
```

**Why this matters:**

1. **Flutter migrations**: 1:1 mapping to `NormalMove` and `GameData`
2. **Extensibility**: New fields in flutter-chessground → easy to add
3. **Long-term cost**: 4x less maintenance over 5 years
4. **Consistency**: All callbacks use Move objects

### Adapter Interface

Instead of library-provided helpers like `createChessJsAdapter()`, users implement:

```typescript
interface ChessEngineAdapter {
  getValidMoves(): Map<Key, Set<Key>>;
  makeMove(move: Move): boolean;
  getSideToMove(): Side;
  isCheck(): boolean;
}
```

Then convert to GameData:

```typescript
const gameData = createGameData(adapter, { callbacks });
```

### Benefits

| Aspect           | Interface-Based      | Built-in Helpers            |
| ---------------- | -------------------- | --------------------------- |
| **Dependencies** | None (user's choice) | chess.js, chessops          |
| **Flexibility**  | Any engine           | Limited to provided         |
| **Maintenance**  | Library stays clean  | Must update for each engine |
| **User Control** | Full customization   | Limited to options          |

### Example Implementations

The library provides **reference implementations** (not dependencies):

- [`example/src/adapters/ChessJsAdapter.ts`](../example/src/adapters/ChessJsAdapter.ts)
- [`example/src/adapters/ChessopsAdapter.ts`](../example/src/adapters/ChessopsAdapter.ts)

Users copy and customize these for their needs.

### Design Rationale: Zero Dependency

By defining a pure interface (`ChessEngineAdapter`) instead of built-in adapters, we achieve:

1. **Inverted Dependency**

   - The library does not depend on specific chess engines.
   - User code is responsible for providing the engine implementation.

2. **Flexibility**

   - Supports any chess engine (chess.js, chessops, Stockfish, or custom logic).
   - Can easily adapt to server-side validation or complex game rules.

3. **Maintainability**

   - The library remains stable even if 3rd-party engine APIs change.
   - Users can maintain their own adapters without waiting for library updates.

4. **Bundle Size**
   - Built-in: Adapter code in library
   - Interface: Only what you use

### Migration Impact

**With this design, Flutter updates remain trivial:**

```typescript
// Flutter adds field to NormalMove
class NormalMove {
  Square from, to;
  Role? promotion;
  bool? enPassant;  // NEW
}

// React Native: Direct mapping
interface Move {
  from: Key;
  to: Key;
  promotion?: Role;
  enPassant?: boolean;  // NEW - no adapter changes needed!
}
```

The adapter interface stays stable because it only needs Move as input/output.

For detailed implementation guide, see [`docs/ADAPTERS.md`](./ADAPTERS.md).
