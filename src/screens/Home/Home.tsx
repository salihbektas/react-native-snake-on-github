import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput
} from 'react-native';

import { HomeProps } from '../../types';




function Home({ navigation }: HomeProps): JSX.Element {

  function onChange(userName: string) {
    console.log(userName)
  }

  return (
    <SafeAreaView style={styles.main}>
      <TextInput onChangeText={onChange} placeholder='UserName' style={{backgroundColor: 'white'}} />

      <Button title='Go Game' onPress={() => navigation.navigate('Game') }/>
      
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