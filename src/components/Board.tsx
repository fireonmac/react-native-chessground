import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import type { GameData } from '../types';
import { defaultSettings } from '../config';
import type { ChessboardSettings } from '../config';
import { useBoardLogic } from '../hooks/useBoardLogic';
import { BoardBackground } from './BoardBackground';
import { Piece } from './Piece';
import { key2pos } from '../util';

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
  const { pieces } = useBoardLogic({
    fen,
    game,
    settings,
  });

  const screenWidth = Dimensions.get('window').width;
  const boardSize = side || screenWidth;
  const squareSize = boardSize / 8;

  const colorScheme = settings.colorScheme || defaultSettings.colorScheme!;
  const orientation = game?.playerSide === 'black' ? 'black' : 'white';

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
          <View
            key={key}
            style={[
              styles.pieceContainer,
              {
                width: squareSize,
                height: squareSize,
                transform: [{ translateX: x }, { translateY: y }],
              },
            ]}
          >
            <Piece piece={piece} size={squareSize} />
          </View>
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
  pieceContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
