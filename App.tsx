import * as cheerio from 'cheerio';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import useInterval from 'use-interval';

interface snakeNode {
  x: number;
  y: number;
}

const WIDTH = Dimensions.get('screen').width
const STEP = Math.floor(WIDTH/53)
const TICK_TIME = 300

const DAYOFWEEK = new Date().getDay()

function App(): JSX.Element {

  const tiles = []

  const currentDirection = useRef('')
  const nextDirection = useRef('')

  const [heatMap, setHeatMap] = useState<number[]>(new Array(365+DAYOFWEEK).fill(0))

  const head = useRef(new Animated.ValueXY()).current
  const t1 = useRef(new Animated.ValueXY()).current
  const t2 = useRef(new Animated.ValueXY()).current
  const t3 = useRef(new Animated.ValueXY()).current

  const snakeNodes = useRef<snakeNode[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  for (let i = 0; i < 365+DAYOFWEEK; ++i)
    tiles.push(
      <View style={{ ...styles.tile, backgroundColor: i % 2 === 0 ? 'darkgrey' : 'lightgrey' }} key={i} />
    )


  async function getData(username: string) {
    let data = await fetch(`https://github.com/${username}`)
    const $ = cheerio.load(await data.text());
    const $days = $("svg.js-calendar-graph-svg rect.ContributionCalendar-day");
    const newData = [...heatMap]
    $($days.get()).each((id, el) =>  {newData[id] = parseInt($(el).attr('data-level'))})
    setHeatMap(newData)
  }
  function tick() {
    currentDirection.current = nextDirection.current

    snakeNodes.current[3].x = snakeNodes.current[2].x
    snakeNodes.current[3].y = snakeNodes.current[2].y
    snakeNodes.current[2].x = snakeNodes.current[1].x
    snakeNodes.current[2].y = snakeNodes.current[1].y
    snakeNodes.current[1].x = snakeNodes.current[0].x
    snakeNodes.current[1].y = snakeNodes.current[0].y

    if (currentDirection.current === 'up' && snakeNodes.current[0].y > 0)
      snakeNodes.current[0].y -= STEP
    if (currentDirection.current === 'left' && snakeNodes.current[0].x > 0)
      snakeNodes.current[0].x -= STEP
    if (currentDirection.current === 'right' && snakeNodes.current[0].x < STEP * 52)
      snakeNodes.current[0].x += STEP
    if (currentDirection.current === 'down' && snakeNodes.current[0].y < STEP * 6)
      snakeNodes.current[0].y += STEP

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

  useEffect(() => {
    getData('salihbektas')
  }, [])

  useEffect(() => {
    console.log(heatMap)
  }, [heatMap])

  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.board}>
        <Animated.View style={{
          ...styles.head,
          transform: [
            { translateX: head.x },
            { translateY: head.y }
          ]
        }}
        />

        <Animated.View style={{
          ...styles.tail,
          transform: [
            { translateX: t1.x },
            { translateY: t1.y }
          ]
        }}
        />

        <Animated.View style={{
          ...styles.tail,
          transform: [
            { translateX: t2.x },
            { translateY: t2.y }
          ]
        }}
        />

        <Animated.View style={{
          ...styles.tail,
          transform: [
            { translateX: t3.x },
            { translateY: t3.y }
          ]
        }}
        />

        {tiles}
      </View>
      <View style={{marginTop: 15}}>
        <Button title='up' onPress={() => { if (currentDirection.current !== 'down') nextDirection.current = 'up' }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <Button title='left' onPress={() => { if (currentDirection.current !== 'right') nextDirection.current = 'left' }} />
          </View>
          <View style={{ width: '50%' }}>
            <Button title='right' onPress={() => { if (currentDirection.current !== 'left') nextDirection.current = 'right' }} />
          </View>
        </View>
        <Button title='down' onPress={() => { if (currentDirection.current !== 'up') nextDirection.current = 'down' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center'
  },

  tile: {
    height: STEP -1,
    width: STEP -1,
    marginBottom: 1,
    marginRight: 1,
    borderRadius: 2
  },

  board: {
    flexWrap: 'wrap',
    width: '100%',
    height: (STEP)*7
  },

  head: {
    height:  STEP +1,
    aspectRatio: 1,
    borderRadius: 3,
    backgroundColor: 'purple',
    zIndex: 2,
    position: 'absolute',
    top: -1,
    left: -1
  },

  tail: {
    height:  STEP -1,
    aspectRatio: 1,
    borderRadius: 2,
    backgroundColor: 'purple',
    zIndex: 1,
    position: 'absolute',
  }
});

export default App;
