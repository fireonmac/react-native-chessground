export type Color = 'white' | 'black';
export type Role = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PieceRole = Role;
export type FEN = string;
export type Key = string; // e.g. "a1", "h8"

export interface Piece {
  role: Role;
  color: Color;
  promoted?: boolean;
}

export type Pieces = Map<Key, Piece>;

export enum PlayerSide {
  NONE = 'none',
  BOTH = 'both',
  WHITE = 'white',
  BLACK = 'black',
}

export enum Side {
  WHITE = 'white',
  BLACK = 'black',
}

export const oppositeSide = (side: Side): Side =>
  side === Side.WHITE ? Side.BLACK : Side.WHITE;

export interface Label {
  text: string;
  fill?: string;
}

/**
 * Metadata for a move.
 */
export interface MoveMetadata {
  /**
   * Whether the move is a capture.
   */
  capture?: boolean;
  /**
   * Whether the move is a check.
   */
  check?: boolean;
  /**
   * Whether the move is a checkmate.
   */
  checkmate?: boolean;
  /**
   * Whether the move is a castle.
   */
  castle?: boolean;
  /**
   * Whether the move is a promotion.
   */
  promotion?: boolean;
  /**
   * Whether the move is a en passant.
   */
  enPassant?: boolean;
}

/**
 * A chess move.
 */
export interface Move {
  from: Key;
  to: Key;
  metadata?: MoveMetadata;
}

/**
 * The game state corresponding to an instance of a game.
 * Corresponds to Flutter's GameData.
 */
export interface GameData {
  /**
   * The side of the player.
   */
  playerSide: PlayerSide;

  /**
   * The side to move.
   */
  sideToMove: Side;

  /**
   * Valid moves for the current position.
   * Map from source square to list of destination squares.
   */
  validMoves?: Map<Key, Set<Key>>;

  /**
   * Whether the current position is a check.
   */
  isCheck?: boolean;

  /**
   * If set, a pawn promotion is pending.
   */
  promotionMove?: Move;

  /**
   * The premove that is currently set (for opponent's turn).
   */
  premove?: Move;

  /**
   * Valid premove destinations from the selected square.
   */
  premoveDestinations?: Set<Key>;

  /**
   * Callback called when a move is played.
   */
  onMove?: (move: Move, metadata?: MoveMetadata) => void;

  /**
   * Callback called when a promotion piece is selected.
   * If role is undefined, the promotion was cancelled.
   */
  onPromotionSelection?: (role?: Role) => void;

  /**
   * Callback called when a premove is set or cleared.
   */
  onPremove?: (move: Move | null) => void;
}
