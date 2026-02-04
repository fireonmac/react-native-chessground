import type { Piece, Pieces, Key, Color } from './types';
import { key2pos, pos2key } from './util';

/**
 * Returns the set of squares that the piece on [square] can potentially premove to.
 * This calculates pseudo-legal moves (doesn't check for checks/pins).
 */
export function premovesOf(
  square: Key,
  pieces: Pieces,
  canCastle: boolean = false
): Set<Key> {
  const piece = pieces.get(square);
  if (!piece) return new Set();

  const pos = key2pos(square);
  if (!pos) return new Set();

  const [file, rank] = pos;
  const role = piece.role;

  // Get mobility function for this piece type
  const mobility = getMobilityFunction(role, piece.color, pieces, canCastle);

  // Generate all possible destination squares
  const destinations = new Set<Key>();
  for (let destFile = 0; destFile < 8; destFile++) {
    for (let destRank = 0; destRank < 8; destRank++) {
      // Skip the origin square
      if (destFile === file && destRank === rank) continue;

      if (mobility(file, rank, destFile, destRank)) {
        const destKey = pos2key([destFile, destRank]);
        if (destKey) destinations.add(destKey);
      }
    }
  }

  return destinations;
}

type MobilityFunction = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => boolean;

function getMobilityFunction(
  role: Piece['role'],
  color: Color,
  pieces: Pieces,
  canCastle: boolean
): MobilityFunction {
  switch (role) {
    case 'pawn':
      return pawnMobility(color);
    case 'knight':
      return knightMobility;
    case 'bishop':
      return bishopMobility;
    case 'rook':
      return rookMobility;
    case 'queen':
      return queenMobility;
    case 'king':
      return kingMobility(color, getRookFiles(pieces, color), canCastle);
  }
}

function diff(a: number, b: number): number {
  return Math.abs(a - b);
}

// Pawn mobility (pseudo-legal)
function pawnMobility(color: Color): MobilityFunction {
  return (x1: number, y1: number, x2: number, y2: number): boolean => {
    const xDiff = diff(x1, x2);

    if (color === 'white') {
      // White pawns move up (increasing rank)
      return (
        xDiff < 2 && (y2 === y1 + 1 || (y1 <= 1 && y2 === y1 + 2 && x1 === x2))
      );
    } else {
      // Black pawns move down (decreasing rank)
      return (
        xDiff < 2 && (y2 === y1 - 1 || (y1 >= 6 && y2 === y1 - 2 && x1 === x2))
      );
    }
  };
}

// Knight mobility (L-shape)
function knightMobility(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
  const xDiff = diff(x1, x2);
  const yDiff = diff(y1, y2);
  return (xDiff === 1 && yDiff === 2) || (xDiff === 2 && yDiff === 1);
}

// Bishop mobility (diagonals)
function bishopMobility(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
  return diff(x1, x2) === diff(y1, y2);
}

// Rook mobility (ranks and files)
function rookMobility(x1: number, y1: number, x2: number, y2: number): boolean {
  return x1 === x2 || y1 === y2;
}

// Queen mobility (bishop + rook)
function queenMobility(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean {
  return bishopMobility(x1, y1, x2, y2) || rookMobility(x1, y1, x2, y2);
}

// King mobility (one square + castling)
function kingMobility(
  color: Color,
  rookFiles: number[],
  canCastle: boolean
): MobilityFunction {
  return (x1: number, y1: number, x2: number, y2: number): boolean => {
    // Regular king move (one square in any direction)
    if (diff(x1, x2) < 2 && diff(y1, y2) < 2) {
      return true;
    }

    // Castling
    if (!canCastle) return false;

    const backRank = color === 'white' ? 0 : 7;
    if (y1 !== y2 || y1 !== backRank) return false;

    // King must be on e-file (file 4)
    if (x1 === 4) {
      // Kingside castling: e1-g1 or rook on h-file
      if ((x2 === 6 && rookFiles.includes(7)) || rookFiles.includes(x2)) {
        return true;
      }
      // Queenside castling: e1-c1 or rook on a-file
      if ((x2 === 2 && rookFiles.includes(0)) || rookFiles.includes(x2)) {
        return true;
      }
    }

    return false;
  };
}

// Get files where rooks of the given color are located on the back rank
function getRookFiles(pieces: Pieces, color: Color): number[] {
  const backRank = color === 'white' ? 0 : 7;
  const rookFiles: number[] = [];

  for (const [key, piece] of pieces.entries()) {
    const pos = key2pos(key);
    if (!pos) continue;

    const [file, rank] = pos;
    if (rank === backRank && piece.color === color && piece.role === 'rook') {
      rookFiles.push(file);
    }
  }

  return rookFiles;
}
