import React from "react"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"


function LoadingCard(){
  return(
      <View style={styles.main}>
        <Text style= {styles.text}>Looking Profile...</Text>
        <ActivityIndicator size='large' style={styles.indicator}/>
      </View>
  )
}


const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },

  text: {
    color: 'white',
    fontSize: 24
  },

  indicator: {
    width: 120,
    height: 120
  }
});

export default LoadingCard