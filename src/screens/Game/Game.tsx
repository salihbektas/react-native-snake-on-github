import * as cheerio from 'cheerio';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  Animated,
  Button,
  Dimensions,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useInterval from 'use-interval';
import Tile from '../../components/Tile';
import {GameProps} from '../../types';
import {useFocusEffect} from '@react-navigation/native';
import UserCard from '../../components/UserCard';
import {STEP, TICK_TIME} from '../../constants';

interface snakeNode {
  x: number;
  y: number;
}

function Game({route, navigation}: GameProps): JSX.Element {
  const currentDirection = useRef('');
  const nextDirection = useRef('');

  const locationIndex = useRef(0);
  const verticalLocation = useRef(0);

  const [commits, setCommits] = useState([...route.params.data]);
  const heatMap = useMemo(() => {
    return commits.map((item, index) => <Tile level={item} key={index} />);
  }, [commits]);
  const commitCount = useRef(route.params.commitCount);
  const [isPlaying, setIsPlaying] = useState(true);

  const head = useRef(new Animated.ValueXY()).current;
  const t1 = useRef(new Animated.ValueXY()).current;
  const t2 = useRef(new Animated.ValueXY()).current;
  const t3 = useRef(new Animated.ValueXY()).current;

  const snakeNodes = useRef<snakeNode[]>([
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
    {x: 0, y: 0},
  ]);

  function gameOver(reason: 'success' | 'failed') {
    let title, message;
    setIsPlaying(false);

    if (reason === 'success') {
      title = 'Success';
      message = 'You collected all the commits';
    } else {
      title = 'Failed';
      message = 'Snake went out of bounds';
    }

    Alert.alert(title, message, [
      {text: 'Restart', onPress: reset},
      {text: 'Go Back', onPress: () => navigation.goBack()},
    ]);
  }

  function animateSnake() {
    Animated.parallel([
      Animated.timing(head, {
        toValue: {x: snakeNodes.current[0].x, y: snakeNodes.current[0].y},
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.timing(t1, {
        toValue: {x: snakeNodes.current[1].x, y: snakeNodes.current[1].y},
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.timing(t2, {
        toValue: {x: snakeNodes.current[2].x, y: snakeNodes.current[2].y},
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),

      Animated.timing(t3, {
        toValue: {x: snakeNodes.current[3].x, y: snakeNodes.current[3].y},
        duration: TICK_TIME,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function reset() {
    commitCount.current = route.params.commitCount;
    setCommits([...route.params.data]);
    currentDirection.current = '';
    nextDirection.current = '';
    locationIndex.current = 0;
    verticalLocation.current = 0;
    snakeNodes.current = [
      {x: 0, y: 0},
      {x: 0, y: 0},
      {x: 0, y: 0},
      {x: 0, y: 0},
    ];
    setIsPlaying(true);

    animateSnake();
  }

  function tick() {
    if (nextDirection.current === '') {
      return;
    }

    currentDirection.current = nextDirection.current;

    for (let i = 3; i > 0; --i) {
      snakeNodes.current[i].x = snakeNodes.current[i - 1].x;
      snakeNodes.current[i].y = snakeNodes.current[i - 1].y;
    }

    if (currentDirection.current === 'up') {
      snakeNodes.current[0].y -= STEP;
      locationIndex.current -= 1;
      verticalLocation.current -= 1;
    }
    if (currentDirection.current === 'left') {
      snakeNodes.current[0].x -= STEP;
      locationIndex.current -= 7;
    }
    if (currentDirection.current === 'right') {
      snakeNodes.current[0].x += STEP;
      locationIndex.current += 7;
    }
    if (currentDirection.current === 'down') {
      snakeNodes.current[0].y += STEP;
      locationIndex.current += 1;
      verticalLocation.current += 1;
    }

    if (
      verticalLocation.current < 0 ||
      verticalLocation.current > 6 ||
      locationIndex.current < 0 ||
      locationIndex.current > heatMap.length
    ) {
      gameOver('failed');
    }

    animateSnake();

    if (commits[locationIndex.current] !== 0) {
      const newCommits = [...commits];
      newCommits[locationIndex.current] = 0;
      setCommits(newCommits);
      commitCount.current -= 1;
      if (commitCount.current === 0) gameOver('success');
    }
  }

  useInterval(tick, isPlaying ? TICK_TIME : null);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.topContainer}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backContainer}>
          <Image
            source={require('../../../assets/arrow.png')}
            style={styles.back}
          />
        </Pressable>

        <UserCard
          avatar={route.params.avatar}
          nickName={route.params.nickName}
          userName={route.params.user}
        />
      </View>

      <View style={styles.board}>
        <Animated.View
          style={{
            ...styles.head,
            transform: [{translateX: head.x}, {translateY: head.y}],
          }}
        />

        <Animated.View
          style={{
            ...styles.tail,
            transform: [{translateX: t1.x}, {translateY: t1.y}],
          }}
        />

        <Animated.View
          style={{
            ...styles.tail,
            transform: [{translateX: t2.x}, {translateY: t2.y}],
          }}
        />

        <Animated.View
          style={{
            ...styles.tail,
            transform: [{translateX: t3.x}, {translateY: t3.y}],
          }}
        />

        {heatMap}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={{...styles.button, marginVertical: 2}}
          onPress={() => {
            if (currentDirection.current !== 'down')
              nextDirection.current = 'up';
          }}>
          <Text style={styles.text}>Up</Text>
        </Pressable>
        <View style={styles.middleRow}>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (currentDirection.current !== 'right')
                nextDirection.current = 'left';
            }}>
            <Text style={styles.text}>Left</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              if (currentDirection.current !== 'left')
                nextDirection.current = 'right';
            }}>
            <Text style={styles.text}>Right</Text>
          </Pressable>
        </View>
        <Pressable
          style={{...styles.button, marginVertical: 2}}
          onPress={() => {
            if (currentDirection.current !== 'up')
              nextDirection.current = 'down';
          }}>
          <Text style={styles.text}>Down</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0d1117',
  },

  topContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },

  backContainer: {marginRight: 'auto'},

  back: {
    height: 30,
    width: 30,
    tintColor: 'white',
    marginTop: 8,
  },

  tile: {
    height: STEP - 2,
    width: STEP - 2,
    marginBottom: 2,
    marginRight: 2,
    borderRadius: 2,
  },

  board: {
    flexWrap: 'wrap',
    width: '100%',
    height: STEP * 7,
  },

  head: {
    height: STEP + 1,
    aspectRatio: 1,
    borderRadius: 3,
    backgroundColor: 'purple',
    zIndex: 2,
    position: 'absolute',
    top: -1,
    left: -1,
  },

  tail: {
    height: STEP - 1,
    aspectRatio: 1,
    borderRadius: 2,
    backgroundColor: 'purple',
    zIndex: 1,
    position: 'absolute',
  },

  buttonContainer: {flex: 1, marginTop: 4},

  middleRow: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 2,
  },

  button: {
    flex: 1,
    backgroundColor: '#f0f6fc',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderRadius: 8,
  },

  text: {fontSize: 16, fontWeight: '800'},
});

export default Game;
