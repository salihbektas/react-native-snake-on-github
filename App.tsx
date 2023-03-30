import React, { useRef } from 'react';
import {
  Animated,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';


function App(): JSX.Element {

  const tiles = []

  const moveH = useRef(new Animated.Value(0)).current

  const posH = useRef(0)

  const moveV = useRef(new Animated.Value(0)).current

  const posV = useRef(0)

  for (let i = 0; i < 49; ++i)
    tiles.push(
      <View style={{ ...styles.tile, backgroundColor: i % 2 === 0 ? 'darkgrey' : 'lightgrey' }} key={i} />
    )


  function up() {
    posV.current -= 1
    Animated.timing(moveV, {
      toValue: posV.current,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  function down() {
    posV.current += 1
    Animated.timing(moveV, {
      toValue: posV.current,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  function left() {
    posH.current -= 1
    Animated.timing(moveH, {
      toValue: posH.current,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  function right() {
    posH.current += 1
    Animated.timing(moveH, {
      toValue: posH.current,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  return (
    <SafeAreaView style={styles.main}>
      <Animated.View style={{
        height: 50, aspectRatio: 1, backgroundColor: 'red', zIndex: 1,
        transform: [
          { translateX: moveH.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) },
          { translateY: moveV.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) }
        ]
      }}
      />
      <View style={styles.board}>
        {tiles}
      </View>
      <View>
        <Button title='up' onPress={up} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%' }}>
            <Button title='left' onPress={left} />
          </View>
          <View style={{ width: '50%' }}>
            <Button title='right' onPress={right} />
          </View>
        </View>
        <Button title='down' onPress={down} />
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
