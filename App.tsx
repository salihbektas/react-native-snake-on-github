import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home/Home';
import Game from './src/screens/Game/Game';

import {RootStackParamList} from './src/types';
import {ApolloProvider} from '@apollo/client';
import client from './src/ApolloClient';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{orientation: 'portrait'}}
          />
          <Stack.Screen
            name="Game"
            component={Game}
            options={{orientation: 'landscape'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}

export default App;
