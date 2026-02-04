import { useState, useCallback, useEffect } from 'react';
import type { GameData, Key, Pieces, PlayerSide } from '../types';
import type { ChessboardSettings } from '../config';
import { read } from '../fen';

export interface UseBoardLogicProps {
  fen: string;
  game?: GameData;
  settings?: ChessboardSettings;
}

export interface BoardLogic {
  pieces: Pieces;
  selected: Key | undefined;
  onSelectSquare: (key: Key) => void;
  onMove: (from: Key, to: Key) => void;
}

export function useBoardLogic({ fen, game }: UseBoardLogicProps): BoardLogic {
  const [pieces, setPieces] = useState<Pieces>(() => read(fen));
  const [selected, setSelected] = useState<Key | undefined>(undefined);

  // Update pieces when FEN changes
  useEffect(() => {
    setPieces(read(fen));
  }, [fen]);

  // Check if a piece can be selected by the current player
  const canSelectPiece = useCallback(
    (key: Key): boolean => {
      if (!game) return false;
      const piece = pieces.get(key);
      if (!piece) return false;

      // Check if piece belongs to the player side
      const { playerSide, sideToMove } = game;

      // PlayerSide.BOTH means both players can move
      if (playerSide === ('both' as PlayerSide)) {
        return piece.color === sideToMove;
      }

      // PlayerSide.WHITE/BLACK means only that side can move
      if (playerSide === ('white' as PlayerSide)) {
        return piece.color === 'white';
      }
      if (playerSide === ('black' as PlayerSide)) {
        return piece.color === 'black';
      }

      return false;
    },
    [game, pieces]
  );

  // Check if a move is valid
  const isValidMove = useCallback(
    (from: Key, to: Key): boolean => {
      if (!game?.validMoves) return true; // No validation if validMoves not provided
      const dests = game.validMoves.get(from);
      return dests?.has(to) ?? false;
    },
    [game]
  );

  const onMove = useCallback(
    (from: Key, to: Key) => {
      const piece = pieces.get(from);
      if (!piece) return;

      // Optimistic update
      const newPieces = new Map(pieces);
      newPieces.delete(from);
      newPieces.set(to, piece);
      setPieces(newPieces);

      if (game?.onMove) {
        game.onMove({ from, to });
      }
      setSelected(undefined);
    },
    [game, pieces]
  );

  const onSelectSquare = useCallback(
    (key: Key) => {
      if (!game) return; // Non-interactive mode

      // Flutter logic:
      // 1. If something selected & clicked different square -> try move or select new piece
      // 2. If something selected & clicked same square -> deselect
      // 3. If nothing selected & clicked own piece -> select

      if (selected && key !== selected) {
        // Try to move to this square
        if (isValidMove(selected, key)) {
          onMove(selected, key);
          return;
        }

        // Invalid move - check if clicked another own piece
        if (canSelectPiece(key)) {
          setSelected(key);
        } else {
          // Clicked invalid square - deselect
          setSelected(undefined);
        }
      } else if (selected === key) {
        // Clicked the selected piece again - deselect
        setSelected(undefined);
      } else {
        // No selection - try to select this piece
        if (canSelectPiece(key)) {
          setSelected(key);
        }
      }
    },
    [game, selected, canSelectPiece, isValidMove, onMove]
  );

  return {
    pieces,
    selected,
    onSelectSquare,
    onMove,
  };
}
