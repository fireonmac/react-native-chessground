import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

interface CheckHighlightProps {
  size: number;
}

/**
 * A component that displays a check highlight with radial gradient.
 * Matches Flutter's CheckHighlight styling.
 */
export const CheckHighlight: React.FC<CheckHighlightProps> = ({ size }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient
            id="checkGradient"
            cx="50%"
            cy="50%"
            r="60%"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#FF0000" stopOpacity="1" />
            <Stop offset="25%" stopColor="#E70000" stopOpacity="1" />
            <Stop offset="90%" stopColor="#A90000" stopOpacity="0" />
            <Stop offset="100%" stopColor="#9E0000" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill="url(#checkGradient)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
});
