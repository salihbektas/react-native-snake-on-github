import React, {useState} from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {HomeProps} from '../../types';
import UserCard from '../../components/UserCard';
import LoadingCard from '../../components/LoadingCard';
import NoUserCard from '../../components/NoUserCard';
import {gql, useQuery} from '@apollo/client';
import useDebounce from '../../hooks/useDebounce';

const DATA = gql`
  query ($userName: String!) {
    user(login: $userName) {
      avatarUrl
      name
      login
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

function Home({navigation}: HomeProps): JSX.Element {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input);

  const {
    loading,
    error,
    data: queryData,
  } = useQuery(DATA, {
    variables: {userName: debouncedInput},
  });

  function onChange(username: string) {
    setInput(username);
  }

  function onPress() {
    if (loading || error) return;
    let commits = 0;
    const commitData: number[] = [];

    queryData.user.contributionsCollection.contributionCalendar.weeks.forEach(
      (week: Record<string, any>, weekIdx: number) => {
        week.contributionDays.forEach(
          (day: Record<string, any>, dayIdx: number) => {
            if (day.contributionCount > 0) ++commits;
            switch (day.contributionLevel) {
              case 'NONE':
                commitData[dayIdx + weekIdx * 7] = 0;
                break;
              case 'FIRST_QUARTILE':
                commitData[dayIdx + weekIdx * 7] = 1;
                break;
              case 'SECOND_QUARTILE':
                commitData[dayIdx + weekIdx * 7] = 2;
                break;
              case 'THIRD_QUARTILE':
                commitData[dayIdx + weekIdx * 7] = 3;
                break;
              case 'FOURTH_QUARTILE':
                commitData[dayIdx + weekIdx * 7] = 4;
                break;
            }
          },
        );
      },
    );

    if (commits === 0)
      Alert.alert(
        'Game Cannot Start',
        `${queryData?.user?.login} did not make any contributions last year.`,
        [{text: 'OK'}],
      );
    else {
      Keyboard.dismiss();
      navigation.navigate('Game', {
        data: commitData,
        avatar: queryData?.user?.avatarUrl,
        user: queryData?.user?.login,
        nickName: queryData?.user?.name,
        commitCount: commits,
      });
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      {debouncedInput.length === 0 ? (
        <View style={styles.placeholder} />
      ) : loading ? (
        <LoadingCard />
      ) : !queryData?.user?.login ? (
        <NoUserCard input={input} />
      ) : (
        <UserCard
          avatar={queryData?.user?.avatarUrl}
          userName={queryData?.user?.login}
          nickName={queryData?.user?.name}
        />
      )}

      <TextInput
        value={input}
        onChangeText={onChange}
        placeholder="UserName"
        style={{backgroundColor: 'white'}}
      />

      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.text}>Go Game</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#0d1117',
  },

  placeholder: {
    height: 120,
    marginVertical: 8,
  },

  button:{
    backgroundColor: 'purple',
    paddingVertical: 8,
  },

  text:{
    color: 'white',
    fontSize: 20,
    textAlign:'center',
  },
});

export default Home;
