import React, { useEffect, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { HomeProps } from '../../types';
import * as Cheerio from 'cheerio';




function Home({ navigation }: HomeProps): JSX.Element {

  const [user, setUser] = useState('')
  const [avatar, setAvatar] = useState<string | undefined>('')
  const [data, setData] = useState('')


  function getData(username: string) {
    fetch(`https://github.com/${username}`).then(value => value.text()).then(value => {
      const $ = Cheerio.load(value);
      const $days = $("svg.js-calendar-graph-svg rect.ContributionCalendar-day");
      const $avatar = $('.avatar.avatar-user.width-full.border.color-bg-default');
      const $name = $('.p-name.vcard-fullname.d-block.overflow-hidden');
      setUser($name.text())
      setAvatar($avatar.attr('src'))
      let newData : string = ''
      $($days.get()).each((i, day) => newData += $(day).attr('data-level')+',')
      newData += $name.text() + ',' + $avatar.attr('src')
      setData(newData)
    })
  }

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <SafeAreaView style={styles.main}>

      <View style={{flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-around'}}>
        <Text style={{color: 'white', fontSize: 24}}>{user}</Text>
        <Image src={avatar} style={{width: 120, height: 120, borderRadius: 60}}/>
      </View>
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