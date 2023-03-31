import React, { useRef, useState } from 'react';
import {
  Animated,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import useInterval from 'use-interval';


function App(): JSX.Element {

  const tiles = []

  const [direction, setDirection] = useState('')

  const moveH = useRef(new Animated.Value(0)).current

  const posH = useRef(0)

  const moveV = useRef(new Animated.Value(0)).current

  const posV = useRef(0)

  for (let i = 0; i < 49; ++i)
    tiles.push(
      <View style={{ ...styles.tile, backgroundColor: i % 2 === 0 ? 'darkgrey' : 'lightgrey' }} key={i} />
    )


  function up() {
    if(posV.current > 0){
      posV.current -= 1
      Animated.timing(moveV, {
        toValue: posV.current,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }
  function down() {
    if(posV.current < 6){
      posV.current += 1
      Animated.timing(moveV, {
        toValue: posV.current,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }
  function left() {
    if(posH.current > 0){
      posH.current -= 1
      Animated.timing(moveH, {
        toValue: posH.current,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }
  function right() {
    if(posH.current < 6){
      posH.current += 1
      Animated.timing(moveH, {
        toValue: posH.current,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }

  function tick() {
    if(direction === 'up')
      up()
    if(direction === 'left')
      left()
    if(direction === 'right')
      right()
    if(direction === 'down')
      down()

  }

  useInterval(tick, 500)

  return (
    <SafeAreaView style={styles.main}>
      
      <View style={styles.board}>
        <Animated.View style={{
          height: 50, aspectRatio: 1, backgroundColor: 'red', zIndex: 1, position: 'absolute',
          transform: [
            { translateX: moveH.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
            { translateY: moveV.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) }
          ]
        }}
        />
        {tiles}
      </View>
      <View>
        <Button title='up' onPress={() => setDirection('up')} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <Button title='left' onPress={() => setDirection('left')} />
          </View>
          <View style={{ width: '50%' }}>
            <Button title='right' onPress={() => setDirection('right')} />
          </View>
        </View>
        <Button title='down' onPress={() => setDirection('down')} />
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
    flexWrap: 'wrap',
    width: 350,
    aspectRatio: 1
  }
});

export default App;
