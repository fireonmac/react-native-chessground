import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import type { PieceRole, Key } from '../types';
import { getPieceAsset } from '../images';

type Side = 'white' | 'black';

export interface PromotionMove {
  from: Key;
  to: Key;
}

interface PromotionSelectorProps {
  move: PromotionMove;
  color: Side;
  squareSize: number;
  orientation: Side;
  onSelect: (role: PieceRole) => void;
  onCancel: () => void;
}

export const PromotionSelector: React.FC<PromotionSelectorProps> = ({
  move,
  color,
  squareSize,
  orientation,
  onSelect,
  onCancel,
}) => {
  // Parse the square to get file and rank (e.g., "e8" -> file: 4, rank: 7)
  const file = move.to.charCodeAt(0) - 'a'.charCodeAt(0); // 0-7
  const rankStr = move.to[1];
  if (!rankStr) return null; // Safety check
  const rank = parseInt(rankStr, 10) - 1; // 0-7

  // Determine if promotion square is at top
  const isPromotionSquareAtTop =
    (orientation === 'white' && rank === 7) ||
    (orientation === 'black' && rank === 0);

  // Calculate anchor square position
  const anchorRank = isPromotionSquareAtTop
    ? rank
    : orientation === 'white'
    ? 3
    : 4;

  const anchorFile = orientation === 'white' ? file : 7 - file;
  const anchorRankPos = orientation === 'white' ? 7 - anchorRank : anchorRank;

  const left = anchorFile * squareSize;
  const top = anchorRankPos * squareSize;

  // Piece order depends on position
  const pieces: PieceRole[] = isPromotionSquareAtTop
    ? ['queen', 'knight', 'rook', 'bishop']
    : ['bishop', 'rook', 'knight', 'queen'];

  // Get piece image using shared helper
  const getPieceImage = (role: PieceRole) => {
    return getPieceAsset('standard', color, role);
  };

  return (
    <Modal transparent visible animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View
          style={[
            styles.container,
            {
              left,
              top,
              width: squareSize,
              height: squareSize * 4,
            },
          ]}
        >
          {pieces.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.pieceButton,
                { width: squareSize, height: squareSize },
              ]}
              onPress={() => onSelect(role as PieceRole)}
              activeOpacity={0.7}
            >
              <View style={styles.shadow} />
              <Image
                source={getPieceImage(role as PieceRole)}
                style={[
                  styles.pieceImage,
                  {
                    width: squareSize - 10,
                    height: squareSize - 10,
                  },
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 21, 18, 0.7)', // #161512 with 70% opacity
  },
  container: {
    position: 'absolute',
  },
  pieceButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    backgroundColor: '#b0b0b0',
    shadowColor: '#808080',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 10,
  },
  pieceImage: {
    zIndex: 1,
  },
});
