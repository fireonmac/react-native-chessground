import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import type { GameData } from '../types';
import { defaultSettings } from '../config';
import type { ChessboardSettings } from '../config';
import { useBoardLogic } from '../hooks/useBoardLogic';
import { BoardBackground } from './BoardBackground';
import { DraggablePiece } from './DraggablePiece';
import { Highlights } from './Highlights';
import { ValidMovesMarkers } from './ValidMovesMarkers';
import { Coordinates } from './Coordinates';
import { key2pos, pos2key } from '../util';

export interface BoardProps {
  fen: string;
  game?: GameData;
  settings?: ChessboardSettings;
  side?: number; // Size in pixels, undefined = auto fit width
  lastMove?: { from: string; to: string };
}

export const Board: React.FC<BoardProps> = ({
  fen,
  game,
  settings = defaultSettings,
  side,
  lastMove,
}) => {
  const { pieces, selected, validDests, onMove, onSelectSquare } =
    useBoardLogic({
      fen,
      game,
      settings,
    });

  const screenWidth = Dimensions.get('window').width;
  const boardSize = side || screenWidth;
  const squareSize = boardSize / 8;

  const colorScheme = settings.colorScheme || defaultSettings.colorScheme!;
  const orientation = game?.playerSide === 'black' ? 'black' : 'white';

  // Handle tap on a square
  const onSquareTap = (file: number, rank: number) => {
    console.log('Square tapped:', file, rank);
    const key = pos2key([file, rank]);
    console.log('Key:', key);
    if (key) {
      onSelectSquare(key);
    }
  };

  // Handle piece drop (drag gesture)
  const onPieceDrop = (key: string, tx: number, ty: number) => {
    const pos = key2pos(key);
    const file = orientation === 'white' ? pos[0] : 7 - pos[0];
    const rank = orientation === 'white' ? 7 - pos[1] : pos[1];
    const startX = file * squareSize;
    const startY = rank * squareSize;

    const targetX = startX + tx;
    const targetY = startY + ty;

    const targetFile = Math.floor(targetX / squareSize + 0.5);
    const targetRank = Math.floor(targetY / squareSize + 0.5);

    if (
      targetFile >= 0 &&
      targetFile <= 7 &&
      targetRank >= 0 &&
      targetRank <= 7
    ) {
      const logicFile = orientation === 'white' ? targetFile : 7 - targetFile;
      const logicRank = orientation === 'white' ? 7 - targetRank : targetRank;

      const destKey = pos2key([logicFile, logicRank]);
      if (destKey) {
        onMove(key, destKey);
      }
    }
  };

  // Render tap areas for each square
  const renderTapAreas = () => {
    const tapAreas = [];
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const displayFile = orientation === 'white' ? file : 7 - file;
        const displayRank = orientation === 'white' ? 7 - rank : rank;

        tapAreas.push(
          <TouchableWithoutFeedback
            key={`tap-${file}-${rank}`}
            onPress={() => onSquareTap(file, rank)}
          >
            <View
              pointerEvents="box-only"
              style={{
                position: 'absolute',
                left: displayFile * squareSize,
                top: displayRank * squareSize,
                width: squareSize,
                height: squareSize,
                zIndex: 100, // Above pieces
              }}
            />
          </TouchableWithoutFeedback>
        );
      }
    }
    return tapAreas;
  };

  return (
    <View style={[styles.container, { width: boardSize, height: boardSize }]}>
      <BoardBackground
        size={boardSize}
        orientation={orientation}
        colorScheme={colorScheme}
      />

      {/* Highlights for last move, selected square, etc. */}
      <Highlights
        size={boardSize}
        squareSize={squareSize}
        selected={selected}
        lastMove={lastMove}
        orientation={orientation}
      />

      {/* Valid move markers (dots and rings) */}
      <ValidMovesMarkers
        size={boardSize}
        squareSize={squareSize}
        validDests={validDests}
        pieces={pieces}
        orientation={orientation}
      />

      {/* Coordinates (a-h, 1-8) */}
      {settings.enableCoordinates && (
        <Coordinates
          size={boardSize}
          squareSize={squareSize}
          orientation={orientation}
          lightSquareColor="#F0D9B5"
          darkSquareColor="#B58863"
        />
      )}

      {/* Pieces */}
      {Array.from(pieces.entries()).map(([key, piece]) => {
        const pos = key2pos(key);
        const file = orientation === 'white' ? pos[0] : 7 - pos[0];
        const rank = orientation === 'white' ? 7 - pos[1] : pos[1];

        const x = file * squareSize;
        const y = rank * squareSize;

        return (
          <DraggablePiece
            key={key}
            piece={piece}
            size={squareSize}
            initialX={x}
            initialY={y}
            enabled={!!game}
            onDrop={(tx: number, ty: number) => onPieceDrop(key, tx, ty)}
          />
        );
      })}

      {/* Tap areas for square selection - MUST render AFTER pieces */}
      {game && renderTapAreas()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
});
