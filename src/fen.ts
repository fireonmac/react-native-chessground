import { invRanks, files } from './util';
import type { Color, FEN, Piece, Role } from './types';

export const initial: FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const roles: Record<string, Role> = {
  p: 'pawn',
  r: 'rook',
  n: 'knight',
  b: 'bishop',
  q: 'queen',
  k: 'king',
};

export function read(fen: FEN): Map<string, Piece> {
  if (fen === 'start') fen = initial;
  const pieces = new Map<string, Piece>();
  let row = 0,
    col = 0;
  const fenPart = fen.split(' ')[0] ?? '';
  for (const c of fenPart) {
    if (c === '/') {
      row++;
      col = 0;
    } else if (c >= '1' && c <= '8') {
      col += parseInt(c, 10);
    } else {
      const color: Color = c === c.toUpperCase() ? 'white' : 'black';
      const role = roles[c.toLowerCase()];
      const fileChar = files[col];
      const rankChar = invRanks[row];

      if (role && fileChar && rankChar) {
        const key = fileChar + rankChar;
        pieces.set(key, { role, color });
      }
      col++;
    }
  }
  return pieces;
}

export function write(pieces: Map<string, Piece>): FEN {
  // TODO: Implement write logic
  if (pieces.size === 0) return '8/8/8/8/8/8/8/8 w - - 0 1';
  return initial;
}
