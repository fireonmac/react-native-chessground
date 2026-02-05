import { useState, useCallback, useEffect, useMemo } from 'react';
import type { GameData, Key, Pieces } from '../types';
import { PlayerSide } from '../types';
import type { ChessboardSettings } from '../config';
import { read } from '../fen';
import { premovesOf } from '../premove';

export interface UseBoardLogicProps {
  fen: string;
  game?: GameData;
  settings?: ChessboardSettings;
}

export interface BoardLogic {
  pieces: Pieces;
  selected: Key | undefined;
  validDests: Set<Key>;
  premoveDests: Set<Key>;
  onSelectSquare: (key: Key) => void;
  onMove: (from: Key, to: Key) => void;
}

export function useBoardLogic({ fen, game }: UseBoardLogicProps): BoardLogic {
  const [pieces, setPieces] = useState<Pieces>(() => read(fen));
  const [selected, setSelected] = useState<Key | undefined>(undefined);
  const [premoveDests, setPremoveDests] = useState<Set<Key>>(new Set());

  // Update pieces when FEN changes
  useEffect(() => {
    setPieces(read(fen));
    // Clear selection and premove dests on position change
    setSelected(undefined);
    setPremoveDests(new Set());
  }, [fen]);

  // Get valid destinations for selected square
  const validDests = useMemo(() => {
    if (!selected || !game?.validMoves) {
      return new Set<Key>();
    }
    return game.validMoves.get(selected) || new Set<Key>();
  }, [selected, game]);

  // Check if a piece can be selected by the current player
  const canSelectPiece = useCallback(
    (key: Key): boolean => {
      if (!game) return false;
      const piece = pieces.get(key);
      if (!piece) return false;

      // Check if piece belongs to the player side
      const { playerSide, sideToMove } = game;

      // PlayerSide.BOTH means both players can move
      if (playerSide === PlayerSide.BOTH) {
        return piece.color === sideToMove;
      }

      // PlayerSide.WHITE/BLACK means only that side can move
      if (playerSide === PlayerSide.WHITE) {
        return piece.color === 'white';
      }
      if (playerSide === PlayerSide.BLACK) {
        return piece.color === 'black';
      }

      return false;
    },
    [game, pieces]
  );

  // Check if a piece can be premoved (opponent's turn)
  const canPremovePiece = useCallback(
    (key: Key): boolean => {
      if (!game) return false;
      const piece = pieces.get(key);
      if (!piece) return false;

      const { playerSide, sideToMove } = game;

      // Can only premove when it's NOT your turn
      if (playerSide === PlayerSide.BOTH) {
        return piece.color !== sideToMove;
      }

      if (playerSide === PlayerSide.WHITE) {
        return piece.color === 'white' && sideToMove === 'black';
      }

      return piece.color === 'black' && sideToMove === 'white';
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

  // Handle square selection (including premoves)
  const onSelectSquare = useCallback(
    (key: Key) => {
      if (!game) return; // Non-interactive mode

      // 1. If selected piece and clicking a valid destination -> move
      if (selected && key !== selected) {
        // Try normal move first
        if (isValidMove(selected, key)) {
          onMove(selected, key);
          setPremoveDests(new Set());
          return;
        }

        // Try premove
        if (premoveDests.has(key)) {
          game?.onPremove?.({ from: selected, to: key });
          setSelected(undefined);
          setPremoveDests(new Set());
          return;
        }

        // Try to select another piece
        if (canSelectPiece(key)) {
          setSelected(key);
          setPremoveDests(new Set());
          return;
        }

        if (canPremovePiece(key)) {
          setSelected(key);
          const dests = premovesOf(key, pieces, true);
          setPremoveDests(dests);
          return;
        }

        // Invalid - deselect
        setSelected(undefined);
        setPremoveDests(new Set());
      }
      // 2. Clicking selected piece again or premove origin -> deselect/cancel
      else if (selected === key || game.premove?.from === key) {
        game?.onPremove?.(null);
        setSelected(undefined);
        setPremoveDests(new Set());
      }
      // 3. Try to select a new piece
      else {
        // Cancel existing premove if clicking empty square
        if (!pieces.get(key) && game.premove) {
          game?.onPremove?.(null);
          setSelected(undefined);
          setPremoveDests(new Set());
          return;
        }

        if (canSelectPiece(key)) {
          setSelected(key);
          setPremoveDests(new Set());
        } else if (canPremovePiece(key)) {
          setSelected(key);
          const dests = premovesOf(key, pieces, true);
          setPremoveDests(dests);
        }
      }
    },
    [
      game,
      selected,
      premoveDests,
      canSelectPiece,
      canPremovePiece,
      isValidMove,
      onMove,
      pieces,
    ]
  );

  return {
    pieces,
    selected,
    validDests,
    premoveDests,
    onSelectSquare,
    onMove,
  };
}
