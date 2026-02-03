import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameData } from '../types';
import { ChessboardSettings, defaultSettings } from '../config';
import { useBoardLogic } from '../hooks/useBoardLogic';
import { Key } from '../types';

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
  const { pieces, onSelectSquare, selected } = useBoardLogic({
    fen,
    game,
    settings,
  });

  const screenWidth = Dimensions.get('window').width;
  const boardSize = side || screenWidth;
  const squareSize = boardSize / 8;

  // Placeholder for pieces rendering
  // Actual rendering will happen in a separate layer (Svg or Absolute Views)
  // For now, simple view container
  return (
    <View style={[styles.container, { width: boardSize, height: boardSize }]}>
      {/* Background (TODO: SVG Board) */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: settings.colorScheme?.background || '#d18b47' },
        ]}
      />

      {/* Pieces */}
      {Array.from(pieces.entries()).map(([key, piece]) => {
        // TODO: Convert key (a1) to coordinates (x, y)
        // For now just empty placeholder to verify loop
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
