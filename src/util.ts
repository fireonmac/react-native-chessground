import { Color, Key, Piece, Role } from './types';

// Constants typically found in types.js in chessground, but moved/shared here for utility
export const colors = ['white', 'black'] as const;
export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

export type File = (typeof files)[number];
export type Rank = (typeof ranks)[number];
export type Pos = [number, number];

export const invRanks: readonly Rank[] = [...ranks].reverse();

export const allKeys: readonly Key[] = files.flatMap(f => ranks.map(r => (f + r) as Key));

export const pos2key = (pos: Pos): Key | undefined =>
  pos.every(x => x >= 0 && x <= 7) ? allKeys[8 * pos[0] + pos[1]] : undefined;

export const pos2keyUnsafe = (pos: Pos): Key => pos2key(pos)!;

export const key2pos = (k: Key): Pos => [k.charCodeAt(0) - 97, k.charCodeAt(1) - 49];

export const uciToMove = (uci: string | undefined): Key[] | undefined => {
  if (!uci) return undefined;
  if (uci[1] === '@') return [uci.slice(2, 4) as Key];
  return [uci.slice(0, 2), uci.slice(2, 4)] as Key[];
};

export const allPos: readonly Pos[] = allKeys.map(key2pos);

export const allPosAndKey: readonly { key: Key; pos: Pos }[] = allKeys.map((key, i) => ({
  key,
  pos: allPos[i],
}));

export const opposite = (c: Color): Color => (c === 'white' ? 'black' : 'white');

export const distanceSq = (pos1: Pos, pos2: Pos): number =>
  (pos1[0] - pos2[0]) ** 2 + (pos1[1] - pos2[1]) ** 2;

export const samePiece = (p1: Piece, p2: Piece): boolean =>
  p1.role === p2.role && p1.color === p2.color;

export const samePos = (p1: Pos, p2: Pos): boolean => p1[0] === p2[0] && p1[1] === p2[1];

export const diff = (a: number, b: number): number => Math.abs(a - b);

type DirectionalCheck = (x1: number, y1: number, x2: number, y2: number) => boolean;

export const knightDir: DirectionalCheck = (x1, y1, x2, y2) => diff(x1, x2) * diff(y1, y2) === 2;

export const rookDir: DirectionalCheck = (x1, y1, x2, y2) => (x1 === x2) !== (y1 === y2);

export const bishopDir: DirectionalCheck = (x1, y1, x2, y2) =>
  diff(x1, x2) === diff(y1, y2) && x1 !== x2;

export const queenDir: DirectionalCheck = (x1, y1, x2, y2) =>
  rookDir(x1, y1, x2, y2) || bishopDir(x1, y1, x2, y2);

export const kingDirNonCastling: DirectionalCheck = (x1, y1, x2, y2) =>
  Math.max(diff(x1, x2), diff(y1, y2)) === 1;

export const pawnDirCapture = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  isDirectionUp: boolean,
) => diff(x1, x2) === 1 && y2 === y1 + (isDirectionUp ? 1 : -1);

export const pawnDirAdvance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  isDirectionUp: boolean,
) => {
  const step = isDirectionUp ? 1 : -1;
  return (
    x1 === x2 &&
    (y2 === y1 + step ||
      // allow 2 squares from first two ranks, for horde
      (y2 === y1 + 2 * step && (isDirectionUp ? y1 <= 1 : y1 >= 6)))
  );
};

/** Returns all board squares between (x1, y1) and (x2, y2) exclusive,
 *  along a straight line (rook or bishop path). Returns [] if not aligned, or none between.
 */
export const squaresBetween = (x1: number, y1: number, x2: number, y2: number): Key[] => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Must be a straight or diagonal line
  if (dx && dy && Math.abs(dx) !== Math.abs(dy)) return [];

  const stepX = Math.sign(dx),
    stepY = Math.sign(dy);
  const squares: Pos[] = [];
  let x = x1 + stepX,
    y = y1 + stepY;
  while (x !== x2 || y !== y2) {
    squares.push([x, y]);
    x += stepX;
    y += stepY;
  }
  return squares.map(pos2key).filter(k => k !== undefined) as Key[];
};
