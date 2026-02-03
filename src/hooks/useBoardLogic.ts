import { useState, useCallback } from 'react';
import type { GameData, Key, Pieces } from '../types';
import type { ChessboardSettings } from '../config';
import { read } from '../fen';

export interface UseBoardLogicProps {
  fen: string;
  game?: GameData;
  settings: ChessboardSettings;
}

export interface BoardLogic {
  pieces: Pieces;
  selected: Key | undefined;
  premoveDests: Set<Key>;
  onSelectSquare: (key: Key) => void;
  onMove: (from: Key, to: Key) => void;
  // TODO: Add ValidMoves, Drag State, etc.
}

export function useBoardLogic({ fen, game }: UseBoardLogicProps): BoardLogic {
  const [pieces, setPieces] = useState<Pieces>(() => read(fen));
  const [selected, setSelected] = useState<Key | undefined>(undefined);
  const [premoveDests] = useState<Set<Key>>(new Set());

  // Effect to update pieces when FEN changes
  // TODO: Add piece animation logic here similar to Flutter's didUpdateWidget
  // if (false) {
  //   setPieces(read(fen));
  // }

  const onSelectSquare = useCallback(
    (key: Key) => {
      if (!game) return; // Non-interactive mode

      const piece = pieces.get(key);
      const isMovable = piece && piece.color === game.sideToMove; // Simplified
      // flutter-chessground logic:
      // 1. If selected & clicked different square -> try move
      // 2. If selected & clicked same square -> toggle/deselect
      // 3. If no selection & clicked movable piece -> select

      if (selected && key !== selected) {
        // Try move logic would go here
        // If move valid -> play move, deselect
        // If move invalid but clicked own piece -> select new piece
        // If move invalid -> deselect
        if (isMovable) {
          setSelected(key);
        } else {
          setSelected(undefined);
        }
      } else if (selected === key) {
        // Toggle behavior or "deselect on next tap up" (mobile behavior)
        // For now, simple toggle
        setSelected(undefined);
      } else if (isMovable) {
        setSelected(key);
      }
    },
    [game, pieces, selected]
  );

  const onMove = useCallback(
    (from: Key, to: Key) => {
      const piece = pieces.get(from);
      if (!piece) return;

      // Optimistic update
      const newPieces = new Map(pieces);
      newPieces.delete(from);
      newPieces.set(to, piece);
      setPieces(newPieces); // Optimistic update

      if (game?.onMove) {
        game.onMove({ from, to });
      }
      setSelected(undefined);
    },
    [game, pieces]
  );

  return {
    pieces,
    selected,
    premoveDests,
    onSelectSquare,
    onMove,
  };
}
