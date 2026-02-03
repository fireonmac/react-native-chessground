import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
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
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Reset position if initialX/Y changes (though usually component unmounts on move)
  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
  }, [initialX, initialY, translateX, translateY]);

  const pan = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;
      runOnJS(onDrop)(translateX.value, translateY.value);
      // Snap back if not unmounted (invalid move)
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: initialX + translateX.value },
        { translateY: initialY + translateY.value },
        { scale: isDragging.value ? 1.2 : 1 }, // Visual feedback
      ],
      zIndex: isDragging.value ? 100 : 1, // Bring to front
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[styles.container, { width: size, height: size }, animatedStyle]}
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
