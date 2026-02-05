# react-native-chessground

[![npm version](https://img.shields.io/npm/v/react-native-chessground.svg)](https://www.npmjs.com/package/react-native-chessground)
[![License](https://img.shields.io/npm/l/react-native-chessground.svg)](https://www.npmjs.com/package/react-native-chessground)

A React Native port of the [flutter-chessground](https://github.com/lichess-org/flutter-chessground) library.
It is built using `react-native-reanimated` and `@shopify/react-native-skia` to ensure native performance purely on the UI thread.

This library handles board rendering and user interaction, but **does not handle chess logic**. It provides a flexible **Adapter Interface** so you can plug in any chess engine (chess.js, chessops, stockfish, or custom logic).

## Features

- 📱 **Native Performance**: Built with React Native Skia and Reanimated for 60/120 FPS animations.
- 🧩 **Engine Agnostic**: Zero dependencies on specific chess libraries. Use what you want.
- 🎨 **Customizable**: Themes, piece sets, and board colors.
- ✨ **Rich Interactions**:
  - Tap-tap or drag-and-drop moving
  - Premoves
  - Promotion selector
  - Valid move highlights and last move markers
  - Check indicators
  - Board orientation (White/Black)

## Installation

```sh
npm install react-native-chessground
```

or

```sh
yarn add react-native-chessground
```

### Peer Dependencies

This library requires the following peer dependencies:

```sh
npm install react-native-reanimated @shopify/react-native-skia react-native-gesture-handler react-native-svg
```

## Usage

This library uses an **Adapter Pattern** to connect with chess engines. This ensures the library stays lightweight and flexible.

### 1. Implement an Adapter

You need an adapter class that implements `ChessEngineAdapter`.
We provide **reference implementations** that you can copy into your project:

- **chess.js**: [`example/src/adapters/ChessJsAdapter.ts`](example/src/adapters/ChessJsAdapter.ts)
- **chessops**: [`example/src/adapters/ChessopsAdapter.ts`](example/src/adapters/ChessopsAdapter.ts)

See [**Adapter Guide**](docs/ADAPTERS.md) for more details.

### 2. Connect to Chessboard

Use `createGameData` helper to bridge your adapter with the `Chessboard` component.

```tsx
import { useState } from 'react';
import { Chessboard, createGameData } from 'react-native-chessground';
import { Chess } from 'chess.js'; // Your choice of engine
import { ChessJsAdapter } from './adapters/ChessJsAdapter'; // Copy from examples

export default function App() {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());

  // Create GameData from your adapter
  const gameData = createGameData(new ChessJsAdapter(chess), {
    onMoveComplete: (move) => {
      // Update local state when a move is played
      setFen(chess.fen());
    },
  });

  return <Chessboard fen={fen} game={gameData} />;
}
```

## Documentation

- **[Adapter Guide](docs/ADAPTERS.md)**: How to integrate with chess.js, chessops, etc.
- **[Porting Strategy](docs/PORTING_STRATEGY.md)**: Design philosophy, architecture, and Flutter comparison.
- **[Porting Checklist](docs/PORTING_CHECKLIST.md)**: Status of feature parity with Flutter version.

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
