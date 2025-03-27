import {Dimensions} from 'react-native';

//prettier-ignore
export const STEP = Math.max(Dimensions.get('window').height, Dimensions.get('window').width) / 53;

export const TICK_TIME = 300;

export const COLORS = {
    commitLevel: [
      '#161b22',
      '#0e4429',
      '#006d32',
      '#26a641',
      '#39d353',
    ],
    green: '#26a641',
    purple: '#663399',
    white: '#f0f6fc',
    black: '#0d1117',
}
