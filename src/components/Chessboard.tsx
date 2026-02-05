import React, { useMemo } from 'react';
import { StyleSheet, Dimensions, Pressable } from 'react-native';
import type { GameData } from '../types';
import { defaultSettings } from '../config';
import type { ChessboardSettings } from '../config';
import { useBoardLogic } from '../hooks/useBoardLogic';
import { BoardBackground } from './BoardBackground';
import { AnimatedPiece } from './AnimatedPiece';
import { Highlights } from './Highlights';
import { ValidMovesMarkers } from './ValidMovesMarkers';
import { Coordinates } from './Coordinates';
import { PromotionSelector } from './PromotionSelector';
import { key2pos, pos2key } from '../util';

export interface ChessboardProps {
  fen: string;
  game?: GameData;
  settings?: ChessboardSettings;
  side?: number; // Size in pixels, undefined = auto fit width
  lastMove?: { from: string; to: string };
}

export const Chessboard: React.FC<ChessboardProps> = ({
  fen,
  game,
  settings = defaultSettings,
  side,
  lastMove,
}) => {
  const { pieces, selected, validDests, premoveDests, onMove, onSelectSquare } =
    useBoardLogic({
      fen,
      game,
      settings,
    });

  const screenWidth = Dimensions.get('window').width;
  const boardSize = side || screenWidth;
  const squareSize = boardSize / 8;

  const colorScheme = settings.colorScheme || defaultSettings.colorScheme!;
  const orientation = game?.playerSide === 'black' ? 'black' : 'white';

  // Handle tap on a square
  const onSquareTap = (file: number, rank: number) => {
    onSelectSquare(pos2key([file, rank])!);
  };

  // Get king square if in check (memoized for performance)
  const checkSquare = useMemo((): string | undefined => {
    if (!game?.isCheck) return undefined;

    // Find the king of the side to move
    for (const [key, piece] of pieces.entries()) {
      if (piece.role === 'king' && piece.color === game?.sideToMove) {
        return key;
      }
    }
    return undefined;
  }, [game?.isCheck, game?.sideToMove, pieces]);

  // Handle piece drop (drag gesture)
  const onPieceDrop = (key: string, tx: number, ty: number) => {
    const pos = key2pos(key);
    const file = orientation === 'white' ? pos[0] : 7 - pos[0];
    const rank = orientation === 'white' ? 7 - pos[1] : pos[1];
    const startX = file * squareSize;
    const startY = rank * squareSize;
    const targetX = startX + tx;
    const targetY = startY + ty;
    const targetFile = Math.floor(targetX / squareSize + 0.5);
    const targetRank = Math.floor(targetY / squareSize + 0.5);
    if (
      targetFile >= 0 &&
      targetFile <= 7 &&
      targetRank >= 0 &&
      targetRank <= 7
    ) {
      const logicFile = orientation === 'white' ? targetFile : 7 - targetFile;
      const logicRank = orientation === 'white' ? 7 - targetRank : targetRank;
      const destKey = pos2key([logicFile, logicRank]);
      if (destKey) {
        onMove(key, destKey);
      }
    }
  };

  return (
    <Pressable
      onPressIn={(event) => {
        // Calculate which square was pressed from touch coordinates (like Flutter's offsetSquare)
        const { locationX, locationY } = event.nativeEvent;
        const file = Math.floor(locationX / squareSize);
        const rank = Math.floor(locationY / squareSize);

        // Convert display coordinates to logical coordinates
        const logicFile = orientation === 'white' ? file : 7 - file;
        const logicRank = orientation === 'white' ? 7 - rank : rank;

        if (
          logicFile >= 0 &&
          logicFile < 8 &&
          logicRank >= 0 &&
          logicRank < 8
        ) {
          onSquareTap(logicFile, logicRank);
        }
      }}
      style={[styles.container, { width: boardSize, height: boardSize }]}
    >
      <BoardBackground
        size={boardSize}
        orientation={orientation}
        colorScheme={colorScheme}
      />

      {/* Highlights for last move, selected square, etc. */}
      <Highlights
        size={boardSize}
        squareSize={squareSize}
        selected={selected}
        lastMove={lastMove}
        premove={game?.premove}
        checkSquare={checkSquare}
        lastMoveColor={colorScheme.lastMove}
        selectedColor={colorScheme.selected}
        premoveColor={colorScheme.selected}
        orientation={orientation}
      />

      {/* Valid move markers (dots and rings) */}
      <ValidMovesMarkers
        size={boardSize}
        squareSize={squareSize}
        validDests={validDests}
        premoveDests={premoveDests}
        pieces={pieces}
        color={colorScheme.validMoves}
        premoveColor={colorScheme.validPremoves}
        orientation={orientation}
      />

      {/* Coordinates (a-h, 1-8) */}
      {settings.enableCoordinates && (
        <Coordinates
          size={boardSize}
          squareSize={squareSize}
          orientation={orientation}
          lightSquareColor="#F0D9B5"
          darkSquareColor="#B58863"
        />
      )}

      {/* Pieces */}
      {Array.from(pieces.entries()).map(([key, piece]) => {
        const pos = key2pos(key);
        const file = orientation === 'white' ? pos[0] : 7 - pos[0];
        const rank = orientation === 'white' ? 7 - pos[1] : pos[1];

        const x = file * squareSize;
        const y = rank * squareSize;

        return (
          <AnimatedPiece
            key={key}
            piece={piece}
            size={squareSize}
            initialX={x}
            initialY={y}
            enabled={!!game}
            animationDuration={settings.animationDuration}
            onSelect={() => onSquareTap(pos[0], pos[1])} // Immediate selection
            onDrop={(tx: number, ty: number) => onPieceDrop(key, tx, ty)} // Drag drop
          />
        );
      })}

      {/* Promotion selector */}
      {game?.promotionMove && game?.onPromotionSelection && (
        <PromotionSelector
          move={game.promotionMove}
          color={game.sideToMove}
          squareSize={squareSize}
          orientation={orientation}
          onSelect={(role) => game.onPromotionSelection?.(role)}
          onCancel={() => game.onPromotionSelection?.(undefined)}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
});
