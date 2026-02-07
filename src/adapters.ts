/**
 * Chess Engine Adapter Interface
 *
 * This module defines the abstract interface that chess engines must implement
 * to integrate with react-native-chessground. The library itself does not depend
 * on any specific chess engine (chess.js, chessops, etc).
 *
 * Users can implement this interface for their chosen chess engine.
 */

import type { GameData, Move, Key, MoveMetadata } from './types';
import { Side } from './types';

/**
 * Abstract interface for chess engine integration.
 *
 * Implement this interface to connect your chess engine with react-native-chessground.
 * The library will call these methods to get game state and make moves.
 *
 * See `src/examples/adapters` for reference implementations.
 */
export interface ChessEngineAdapter {
  /**
   * Get all valid moves from the current position.
   *
   * @returns Map from source square to set of destination squares
   */
  getValidMoves(): Map<Key, Set<Key>>;

  /**
   * Make a move on the board.
   *
   * @param move - The move to make
   * @returns true if move was successful, false if illegal
   */
  makeMove(move: Move): boolean;

  /**
   * Get the side to move.
   *
   * @returns Side.WHITE or Side.BLACK
   */
  getSideToMove(): Side;

  /**
   * Check if the current position is check.
   *
   * @returns true if current side is in check
   */
  isCheck(): boolean;
}

/**
 * Convert a ChessEngineAdapter to GameData for use with Chessboard component.
 *
 * This is a helper function that creates the GameData object expected by
 * the Chessboard component from your ChessEngineAdapter implementation.
 *
 * @param adapter - Your chess engine adapter implementation
 * @param callbacks - Optional callbacks for lifecycle events
 * @returns GameData object to pass to Chessboard
 */
export function createGameData(
  adapter: ChessEngineAdapter,
  callbacks?: {
    /**
     * Called after a move is successfully made.
     * Use this to update your UI state (e.g., FEN).
     */
    onMoveComplete?: (move: Move) => void;

    /**
     * Called when a move fails (illegal move).
     */
    onMoveError?: (move: Move, error: string) => void;
  }
): Omit<GameData, 'playerSide'> {
  return {
    validMoves: adapter.getValidMoves(),
    sideToMove: adapter.getSideToMove(),
    isCheck: adapter.isCheck(),

    onMove: (move: Move, _metadata?: MoveMetadata) => {
      // The `move` object already contains `promotion` if it's a promotion move.
      // The `adapter.makeMove` implementation is responsible for interpreting it.
      // chess.js uses single letters for promotion: 'q', 'r', 'b', 'n'
      // promotion: move.promotion
      //   ? roleToChessJsPromotion(move.promotion)
      //   : undefined,
      const success = adapter.makeMove(move);

      if (success) {
        callbacks?.onMoveComplete?.(move);
      } else {
        callbacks?.onMoveError?.(move, 'Illegal move');
      }
    },
  };
}
