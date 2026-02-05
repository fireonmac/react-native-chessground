import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Chessboard,
  PlayerSide,
  createGameData,
  Side,
  type Role,
  type Move,
} from 'react-native-chessground';
import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { parseSquare } from 'chessops/util';
import { ChessopsAdapter } from './adapters/ChessopsAdapter';

export default function App() {
  const [fen, setFen] = useState(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );
  const [lastMove, setLastMove] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [premove, setPremove] = useState<Move | null>(null);
  const [promotionMove, setPromotionMove] = useState<Move | null>(null);

  // Parse FEN and create Chess position
  const position = useMemo(() => {
    const setup = parseFen(fen).unwrap();
    return Chess.fromSetup(setup).unwrap();
  }, [fen]);

  // Create adapter instance
  const adapter = useMemo(() => new ChessopsAdapter(position), [position]);

  // Create base GameData from adapter
  const adapterGameData = useMemo(
    () =>
      createGameData(adapter, {
        onMoveComplete: (move) => {
          const newFen = makeFen(position.toSetup());
          setFen(newFen);
          setLastMove({ from: move.from, to: move.to });
        },
      }),
    [adapter, position]
  );

  // Track previous FEN to detect changes
  const prevFenRef = useRef(fen);

  // Auto-execute premove when position changes
  useEffect(() => {
    // Only execute if FEN actually changed and we have a premove
    if (prevFenRef.current === fen || !premove) {
      prevFenRef.current = fen;
      return;
    }

    prevFenRef.current = fen;

    // Check if the move is legal in new position
    const validMoves = adapter.getValidMoves();
    const dests = validMoves.get(premove.from);

    if (dests && dests.has(premove.to)) {
      console.log('Executing premove:', premove);
      // Adapter handles the move calculation
      adapterGameData.onMove?.(premove);
      setPremove(null);
    } else {
      console.log('Premove cancelled: move is not legal');
      setPremove(null);
    }
  }, [fen, premove, adapter, adapterGameData]);

  const handleMove = useCallback(
    (move: Move) => {
      console.log(`Move ${move.from} -> ${move.to}`);

      // Check if this is a pawn promotion
      // We still need to check manually to show the selection UI
      // before calling adapter.makeMove
      const fromSquare = parseSquare(move.from);
      if (fromSquare === undefined) return;

      const piece = position.board.get(fromSquare);
      const isPromotion =
        piece?.role === 'pawn' &&
        ((piece.color === 'white' && move.to[1] === '8') ||
          (piece.color === 'black' && move.to[1] === '1')) &&
        !move.promotion; // If promotion role is already set, it's not a selection step

      if (isPromotion) {
        // Set promotion move and show selector
        setPromotionMove(move);
      } else {
        // Play the move via adapter
        adapterGameData.onMove?.(move);
      }
    },
    [position, adapterGameData]
  );

  const handlePromotionSelection = useCallback(
    (role?: Role) => {
      if (!promotionMove) return;

      if (role) {
        // Play the move with the selected promotion
        adapterGameData.onMove?.({
          ...promotionMove,
          promotion: role,
        });
      }

      // Clear promotion state
      setPromotionMove(null);
    },
    [promotionMove, adapterGameData]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>React Native Chessground</Text>
        <Chessboard
          fen={fen}
          lastMove={lastMove ?? undefined}
          game={{
            playerSide: PlayerSide.BOTH,
            ...adapterGameData,
            sideToMove: adapterGameData.sideToMove ?? Side.WHITE,
            isCheck: adapterGameData.isCheck,
            onMove: handleMove, // Override onMove to handle promotion UI
            premove: premove ?? undefined,
            onPremove: (move) => {
              console.log('Premove set:', move);
              setPremove(move);
            },
            promotionMove: promotionMove ?? undefined,
            onPromotionSelection: handlePromotionSelection,
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 5,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 20,
  },
});
