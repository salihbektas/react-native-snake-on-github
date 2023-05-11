import React from "react"
import { StyleSheet, Text, View } from "react-native"


function NoUserCard({input}: {input: string}) {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>{`No profile found with username ${input}`}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  main: {
    height: 136,
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    color: 'white',
    fontSize: 24
  }
});

export default NoUserCard