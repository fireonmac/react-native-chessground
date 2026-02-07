import type { ChessEngineAdapter, Move, Key } from 'react-native-chessground';
import { Side } from 'react-native-chessground';
import { makeSquare, parseSquare } from 'chessops/util';

export class ChessopsAdapter implements ChessEngineAdapter {
  constructor(private position: any) {} // Using 'any' to avoid peer dependency

  getValidMoves(): Map<Key, Set<Key>> {
    const moves = new Map<Key, Set<Key>>();

    // Iterate through all occupied squares
    for (const square of this.position.board.occupied) {
      const from = makeSquare(square);
      const dests = new Set<Key>();

      // Get all legal destination squares
      const legalDests = this.position.dests(square);
      for (const dest of legalDests) {
        dests.add(makeSquare(dest));
      }

      if (dests.size > 0) {
        moves.set(from, dests);
      }
    }

    return moves;
  }

  makeMove(move: Move): boolean {
    try {
      const fromSquare = parseSquare(move.from);
      const toSquare = parseSquare(move.to);

      if (fromSquare === undefined || toSquare === undefined) {
        return false;
      }

      const chessopsMove: any = {
        from: fromSquare,
        to: toSquare,
      };

      // Add promotion if specified
      if (move.promotion) {
        chessopsMove.promotion = move.promotion;
      }

      this.position.play(chessopsMove);
      return true;
    } catch {
      return false;
    }
  }

  getSideToMove(): Side {
    return this.position.turn === 'white' ? Side.WHITE : Side.BLACK;
  }

  isCheck(): boolean {
    return this.position.isCheck();
  }
}
