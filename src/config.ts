// import type { Color } from './types';

export enum PieceShiftMethod {
  /**
   * Pieces can be moved by dragging them or by tapping the start and end squares.
   */
  DRAG_OR_TAP,
  /**
   * Pieces can be moved only by dragging them.
   */
  DRAG_ONLY,
  /**
   * Pieces can be moved only by tapping the start and end squares.
   */
  TAP_TWO_SQUARES,
}

export enum DragTargetKind {
  /**
   * The target is the square under the finger.
   */
  SQUARE,
  /**
   * The target is the large circle under the finger.
   */
  CIRCLE,
}

export enum PieceOrientationBehavior {
  /**
   * Pieces are always upright.
   */
  UPRIGHT,
  /**
   * Pieces are rotated 180 degrees when the board is rotated.
   */
  ROTATE,
}

export interface ChessboardColorScheme {
  background: string; // Color
  whiteCoordBackground?: string; // Color
  blackCoordBackground?: string; // Color
  lastMove: string; // Color details
  selected: string; // Color details
  validMoves: string; // Color details
  validPremoves: string; // Color details
  check: string; // Color details
}

// Simplified default color scheme (brown)
export const ChessboardColorSchemeBrown: ChessboardColorScheme = {
  background: '#B58863', // Dark brown (for dark squares)
  lastMove: 'rgba(155, 199, 0, 0.41)',
  selected: 'rgba(20, 85, 30, 0.5)',
  validMoves: 'rgba(20, 85, 30, 0.5)',
  validPremoves: 'rgba(20, 85, 30, 0.5)',
  check: '#ff0000',
};

export interface ChessboardSettings {
  /**
   * Color scheme of the board.
   */
  colorScheme?: ChessboardColorScheme;

  /**
   * Method used to move pieces.
   */
  pieceShiftMethod?: PieceShiftMethod;

  /**
   * Kind of target used when dragging a piece.
   */
  dragTargetKind?: DragTargetKind;

  /**
   * Scale of the piece when dragging it.
   */
  dragFeedbackScale?: number;

  /**
   * Offset of the piece when dragging it, relative to the finger position.
   */
  dragFeedbackOffset?: { x: number; y: number };

  /**
   * Whether to enable coordinates.
   */
  enableCoordinates?: boolean;

  /**
   * Duration of the piece animation.
   */
  animationDuration?: number;

  /**
   * Whether to show valid moves.
   */
  showValidMoves?: boolean;

  /**
   * Whether to show the last move.
   */
  showLastMove?: boolean;
}

export const defaultSettings: ChessboardSettings = {
  colorScheme: ChessboardColorSchemeBrown,
  pieceShiftMethod: PieceShiftMethod.DRAG_OR_TAP,
  dragTargetKind: DragTargetKind.SQUARE,
  dragFeedbackScale: 2.0,
  dragFeedbackOffset: { x: 0, y: -50 },
  enableCoordinates: true,
  animationDuration: 250,
  showValidMoves: true,
  showLastMove: true,
};
