import {Dimensions} from 'react-native';

//prettier-ignore
export const STEP = Math.max(Dimensions.get('window').height, Dimensions.get('window').width) / 53;

export const TICK_TIME = 300;
