import React from 'react';
import {StyleSheet, View} from 'react-native';
import {COLORS, STEP} from '../constants';



function Tile({level}: {level: number}) {
  return <View style={{...styles.tile, backgroundColor: COLORS.commitLevel[level]}} />;
}

const styles = StyleSheet.create({
  tile: {
    height: STEP,
    width: STEP,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 4,
  },
});

export default React.memo(Tile);
