import React from "react"
import { Dimensions, StyleSheet, View } from "react-native"

const WIDTH = Dimensions.get('window').width
const STEP = Math.floor(WIDTH / 53)


const colors = [
  '#161b22',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353'
]

function Tile({ level }: { level: number }) {
  return (
    <View style={{ ...styles.tile, backgroundColor: colors[level] }} />
  )
}


const styles = StyleSheet.create({
  tile: {
    height: STEP - 2,
    width: STEP - 2,
    marginBottom: 2,
    marginRight: 2,
    borderRadius: 2
  },
})

export default React.memo(Tile)