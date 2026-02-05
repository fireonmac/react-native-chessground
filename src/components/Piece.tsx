import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import type { Piece as PieceModel } from '../types';
import { getPieceAsset } from '../images';

export interface PieceProps {
  piece: PieceModel;
  size: number;
  pieceSet?: string; // e.g. 'cburnett'
}

export const Piece: React.FC<PieceProps> = ({
  piece,
  size,
  pieceSet = 'cburnett',
}) => {
  const source = getPieceAsset(pieceSet, piece.color, piece.role);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
