import type {
  ChessEngineAdapter,
  Move,
  Key,
  Role,
} from 'react-native-chessground';
import { Side } from 'react-native-chessground';

export class ChessJsAdapter implements ChessEngineAdapter {
  constructor(private chess: any) {} // Using 'any' to avoid peer dependency

  getValidMoves(): Map<Key, Set<Key>> {
    const moves = new Map<Key, Set<Key>>();

    // Get all legal moves in verbose format
    const legalMoves = this.chess.moves({ verbose: true });

    for (const move of legalMoves) {
      const from = move.from as Key;
      const to = move.to as Key;

      if (!moves.has(from)) {
        moves.set(from, new Set());
      }
      moves.get(from)!.add(to);
    }

    return moves;
  }

  makeMove(move: Move): boolean {
    try {
      const result = this.chess.move({
        from: move.from,
        to: move.to,
        // chess.js uses single letters: 'q', 'r', 'b', 'n'
        promotion: move.promotion
          ? this.convertPromotionRole(move.promotion)
          : undefined,
      });

      return result !== null;
    } catch {
      return false;
    }
  }

  getSideToMove(): Side {
    return this.chess.turn() === 'w' ? Side.WHITE : Side.BLACK;
  }

  isCheck(): boolean {
    return this.chess.inCheck();
  }

  /**
   * Convert react-native-chessground promotion role to chess.js format
   */
  private convertPromotionRole(role: Role): 'q' | 'r' | 'b' | 'n' {
    switch (role) {
      case 'queen':
        return 'q';
      case 'rook':
        return 'r';
      case 'bishop':
        return 'b';
      case 'knight':
        return 'n';
      default:
        return 'q'; // Default to queen
    }
  }
}
