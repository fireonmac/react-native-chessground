import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { CheckHighlight } from './CheckHighlight';

interface HighlightsProps {
  size: number;
  squareSize: number;
  selected?: string;
  lastMove?: { from: string; to: string };
  premove?: { from: string; to: string };
  checkSquare?: string;
  customHighlights?: Map<string, { color: string; opacity?: number }>;
  orientation: 'white' | 'black';
  lastMoveColor?: string;
  selectedColor?: string;
  premoveColor?: string;
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

export const Highlights: React.FC<HighlightsProps> = ({
  size,
  squareSize,
  selected,
  lastMove,
  premove,
  checkSquare,
  customHighlights,
  orientation,
  lastMoveColor = 'rgba(156, 199, 0, 0.5)',
  selectedColor = 'rgba(20, 85, 30, 0.5)',
  premoveColor = 'rgba(20, 85, 30, 0.5)',
}) => {
  const renderHighlight = (
    key: string,
    color: string,
    opacity: number = 0.4,
    uniqueKey: string
  ) => {
    const [file, rank] = key2coords(key, orientation);
    const x = file * squareSize;
    const y = rank * squareSize;

    return (
      <Rect
        key={uniqueKey}
        x={x}
        y={y}
        width={squareSize}
        height={squareSize}
        fill={color}
        opacity={opacity}
      />
    );
  };

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      pointerEvents="none"
    >
      <Svg width={size} height={size}>
        {/* Last move highlights */}
        {lastMove && (
          <>
            {renderHighlight(lastMove.from, lastMoveColor, 1, 'lastmove-from')}
            {renderHighlight(lastMove.to, lastMoveColor, 1, 'lastmove-to')}
          </>
        )}

        {/* Selected square highlight */}
        {selected && renderHighlight(selected, selectedColor, 1, 'selected')}

        {/* Premove highlight (from and to squares) */}
        {premove && (
          <>
            {renderHighlight(premove.from, premoveColor, 0.6, 'premove-from')}
            {renderHighlight(premove.to, premoveColor, 0.6, 'premove-to')}
          </>
        )}

        {/* Custom highlights */}
        {customHighlights &&
          Array.from(customHighlights.entries()).map(
            ([key, { color, opacity }]) =>
              renderHighlight(key, color, opacity, `custom-${key}`)
          )}
      </Svg>

      {/* Check highlight (rendered outside SVG for proper layering) */}
      {checkSquare &&
        (() => {
          const [file, rank] = key2coords(checkSquare, orientation);
          const x = file * squareSize;
          const y = rank * squareSize;
          return (
            <View
              key="check-highlight"
              style={{
                position: 'absolute',
                left: x,
                top: y,
              }}
            >
              <CheckHighlight size={squareSize} />
            </View>
          );
        })()}
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
