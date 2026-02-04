import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Piece } from './Piece';
import type { Piece as PieceModel } from '../types';

interface DraggablePieceProps {
  piece: PieceModel;
  size: number;
  initialX: number;
  initialY: number;
  onDrop: (translateX: number, translateY: number) => void;
  enabled?: boolean;
}

export const DraggablePiece: React.FC<DraggablePieceProps> = ({
  piece,
  size,
  initialX,
  initialY,
  onDrop,
  enabled = true,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const pan = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => {
      setIsDragging(true);
    })
    .onUpdate((event) => {
      setPosition({
        x: event.translationX,
        y: event.translationY,
      });
    })
    .onEnd(() => {
      setIsDragging(false);
      onDrop(position.x, position.y);
      // Reset position
      setPosition({ x: 0, y: 0 });
    });

  const combinedStyle: any = [
    {
      ...styles.container,
      width: size,
      height: size,
      transform: [
        { translateX: initialX + position.x },
        { translateY: initialY + position.y },
        { scale: isDragging ? 1.2 : 1 },
      ],
      zIndex: isDragging ? 100 : 1,
    },
  ];

  return (
    <GestureDetector gesture={pan}>
      <View style={combinedStyle}>
        <Piece piece={piece} size={size} />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
