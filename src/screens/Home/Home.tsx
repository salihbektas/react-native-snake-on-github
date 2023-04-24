import React, { useEffect, useRef, useState, useTransition } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { HomeProps } from '../../types';
import * as Cheerio from 'cheerio';
import UserCard from '../../components/UserCard';




function Home({ navigation }: HomeProps): JSX.Element {

  const [user, setUser] = useState('')
  const [nickName, setNickName] = useState('')
  const [avatar, setAvatar] = useState<string | undefined>('')
  const [data, setData] = useState('')
  const [isPending, startTransition] = useTransition()

  const abort = useRef(new AbortController())


  function getData(username: string) {
    abort.current.abort()
    abort.current = new AbortController()
    let signal = abort.current.signal
    startTransition(() => {
      fetch(`https://github.com/${username}`, {signal}).then(value => value.text()).then(value => {
        const $ = Cheerio.load(value);
        const $days = $("svg.js-calendar-graph-svg rect.ContributionCalendar-day");
        const $avatar = $('.avatar.avatar-user.width-full.border.color-bg-default');
        const $name = $('.p-name.vcard-fullname.d-block.overflow-hidden');
        const $nickname = $('.p-nickname.vcard-username.d-block')
        setUser($name.text().trim())
        setNickName($nickname.text().trim())
        setAvatar($avatar.attr('src'))
        let newData : string = ''
        $($days.get()).each((i, day) => newData += $(day).attr('data-level')+',')
        newData += $name.text().trim() + ',' + $nickname.text().trim() + ',' + $avatar.attr('src')
        setData(newData)
      }).catch(e => console.log(signal.aborted))
    })
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <SafeAreaView style={styles.main}>
      <UserCard avatar={avatar} userName={user} nickName={nickName} />
      
      <TextInput onChangeText={getData} placeholder='UserName' style={{backgroundColor: 'white'}} />

      <Button title='Go Game' onPress={() => navigation.navigate('Game', {data: data}) }/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0d1117'
  },

  
});

export default Home;