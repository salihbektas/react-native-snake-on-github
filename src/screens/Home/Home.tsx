import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

import { HomeProps } from '../../types';




function Home({ navigation }: HomeProps): JSX.Element {

  return (
    <SafeAreaView style={styles.main}>
      <Text style={{color: 'white'}}>Entering page</Text>
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