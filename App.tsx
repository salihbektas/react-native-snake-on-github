import React, { useRef, useState } from 'react';
import {
  Animated,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import useInterval from 'use-interval';

interface snakeNode {
  x: number;
  y: number;
}

const TICK_TIME = 300

function App(): JSX.Element {

  const tiles = []

  const [currentDirection, setCurrentDirection] = useState('')
  const [nextDirection, setNextDirection] = useState('')

  const head = useRef(new Animated.ValueXY()).current
  const t1 = useRef(new Animated.ValueXY()).current
  const t2 = useRef(new Animated.ValueXY()).current
  const t3 = useRef(new Animated.ValueXY()).current

  const snakeNodes = useRef<snakeNode[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  for (let i = 0; i < 49; ++i)
    tiles.push(
      <View style={{ ...styles.tile, backgroundColor: i % 2 === 0 ? 'darkgrey' : 'lightgrey' }} key={i} />
    )


  function tick() {
    setCurrentDirection(nextDirection)
    
    snakeNodes.current[3].x = snakeNodes.current[2].x
    snakeNodes.current[3].y = snakeNodes.current[2].y
    snakeNodes.current[2].x = snakeNodes.current[1].x
    snakeNodes.current[2].y = snakeNodes.current[1].y
    snakeNodes.current[1].x = snakeNodes.current[0].x
    snakeNodes.current[1].y = snakeNodes.current[0].y

    if (currentDirection === 'up' && snakeNodes.current[0].y > 0)
      snakeNodes.current[0].y -= 50
    if (currentDirection === 'left' && snakeNodes.current[0].x > 0)
      snakeNodes.current[0].x -= 50
    if (currentDirection === 'right' && snakeNodes.current[0].x < 300)
      snakeNodes.current[0].x += 50
    if (currentDirection === 'down' && snakeNodes.current[0].y < 300)
      snakeNodes.current[0].y += 50

    Animated.parallel([
      Animated.timing(head, {
        toValue: { x: snakeNodes.current[0].x, y: snakeNodes.current[0].y },
        duration: TICK_TIME,
        useNativeDriver: true,
      }),

      Animated.timing(t1, {
        toValue: { x: snakeNodes.current[1].x, y: snakeNodes.current[1].y },
        duration: TICK_TIME,
        useNativeDriver: true,
      }),

      Animated.timing(t2, {
        toValue: { x: snakeNodes.current[2].x, y: snakeNodes.current[2].y },
        duration: TICK_TIME,
        useNativeDriver: true,
      }),

      Animated.timing(t3, {
        toValue: { x: snakeNodes.current[3].x, y: snakeNodes.current[3].y },
        duration: TICK_TIME,
        useNativeDriver: true,
      })
    ]).start()
  }

  useInterval(tick, TICK_TIME)

  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.board}>
        <Animated.View style={{
          height: 50, aspectRatio: 1, backgroundColor: 'red', zIndex: 4, position: 'absolute',
          transform: [
            { translateX: head.x },
            { translateY: head.y }
          ]
        }}
        />

        <Animated.View style={{
          height: 50, aspectRatio: 1, backgroundColor: 'blue', zIndex: 3, position: 'absolute',
          transform: [
            { translateX: t1.x },
            { translateY: t1.y }
          ]
        }}
        />

        <Animated.View style={{
          height: 50, aspectRatio: 1, backgroundColor: 'purple', zIndex: 2, position: 'absolute',
          transform: [
            { translateX: t2.x },
            { translateY: t2.y }
          ]
        }}
        />

        <Animated.View style={{
          height: 50, aspectRatio: 1, backgroundColor: 'orange', zIndex: 1, position: 'absolute',
          transform: [
            { translateX: t3.x },
            { translateY: t3.y }
          ]
        }}
        />

        {tiles}
      </View>
      <View>
        <Button title='up' onPress={() => { if (currentDirection !== 'down') setNextDirection('up') }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <Button title='left' onPress={() => { if (currentDirection !== 'right') setNextDirection('left') }} />
          </View>
          <View style={{ width: '50%' }}>
            <Button title='right' onPress={() => { if (currentDirection !== 'left') setNextDirection('right') }} />
          </View>
        </View>
        <Button title='down' onPress={() => { if (currentDirection !== 'up') setNextDirection('down') }} />
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
