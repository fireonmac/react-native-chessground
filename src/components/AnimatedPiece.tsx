import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Piece } from './Piece';
import type { Piece as PieceModel } from '../types';

interface AnimatedPieceProps {
  piece: PieceModel;
  size: number;
  initialX: number;
  initialY: number;
  onDragStart?: () => void; // Called when drag gesture starts
  onDrop: (translateX: number, translateY: number) => void;
  enabled?: boolean;
  animationDuration?: number;
}

export const AnimatedPiece: React.FC<AnimatedPieceProps> = ({
  piece,
  size,
  initialX,
  initialY,
  onDragStart,
  onDrop,
  enabled = true,
  animationDuration = 250,
}) => {
  // Animated values for smooth transitions
  const translateX = useRef(new Animated.Value(initialX)).current;
  const translateY = useRef(new Animated.Value(initialY)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Track drag offset separately
  const dragOffsetX = useRef(new Animated.Value(0)).current;
  const dragOffsetY = useRef(new Animated.Value(0)).current;

  const [isDragging, setIsDragging] = useState(false);

  // Animate to new position when initialX or initialY changes (tap-to-move)
  useEffect(() => {
    if (!isDragging) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: initialX,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: initialY,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    initialX,
    initialY,
    animationDuration,
    translateX,
    translateY,
    isDragging,
  ]);

  const pan = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => {
      onDragStart?.(); // Notify parent that drag started (selects piece)
      setIsDragging(true);
      Animated.spring(scale, {
        toValue: 1.2,
        useNativeDriver: true,
      }).start();
    })
    .onUpdate((event) => {
      dragOffsetX.setValue(event.translationX);
      dragOffsetY.setValue(event.translationY);
    })
    .onEnd((event) => {
      setIsDragging(false);

      // Reset scale
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Call onDrop with final translation
      onDrop(event.translationX, event.translationY);

      // Reset drag offset
      dragOffsetX.setValue(0);
      dragOffsetY.setValue(0);
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            transform: [
              { translateX: Animated.add(translateX, dragOffsetX) },
              { translateY: Animated.add(translateY, dragOffsetY) },
              { scale },
            ],
            zIndex: isDragging ? 100 : 1,
          },
        ]}
      >
        <Piece piece={piece} size={size} />
      </Animated.View>
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
