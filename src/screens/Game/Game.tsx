import * as cheerio from 'cheerio';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Easing,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import useInterval from 'use-interval';
import Tile from '../../component/Tile';
import { GameProps } from '../../types';
import { useFocusEffect } from '@react-navigation/native';

interface snakeNode {
  x: number;
  y: number;
}

const WIDTH = Dimensions.get('window').width
const STEP = Math.floor(WIDTH/53)
const TICK_TIME = 300

const DAYOFWEEK = new Date().getDay()

function Game({ route, navigation }: GameProps): JSX.Element {

  const currentDirection = useRef('')
  const nextDirection = useRef('')

  const locationIndex = useRef(0)

  const [heatMap, setHeatMap] = useState<number[]>(new Array(365+DAYOFWEEK).fill(0))

  const head = useRef(new Animated.ValueXY()).current
  const t1 = useRef(new Animated.ValueXY()).current
  const t2 = useRef(new Animated.ValueXY()).current
  const t3 = useRef(new Animated.ValueXY()).current

  const snakeNodes = useRef<snakeNode[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  useFocusEffect(() => {
    console.log(route.params.data)
  })


  function getData(username: string) {
    fetch(`https://github.com/${username}`).then(value => value.text()).then(value => {
      const $ = cheerio.load(value);
      const $days = $("svg.js-calendar-graph-svg rect.ContributionCalendar-day");
      const newData = [...heatMap]
      $($days.get()).each((id, el) =>  {newData[id] = parseInt($(el).attr('data-level'))})
      setHeatMap(newData)
    })
  }
  function tick() {
    currentDirection.current = nextDirection.current

    snakeNodes.current[3].x = snakeNodes.current[2].x
    snakeNodes.current[3].y = snakeNodes.current[2].y
    snakeNodes.current[2].x = snakeNodes.current[1].x
    snakeNodes.current[2].y = snakeNodes.current[1].y
    snakeNodes.current[1].x = snakeNodes.current[0].x
    snakeNodes.current[1].y = snakeNodes.current[0].y

    if (currentDirection.current === 'up' && snakeNodes.current[0].y > 0){
      snakeNodes.current[0].y -= STEP
      locationIndex.current -= 1
    }
    if (currentDirection.current === 'left' && snakeNodes.current[0].x > 0){
      snakeNodes.current[0].x -= STEP
      locationIndex.current -= 7
    }
    if (currentDirection.current === 'right' && snakeNodes.current[0].x < STEP * 52){
      snakeNodes.current[0].x += STEP
      locationIndex.current += 7
    }
    if (currentDirection.current === 'down' && snakeNodes.current[0].y < STEP * 6){
      snakeNodes.current[0].y += STEP
      locationIndex.current += 1
    }

    Animated.parallel([
      Animated.timing(head, {
        toValue: { x: snakeNodes.current[0].x, y: snakeNodes.current[0].y },
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.timing(t1, {
        toValue: { x: snakeNodes.current[1].x, y: snakeNodes.current[1].y },
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.timing(t2, {
        toValue: { x: snakeNodes.current[2].x, y: snakeNodes.current[2].y },
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.timing(t3, {
        toValue: { x: snakeNodes.current[3].x, y: snakeNodes.current[3].y },
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start()

    if(heatMap[locationIndex.current] !== 0){
      let newMap = [...heatMap]
      newMap[locationIndex.current] = 0
      setHeatMap(newMap)
    }
  }

  useInterval(tick, TICK_TIME)

  useEffect(() => {
    getData('salihbektas')
  }, [])

  useEffect(() => {
    //console.log(heatMap)
  }, [heatMap])

  return (
    <SafeAreaView style={styles.main}>
      <Button title='Go Back' onPress={() => navigation.navigate('Home')}/>

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

        {heatMap.map((item, index) => <Tile level={item} key={index}/>)}
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
    justifyContent: 'center',
    backgroundColor: '#0d1117'
  },

  tile: {
    height: STEP -2,
    width: STEP -2,
    marginBottom: 2,
    marginRight: 2,
    borderRadius: 2
  },

  board: {
    flexWrap: 'wrap',
    width: '100%',
    height: (STEP)*7,
    marginTop: 50
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

export default Game;
