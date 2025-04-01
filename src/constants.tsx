import {Dimensions} from 'react-native';

//prettier-ignore
export const STEP = (Math.min(Dimensions.get('window').height, Dimensions.get('window').width) * 16 / 9) / 53;

export const TICK_TIME = 300;

export const COLORS = {
    commitLevel: [
      '#151b23',
      '#033a16',
      '#196c2e',
      '#2ea043',
      '#56d364',
    ],
    green: '#2ea043',
    purple: '#663399',
    white: '#f0f6fc',
    black: '#0d1117',
}
