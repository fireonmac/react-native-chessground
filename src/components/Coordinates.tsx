import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CoordinatesProps {
  size: number;
  squareSize: number;
  orientation: 'white' | 'black';
  lightSquareColor: string;
  darkSquareColor: string;
  fontSize?: number;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const Coordinates: React.FC<CoordinatesProps> = ({
  size,
  squareSize,
  orientation,
  lightSquareColor,
  darkSquareColor,
  fontSize = 10,
}) => {
  const fileLabels = orientation === 'white' ? files : [...files].reverse();
  const rankLabels = orientation === 'white' ? [...ranks].reverse() : ranks;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      pointerEvents="none"
    >
      {/* File coordinates (a-h) - bottom edge (rank 7) */}
      {fileLabels.map((file, fileIndex) => {
        const rankIndex = 7; // bottom row
        const isLightSquare = (fileIndex + rankIndex) % 2 === 0;
        const textColor = isLightSquare ? darkSquareColor : lightSquareColor;

        return (
          <Text
            key={`file-${file}`}
            style={[
              styles.fileLabel,
              {
                left: fileIndex * squareSize + 2,
                bottom: 2,
                color: textColor,
                fontSize,
              },
            ]}
          >
            {file}
          </Text>
        );
      })}

      {/* Rank coordinates (1-8) - right edge (file 7) */}
      {rankLabels.map((rank, rankIndex) => {
        const fileIndex = 7; // rightmost column
        const isLightSquare = (fileIndex + rankIndex) % 2 === 0;
        const textColor = isLightSquare ? darkSquareColor : lightSquareColor;

        return (
          <Text
            key={`rank-${rank}`}
            style={[
              styles.rankLabel,
              {
                top: rankIndex * squareSize + 2,
                right: 2,
                color: textColor,
                fontSize,
              },
            ]}
          >
            {rank}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fileLabel: {
    position: 'absolute',
    fontWeight: 'bold',
  },
  rankLabel: {
    position: 'absolute',
    fontWeight: 'bold',
  },
});
