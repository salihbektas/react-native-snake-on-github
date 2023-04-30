import React, { useEffect, useRef, useState, useTransition } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { HomeProps } from '../../types';
import * as Cheerio from 'cheerio';
import UserCard from '../../components/UserCard';
import LoadingCard from '../../components/LoadingCard';


function Home({ navigation }: HomeProps): JSX.Element {

  const [user, setUser] = useState('')
  const [nickName, setNickName] = useState('')
  const [avatar, setAvatar] = useState('')
  const [data, setData] = useState<number[]>([])
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  const abort = useRef(new AbortController())


  function getData(username: string) {
    setLoading(true)
    abort.current.abort()
    abort.current = new AbortController()
    let signal = abort.current.signal
    
    fetch(`https://github.com/${username}`, { signal }).then(value => value.text()).then(value => {
      startTransition(() => {
        const $ = Cheerio.load(value);
        const $days = $("svg.js-calendar-graph-svg rect.ContributionCalendar-day");
        const $avatar = $('.avatar.avatar-user.width-full.border.color-bg-default');
        const $name = $('.p-name.vcard-fullname.d-block.overflow-hidden');
        const $nickname = $('.p-nickname.vcard-username.d-block')
        setUser($name.text().trim())
        setNickName($nickname.text().trim())
        const temp = $avatar.attr('src')
        temp !== undefined ? setAvatar(temp) : setAvatar('')
        let newData: number[] = []
        $($days.get()).each((i, day) => {
          let dataLevel = $(day).attr('data-level')
          if(dataLevel !== undefined)
            newData[i] = parseInt(dataLevel)
        })
        setData(newData)
        setLoading(false)
      })
    }).catch(e => console.log(signal.aborted))
  }

  return (
    <SafeAreaView style={styles.main}>
      {loading ? <LoadingCard/> :
        avatar.length === 0 
        ? <View style={styles.placeholder} />
        : <UserCard avatar={avatar} userName={user} nickName={nickName} />
      }

      <TextInput onChangeText={getData} placeholder='UserName' style={{ backgroundColor: 'white' }} />

      <Button title='Go Game' onPress={() => navigation.navigate('Game', { data: data, avatar: avatar, user: user, nickName: nickName })} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#0d1117'
  },

  placeholder: {
    height: 120,
    marginVertical: 16
  }
});

export default Home;