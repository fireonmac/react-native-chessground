import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Piece } from './Piece';
import type { Piece as PieceModel } from '../types';

interface AnimatedPieceProps {
  piece: PieceModel;
  size: number;
  initialX: number;
  initialY: number;
  onTap?: () => void;
  enabled?: boolean;
  animationDuration?: number;
}

export const AnimatedPiece: React.FC<AnimatedPieceProps> = ({
  piece,
  size,
  initialX,
  initialY,
  onTap,
  enabled = true,
  animationDuration = 250,
}) => {
  const translateX = useRef(new Animated.Value(initialX)).current;
  const translateY = useRef(new Animated.Value(initialY)).current;

  useEffect(() => {
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
  }, [initialX, initialY, animationDuration, translateX, translateY]);

  return (
    <TouchableOpacity
      disabled={!enabled}
      onPress={onTap}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ translateX }, { translateY }],
        }}
      >
        <Piece piece={piece} size={size} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
