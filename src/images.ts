import type { ImageSourcePropType } from 'react-native';
import type { Role, Color } from './types';

export type PieceSet = Record<string, ImageSourcePropType>;

export const cburnett: PieceSet = {
  wP: require('./assets/piece_sets/cburnett/wP.png'),
  wN: require('./assets/piece_sets/cburnett/wN.png'),
  wB: require('./assets/piece_sets/cburnett/wB.png'),
  wR: require('./assets/piece_sets/cburnett/wR.png'),
  wQ: require('./assets/piece_sets/cburnett/wQ.png'),
  wK: require('./assets/piece_sets/cburnett/wK.png'),
  bP: require('./assets/piece_sets/cburnett/bP.png'),
  bN: require('./assets/piece_sets/cburnett/bN.png'),
  bB: require('./assets/piece_sets/cburnett/bB.png'),
  bR: require('./assets/piece_sets/cburnett/bR.png'),
  bQ: require('./assets/piece_sets/cburnett/bQ.png'),
  bK: require('./assets/piece_sets/cburnett/bK.png'),
};

export const pieceSets: Record<string, PieceSet> = {
  cburnett,
};

export const getPieceAsset = (
  set: string,
  color: Color,
  role: Role
): ImageSourcePropType => {
  const pieceSet = pieceSets[set] ?? pieceSets.cburnett; // fallback to cburnett if set not found
  const roleChar = role === 'knight' ? 'N' : role.charAt(0).toUpperCase();
  const colorChar = color === 'white' ? 'w' : 'b';
  const key = `${colorChar}${roleChar}`;
  return pieceSet![key] ?? cburnett[key]!; // fallback to cburnett piece if key not found
};
