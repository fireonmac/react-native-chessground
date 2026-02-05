import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Piece } from './Piece';
import type { Piece as PieceModel } from '../types';

interface AnimatedPieceProps {
  piece: PieceModel;
  size: number;
  initialX: number;
  initialY: number;
  onSelect: () => void; // NEW: Immediate selection (shows valid moves)
  onDrop: (translateX: number, translateY: number) => void;
  enabled?: boolean;
  animationDuration?: number;
}

export const AnimatedPiece: React.FC<AnimatedPieceProps> = ({
  piece,
  size,
  initialX,
  initialY,
  onSelect,
  onDrop,
  enabled = true,
  animationDuration = 250,
}) => {
  const translateX = useRef(new Animated.Value(initialX)).current;
  const translateY = useRef(new Animated.Value(initialY)).current;
  const dragOffsetX = useRef(new Animated.Value(0)).current;
  const dragOffsetY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [isDragging, setIsDragging] = useState(false);

  // Animate to new position when initialX/initialY changes
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
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      onDrop(event.translationX, event.translationY);

      dragOffsetX.setValue(0);
      dragOffsetY.setValue(0);
    });

  return (
    <View
      onTouchStart={() => {
        // IMMEDIATE selection (like Flutter's onPointerDown)
        // This fires BEFORE Pan gesture activates
        onSelect();
      }}
      style={styles.touchContainer}
    >
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.pieceContainer,
            {
              width: size,
              height: size,
              transform: [
                { translateX: Animated.add(translateX, dragOffsetX) },
                { translateY: Animated.add(translateY, dragOffsetY) },
                { scale },
              ],
              zIndex: isDragging ? 100 : 60,
            },
          ]}
        >
          <Piece piece={piece} size={size} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  touchContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  pieceContainer: {
    position: 'absolute',
  },
});
