import type { ChessEngineAdapter, Move, Key } from 'react-native-chessground';
import { Side } from 'react-native-chessground';

export class ChessopsAdapter implements ChessEngineAdapter {
  constructor(private position: any) {} // Using 'any' to avoid peer dependency

  getValidMoves(): Map<Key, Set<Key>> {
    const moves = new Map<Key, Set<Key>>();

    // Iterate through all occupied squares
    for (const square of this.position.board.occupied) {
      const from = this.makeSquare(square);
      const dests = new Set<Key>();

      // Get all legal destination squares
      const legalDests = this.position.dests(square);
      for (const dest of legalDests) {
        dests.add(this.makeSquare(dest));
      }

      if (dests.size > 0) {
        moves.set(from, dests);
      }
    }

    return moves;
  }

  makeMove(move: Move): boolean {
    try {
      const fromSquare = this.parseSquare(move.from);
      const toSquare = this.parseSquare(move.to);

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

  /**
   * Convert square index (0-63) to key ('a1'-'h8')
   */
  private makeSquare(square: number): Key {
    const file = String.fromCharCode('a'.charCodeAt(0) + (square % 8));
    const rank = Math.floor(square / 8) + 1;
    return `${file}${rank}` as Key;
  }

  /**
   * Convert key ('a1'-'h8') to square index (0-63)
   */
  private parseSquare(key: Key): number | undefined {
    if (key.length < 2) return undefined;
    const file = key.charCodeAt(0) - 'a'.charCodeAt(0);
    const rankChar = key[1];
    if (!rankChar) return undefined;
    const rank = parseInt(rankChar, 10) - 1;
    if (file >= 0 && file < 8 && rank >= 0 && rank < 8) {
      return rank * 8 + file;
    }
    return undefined;
  }
}
