import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Board, PlayerSide, Side } from 'react-native-chessground';

export default function App() {
  const [fen] = useState(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Chessground Demo</Text>
        <Board
          fen={fen}
          game={{
            playerSide: PlayerSide.WHITE,
            sideToMove: Side.WHITE,
            onMove: ({ from, to }: { from: string; to: string }) => {
              console.log(`Move ${from} -> ${to}`);
            },
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
});
