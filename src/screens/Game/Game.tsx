import * as cheerio from 'cheerio';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import useInterval from 'use-interval';
import Tile from '../../components/Tile';
import { GameProps } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import UserCard from '../../components/UserCard';

interface snakeNode {
  x: number;
  y: number;
}

const WIDTH = Dimensions.get('window').width
const STEP = Math.floor(WIDTH / 53)
const TICK_TIME = 300

const DAYOFWEEK = new Date().getDay()

function formatter(data: number[]){
  let newData: number[][] = new Array(53)
  for(let i = 0; i < 53; ++i){
    newData[i] = new Array(7)
  }
  data.forEach((item, index) => newData[Math.floor(index/7)][index%7] = item)
  return newData
}

function Game({ route, navigation }: GameProps): JSX.Element {

  const currentDirection = useRef('')
  const nextDirection = useRef('')

  const locationIndex = useRef(0)

  const [heatMap, setHeatMap] = useState<number[][]>(() => formatter(route.params.data))
  const [commitCount, setCommitCount] = useState(route.params.commitCount)
  const [isPlaying, setIsPlaying] = useState(true)

  const head = useRef(new Animated.ValueXY()).current
  const t1 = useRef(new Animated.ValueXY()).current
  const t2 = useRef(new Animated.ValueXY()).current
  const t3 = useRef(new Animated.ValueXY()).current

  const snakeNodes = useRef<snakeNode[]>([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])

  function renderItem({ item }: { item: number[] }) {

    return(
      <View>
        <Tile level={item[0]}/>
        <Tile level={item[1]}/>
        <Tile level={item[2]}/>
        <Tile level={item[3]}/>
        <Tile level={item[4]}/>
        <Tile level={item[5]}/>
        <Tile level={item[6]}/>
      </View>
    )
  }

  function gameOver(reason: 'success' | 'failed') {
    let title, message;
    setIsPlaying(false)

    if (reason === 'success') {
      title = 'Success'
      message = 'You collected all the commits'
    }
    else {
      title = 'Failed'
      message = 'Snake went out of bounds'
    }

    Alert.alert(title, message, [{ text: 'Restart', onPress: reset }, { text: 'Go Back', onPress: () => navigation.goBack() }])
  }

  function reset() {
    setHeatMap(formatter(route.params.data))
    setCommitCount(route.params.commitCount)
    currentDirection.current = ''
    nextDirection.current = ''
    locationIndex.current = 0
    snakeNodes.current[0].x = 0
    snakeNodes.current[0].y = 0
    snakeNodes.current[1].x = 0
    snakeNodes.current[1].y = 0
    snakeNodes.current[2].x = 0
    snakeNodes.current[2].y = 0
    snakeNodes.current[3].x = 0
    snakeNodes.current[3].y = 0
    setIsPlaying(true)
  }


  function tick() {
    currentDirection.current = nextDirection.current

    snakeNodes.current[3].x = snakeNodes.current[2].x
    snakeNodes.current[3].y = snakeNodes.current[2].y
    snakeNodes.current[2].x = snakeNodes.current[1].x
    snakeNodes.current[2].y = snakeNodes.current[1].y
    snakeNodes.current[1].x = snakeNodes.current[0].x
    snakeNodes.current[1].y = snakeNodes.current[0].y

    if (currentDirection.current === 'up') {
      snakeNodes.current[0].y -= STEP
      locationIndex.current -= 1
    }
    if (currentDirection.current === 'left') {
      snakeNodes.current[0].x -= STEP
      locationIndex.current -= 7
    }
    if (currentDirection.current === 'right') {
      snakeNodes.current[0].x += STEP
      locationIndex.current += 7
    }
    if (currentDirection.current === 'down') {
      snakeNodes.current[0].y += STEP
      locationIndex.current += 1
    }

    if (snakeNodes.current[0].y < 0 || snakeNodes.current[0].y > 6 * STEP ||
      locationIndex.current < 0 || locationIndex.current > route.params.data.length) {
      gameOver('failed')
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

    if (heatMap[Math.floor(locationIndex.current/7)][locationIndex.current%7] !== 0 && heatMap[Math.floor(locationIndex.current/7)][locationIndex.current%7] !== undefined) {
      let newMap = [...heatMap]
      newMap[Math.floor(locationIndex.current/7)][locationIndex.current%7] = 0
      setHeatMap(newMap)
      setCommitCount(c => c - 1)
    }
  }

  useEffect(() => {
    if (commitCount === 0)
      gameOver('success')
  }, [commitCount])

  useInterval(tick, isPlaying ? TICK_TIME : null)

  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.topContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backContainer} >
          <Image source={require("../../../assets/arrow.png")} style={styles.back} />
        </Pressable>

        <UserCard avatar={route.params.avatar} nickName={route.params.nickName} userName={route.params.user} />
      </View>

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

        <FlatList
          data={heatMap}
          renderItem={renderItem}
          horizontal={true}
        />
      </View>
      <View style={{ marginTop: 15 }}>
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

  topContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16
  },

  backContainer: { marginRight: "auto" },

  back: {
    height: 30,
    width: 30,
    tintColor: 'white'
  },

  tile: {
    height: STEP - 2,
    width: STEP - 2,
    marginBottom: 2,
    marginRight: 2,
    borderRadius: 2
  },

  board: {
    flexWrap: 'wrap',
    width: '100%',
    height: (STEP) * 7,
    marginTop: 16
  },

  head: {
    height: STEP + 1,
    aspectRatio: 1,
    borderRadius: 3,
    backgroundColor: 'purple',
    zIndex: 2,
    position: 'absolute',
    top: -1,
    left: -1
  },

  tail: {
    height: STEP - 1,
    aspectRatio: 1,
    borderRadius: 2,
    backgroundColor: 'purple',
    zIndex: 1,
    position: 'absolute',
  }
});

export default Game;
