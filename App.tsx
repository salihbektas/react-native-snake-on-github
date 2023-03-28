import React, { useEffect } from 'react';
import {
  Button,
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


  function up(){
    console.log('up')
  }
  function down(){
    console.log('down')
  }
  function left(){
    console.log('left')
  }
  function right(){
    console.log('right')
  }

  return (
    <SafeAreaView style={styles.main}>
      <Text>Deneme</Text>
      <View style={styles.board}>
        {tiles}
      </View>
      <View>
      <Button title='up' onPress={up}/>
      <View style={{flexDirection: 'row'}}>
        <View style={{width:'50%'}}>
          <Button title='left' onPress={left}/>
        </View>
        <View style={{width:'50%'}}>
          <Button title='right' onPress={right}/>
        </View>
      </View>
      <Button title='down' onPress={down}/>
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
