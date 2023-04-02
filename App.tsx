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

  const head = useRef(new Animated.ValueXY()).current

  const posH = useRef(0)
  const posV = useRef(0)

  for (let i = 0; i < 49; ++i)
    tiles.push(
      <View style={{ ...styles.tile, backgroundColor: i % 2 === 0 ? 'darkgrey' : 'lightgrey' }} key={i} />
    )


  function tick() {
    if (direction === 'up' && posV.current > 0)
      posV.current -= 50
    if (direction === 'left' && posH.current > 0)
      posH.current -= 50
    if (direction === 'right' && posH.current < 300)
      posH.current += 50
    if (direction === 'down' && posV.current < 300)
      posV.current += 50

    Animated.timing(head, {
      toValue: { x: posH.current, y: posV.current },
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  useInterval(tick, 500)

  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.board}>
        <Animated.View style={{
          height: 50, aspectRatio: 1, backgroundColor: 'red', zIndex: 1, position: 'absolute',
          transform: [
            { translateX: head.x },
            { translateY: head.y }
          ]
        }}
        />
        {tiles}
      </View>
      <View>
        <Button title='up' onPress={() => { if (direction !== 'down') setDirection('up') }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <Button title='left' onPress={() => { if (direction !== 'right') setDirection('left') }} />
          </View>
          <View style={{ width: '50%' }}>
            <Button title='right' onPress={() => { if (direction !== 'left') setDirection('right') }} />
          </View>
        </View>
        <Button title='down' onPress={() => { if (direction !== 'up') setDirection('down') }} />
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
