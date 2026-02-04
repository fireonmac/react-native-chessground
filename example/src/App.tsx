import { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Board, PlayerSide, Side, type Role } from 'react-native-chessground';
import { Chess } from 'chessops/chess';
import { parseFen, makeFen } from 'chessops/fen';
import { parseSquare, makeSquare } from 'chessops/util';
import type { Move } from 'chessops/types';

export default function App() {
  const [fen, setFen] = useState(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );
  const [promotionMove, setPromotionMove] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // Parse FEN and create Chess position
  const position = useMemo(() => {
    const setup = parseFen(fen).unwrap();
    return Chess.fromSetup(setup).unwrap();
  }, [fen]);

  // Calculate valid moves for all pieces
  const validMoves = useMemo(() => {
    const moves = new Map<string, Set<string>>();

    // Iterate through all occupied squares
    for (const square of position.board.occupied) {
      const from = makeSquare(square);
      const dests = new Set<string>();

      // Get all legal destination squares from this square
      const legalDests = position.dests(square);
      for (const dest of legalDests) {
        dests.add(makeSquare(dest));
      }

      if (dests.size > 0) {
        moves.set(from, dests);
      }
    }

    return moves;
  }, [position]);

  const playMove = useCallback(
    (from: string, to: string, promotion?: Role) => {
      const fromSquare = parseSquare(from);
      const toSquare = parseSquare(to);

      if (fromSquare === undefined || toSquare === undefined) return;

      // Create a new position and play the move
      const newPosition = position.clone();
      const move: Move = { from: fromSquare, to: toSquare };
      if (promotion) {
        (move as any).promotion = promotion;
      }
      newPosition.play(move);

      // Update FEN
      const newFen = makeFen(newPosition.toSetup());
      setFen(newFen);
    },
    [position]
  );

  const handleMove = useCallback(
    ({ from, to }: { from: string; to: string }) => {
      console.log(`Move ${from} -> ${to}`);

      const fromSquare = parseSquare(from);
      const toSquare = parseSquare(to);

      if (fromSquare === undefined || toSquare === undefined) {
        console.error('Invalid square');
        return;
      }

      // Check if move is legal
      const legalDests = position.dests(fromSquare);
      if (!legalDests.has(toSquare)) {
        console.error('Illegal move');
        return;
      }

      // Check if this is a pawn promotion
      const piece = position.board.get(fromSquare);
      const isPromotion =
        piece?.role === 'pawn' &&
        ((piece.color === 'white' && to[1] === '8') ||
          (piece.color === 'black' && to[1] === '1'));

      if (isPromotion) {
        // Set promotion move and show selector
        setPromotionMove({ from, to });
      } else {
        // Play the move immediately
        playMove(from, to);
      }
    },
    [position, playMove]
  );

  const handlePromotionSelection = useCallback(
    (role?: Role) => {
      if (!promotionMove) return;

      if (role) {
        // Play the move with the selected promotion
        playMove(promotionMove.from, promotionMove.to, role);
      }

      // Clear promotion state
      setPromotionMove(null);
    },
    [promotionMove, playMove]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>React Native Chessground</Text>
        <Board
          fen={fen}
          game={{
            playerSide: PlayerSide.BOTH,
            sideToMove: position.turn === 'white' ? Side.WHITE : Side.BLACK,
            validMoves,
            onMove: handleMove,
            promotionMove: promotionMove ? promotionMove : undefined,
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
