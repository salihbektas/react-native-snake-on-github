import React, {useState} from 'react';
import {
  Alert,
  Button,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {HomeProps} from '../../types';
import * as Cheerio from 'cheerio';
import UserCard from '../../components/UserCard';
import LoadingCard from '../../components/LoadingCard';
import NoUserCard from '../../components/NoUserCard';
import {gql, useQuery} from '@apollo/client';
import useDebounce from '../../hooks/useDebounce';

const DATA = gql`
  query ($userName: String!) {
    user(login: $userName) {
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
  const [user, setUser] = useState('');
  const [nickName, setNickName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const debouncedInput = useDebounce(input);

  const {
    loading: loading2,
    error,
    data: queryData,
  } = useQuery(DATA, {
    variables: {userName: debouncedInput},
  });

  function onChange(username: string) {
    setInput(username);
    setLoading(true);

    fetch(`https://github.com/${username}`)
      .then(value => value.text())
      .then(value => {
        const $ = Cheerio.load(value);
        const $avatar = $(
          '.avatar.avatar-user.width-full.border.color-bg-default',
        );
        const $name = $('.p-name.vcard-fullname.d-block.overflow-hidden');
        const $nickname = $('.p-nickname.vcard-username.d-block');
        setUser($name.text().trim());
        setNickName($nickname.text().trim());
        const temp = $avatar.attr('src');
        temp !== undefined ? setAvatar(temp) : setAvatar('');

        setLoading(false);
      });
  }

  function onPress() {
    if (loading2 || error) return;
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
        `${nickName} did not make any contributions last year.`,
        [{text: 'OK'}],
      );
    else {
      Keyboard.dismiss();
      navigation.navigate('Game', {
        data: commitData,
        avatar: avatar,
        user: user,
        nickName: nickName,
        commitCount: commits,
      });
    }
  }

  return (
    <SafeAreaView style={styles.main}>
      {loading ? (
        <LoadingCard />
      ) : input.length === 0 ? (
        <View style={styles.placeholder} />
      ) : avatar.length === 0 ? (
        <NoUserCard input={input} />
      ) : (
        <UserCard avatar={avatar} userName={user} nickName={nickName} />
      )}

      <TextInput
        value={input}
        onChangeText={onChange}
        placeholder="UserName"
        style={{backgroundColor: 'white'}}
      />

      <Button title="Go Game" onPress={onPress} />
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
});

export default Home;
