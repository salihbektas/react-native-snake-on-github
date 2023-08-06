import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Game: {
    data: number[];
    avatar: string;
    user: string;
    nickName: string;
    commitCount: number;
  };
};

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type GameProps = NativeStackScreenProps<RootStackParamList, 'Game'>;
