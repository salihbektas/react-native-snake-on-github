import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Game: { data: string };
};

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type GameProps = NativeStackScreenProps<RootStackParamList, 'Game'>;