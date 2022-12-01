import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../Screens/HomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import DocumentScreen from '../Screens/DocumentScreen';
import CameraScreen from '../Screens/CameraScreen';

const NavigationStack = () => {
  const Stack = createStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='home'>
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={{
            title: "MI ALIMENTACIÓN MIA",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{
            title: "INICIO DE SESIÓN",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="document"
          component={DocumentScreen}
          options={{
            title: "REGISTRO BENEFICIO",
            headerShown: false
          }}
        />
        <Stack.Screen
          name="camera"
          component={CameraScreen}
          options={{
            title: "CAMARA",
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationStack;