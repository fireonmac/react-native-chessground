import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import type { GameData } from '../types';
import { defaultSettings } from '../config';
import type { ChessboardSettings } from '../config';
import { useBoardLogic } from '../hooks/useBoardLogic';
import { BoardBackground } from './BoardBackground';
import { DraggablePiece } from './DraggablePiece';
import { key2pos, pos2key } from '../util';

export interface BoardProps {
  fen: string;
  game?: GameData;
  settings?: ChessboardSettings;
  side?: number; // Size in pixels, undefined = auto fit width
}

export const Board: React.FC<BoardProps> = ({
  fen,
  game,
  settings = defaultSettings,
  side,
}) => {
  const { pieces, onMove } = useBoardLogic({
    fen,
    game,
    settings,
  });

  const screenWidth = Dimensions.get('window').width;
  const boardSize = side || screenWidth;
  const squareSize = boardSize / 8;

  const colorScheme = settings.colorScheme || defaultSettings.colorScheme!;
  const orientation = game?.playerSide === 'black' ? 'black' : 'white';

  const onPieceDrop = (key: string, tx: number, ty: number) => {
    const pos = key2pos(key);
    // orientation processing (reverse of render)
    // rendered x = file * squareSize
    // rendered y = rank * squareSize

    // Logic coordinates (0-7, 0-7)
    // Board coordinates (pixels)
    // currentX = startX + tx
    // currentY = startY + ty

    // We need target square relative to board 0,0
    // startX, startY are calculated in render
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
      // Convert/Reverse orientation
      const logicFile = orientation === 'white' ? targetFile : 7 - targetFile;
      const logicRank = orientation === 'white' ? 7 - targetRank : targetRank;

      const destKey = pos2key([logicFile, logicRank]);
      if (destKey) {
        onMove(key, destKey);
      }
    }
  };

  return (
    <View style={[styles.container, { width: boardSize, height: boardSize }]}>
      <BoardBackground
        size={boardSize}
        orientation={orientation}
        colorScheme={colorScheme}
      />

      {/* Pieces */}
      {Array.from(pieces.entries()).map(([key, piece]) => {
        const pos = key2pos(key);
        // orientation processing
        const file = orientation === 'white' ? pos[0] : 7 - pos[0];
        const rank = orientation === 'white' ? 7 - pos[1] : pos[1];

        const x = file * squareSize;
        const y = rank * squareSize;

        return (
          <DraggablePiece
            key={key}
            piece={piece}
            size={squareSize}
            initialX={x}
            initialY={y}
            enabled={!!game} // Interaction enabled only if game data present
            onDrop={(tx: number, ty: number) => onPieceDrop(key, tx, ty)}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden', // Ensure pieces don't overflow board
  },
});
