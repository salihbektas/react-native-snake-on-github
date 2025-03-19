import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

function LoadingCard() {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>Looking Profile</Text>
      <ActivityIndicator size='large' color='#26a641'/>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    height: 136,
    justifyContent: 'space-evenly',
  },

  text: {
    color: 'white',
    fontSize: 24
  },
});

export default LoadingCard;
