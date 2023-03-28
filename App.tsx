import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';


function App(): JSX.Element {

  const tiles = []


  for(let i = 0; i < 49; ++i)
    tiles.push(
      <View style={{...styles.tile, backgroundColor: i%2 === 0 ? 'darkgrey' : 'lightgrey'}} key={i}/>
    )


  return (
    <SafeAreaView style={styles.main}>
      <Text>Deneme</Text>
      <View style={styles.board}>
        {tiles}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },

  tile: {
    height: 50,
    aspectRatio: 1
  },

  board: {
    flexDirection: 'row',
    flexWrap:'wrap',
    width: 350,
    aspectRatio: 1
  }
});

export default App;
