import React from "react"
import { StyleSheet, Text, View } from "react-native"
import SkeletonPlaceholder from "react-native-skeleton-placeholder";


function LoadingCard() {
  return (
    <View style={styles.main}>
      <Text style={styles.text}>Looking Profile</Text>
      <SkeletonPlaceholder backgroundColor={'#0d1117'} speed={2000}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item width={120} height={20} borderRadius={10} marginRight={40} />
          <SkeletonPlaceholder.Item width={120} height={120} borderRadius={60} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  )
}


const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginVertical: 8
  },

  text: {
    position: 'absolute',
    top: 0,
    right: 120,
    color: 'white',
    fontSize: 24
  }
});

export default LoadingCard