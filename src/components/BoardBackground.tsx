import React, { useMemo } from 'react';
import Svg, { Rect, G } from 'react-native-svg';
import type { ChessboardColorScheme } from '../config';

export interface BoardBackgroundProps {
  size: number;
  orientation?: 'white' | 'black'; // Kept for interface consistency
  colorScheme: ChessboardColorScheme;
}

export const BoardBackground: React.FC<BoardBackgroundProps> = ({
  size,
  colorScheme,
}) => {
  const squareSize = size / 8;

  const squares = useMemo(() => {
    const rects = [];
    const lightColor = '#F0D9B5'; // Default light color (TODO: Add to ColorScheme?)
    const darkColor = colorScheme.background || '#B58863'; // Use scheme background as dark color

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isWhite = (rank + file) % 2 === 0;
        const fill = isWhite ? lightColor : darkColor;

        rects.push(
          <Rect
            key={`${file}-${rank}`}
            x={file * squareSize}
            y={rank * squareSize}
            width={squareSize}
            height={squareSize}
            fill={fill}
          />
        );
      }
    }
    return rects;
  }, [squareSize, colorScheme]); // squareSize depends on size

  return (
    <Svg width={size} height={size}>
      <G>{squares}</G>
    </Svg>
  );
};
