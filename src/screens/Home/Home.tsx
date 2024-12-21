import React, {useRef, useState, useTransition} from 'react';
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
            }
          }
        }
      }
    }
  }
`;

const debounce = (func: (param: string) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;

  return (arg: string) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(arg);
    }, delay);
  };
};

function Home({navigation}: HomeProps): JSX.Element {
  const [input, setInput] = useState('');
  const [user, setUser] = useState('');
  const [nickName, setNickName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [data, setData] = useState<number[]>([]);
  const [commitCount, setCommitCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const search = debounce(setInput, 1000);

  const {
    loading: loading2,
    error,
    data: data2,
    refetch,
  } = useQuery(DATA, {
    variables: {userName: input},
  });

  if (!loading2 && !error)
    console.log(
      data2.user.contributionsCollection.contributionCalendar.weeks[52],
    );

  const abort = useRef(new AbortController());

  function combine(params: string) {
    search(params);
    getData(params);
  }

  function getData(username: string) {
    setInput(username);
    setLoading(true);
    setCommitCount(0);
    abort.current.abort();
    abort.current = new AbortController();
    let signal = abort.current.signal;

    fetch(`https://github.com/${username}`, {signal})
      .then(value => value.text())
      .then(value => {
        startTransition(() => {
          const $ = Cheerio.load(value);
          const $days = $('td.ContributionCalendar-day');
          const $avatar = $(
            '.avatar.avatar-user.width-full.border.color-bg-default',
          );
          const $name = $('.p-name.vcard-fullname.d-block.overflow-hidden');
          const $nickname = $('.p-nickname.vcard-username.d-block');
          setUser($name.text().trim());
          setNickName($nickname.text().trim());
          const temp = $avatar.attr('src');
          temp !== undefined ? setAvatar(temp) : setAvatar('');
          let newData: number[] = [];
          let iter = 0;
          let ix = 0;
          $($days.get()).each((i, day) => {
            let dataLevel = parseInt($(day).attr('data-level') as string);
            let dataIx = parseInt($(day).attr('data-ix') as string);

            if (dataIx === ix) ++ix;
            else {
              ix = 1;
              ++iter;
            }

            newData[iter + dataIx * 7] = dataLevel;

            if (dataLevel > 0) setCommitCount(c => c + 1);
          });
          setData(newData);
          setLoading(false);
        });
      })
      .catch(e => {
        console.log('aborted', signal.aborted);
      });
  }

  function onPress() {
    if (commitCount === 0)
      Alert.alert(
        'Game Cannot Start',
        `${nickName} did not make any contributions last year.`,
        [{text: 'OK'}],
      );
    else {
      Keyboard.dismiss();
      navigation.navigate('Game', {
        data: data,
        avatar: avatar,
        user: user,
        nickName: nickName,
        commitCount: commitCount,
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
        onChangeText={combine}
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
