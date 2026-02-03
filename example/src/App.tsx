// import React from 'react'; // Unused with react-jsx
import { StyleSheet, View, Text } from 'react-native';
import { Board } from 'react-native-chessground';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chessground Demo</Text>
      <Board fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />
    </View>
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
