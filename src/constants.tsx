import { Dimensions } from 'react-native';

export const WIDTH = Dimensions.get('window').width

export const STEP = Math.floor(WIDTH / 53)

export const TICK_TIME = 300 