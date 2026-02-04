import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { Key, Pieces } from '../types';

interface ValidMovesMarkersProps {
  size: number;
  squareSize: number;
  validDests: Set<Key>;
  pieces: Pieces;
  color?: string;
  orientation: 'white' | 'black';
}

// Helper to convert square key to board coordinates
const key2coords = (
  key: string,
  orientation: 'white' | 'black'
): [number, number] => {
  const file = key.charCodeAt(0) - 'a'.charCodeAt(0);
  const rankChar = key.charAt(1);
  const rank = parseInt(rankChar, 10) - 1;

  const displayFile = orientation === 'white' ? file : 7 - file;
  const displayRank = orientation === 'white' ? 7 - rank : rank;

  return [displayFile, displayRank];
};

export const ValidMovesMarkers: React.FC<ValidMovesMarkersProps> = ({
  size,
  squareSize,
  validDests,
  pieces,
  color = 'rgba(20, 85, 30, 0.5)',
  orientation,
}) => {
  const markers = useMemo(() => {
    return Array.from(validDests).map((dest) => {
      const [file, rank] = key2coords(dest, orientation);
      const x = file * squareSize + squareSize / 2;
      const y = rank * squareSize + squareSize / 2;
      const occupied = pieces.has(dest);

      if (occupied) {
        // Ring for occupied squares (stroke circle)
        const radius = squareSize - squareSize / 3;
        const strokeWidth = squareSize / 5;

        return (
          <Circle
            key={`marker-${dest}`}
            cx={x}
            cy={y}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );
      } else {
        // Dot for empty squares
        const radius = squareSize / 6;

        return (
          <Circle
            key={`marker-${dest}`}
            cx={x}
            cy={y}
            r={radius}
            fill={color}
          />
        );
      }
    });
  }, [validDests, pieces, squareSize, color, orientation]);

  if (validDests.size === 0) {
    return null;
  }

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      pointerEvents="none"
    >
      <Svg width={size} height={size}>
        {markers}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
