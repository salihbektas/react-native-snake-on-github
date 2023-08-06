import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {STEP} from '../constants';

const colors = [
  '#161b22',
  '#0e4429',
  '#006d32',
  '#26a641',
  '#39d353',
  '#0d1117',
];

function Tile({level}: {level: number}) {
  return <View style={{...styles.tile, backgroundColor: colors[level]}} />;
}

const styles = StyleSheet.create({
  tile: {
    height: STEP,
    width: STEP,
    borderWidth: 1,
    borderColor: colors[5],
    borderRadius: 2,
  },
});

export default React.memo(Tile);
