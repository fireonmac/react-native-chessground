import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Piece as PieceModel } from '../types';

export interface PieceProps {
  piece: PieceModel;
  size: number;
}

export const Piece: React.FC<PieceProps> = ({ piece, size }) => {
  // TODO: Load actual assets based on piece.role and piece.color
  // For now, render text
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.8 }}>
        {piece.color === 'white'
          ? piece.role[0].toUpperCase()
          : piece.role[0].toLowerCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
