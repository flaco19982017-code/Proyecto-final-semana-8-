import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ListScreen from '../screens/ListScreen';
import FormScreen from '../screens/FormScreen';
import DetailScreen from '../screens/DetailScreen';
import StatsScreen from '../screens/StatsScreen';

import { RootStackParamList } from './typesNavigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E3A8A',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />

      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{ title: 'Reportes de Carros' }}
      />

      <Stack.Screen
        name="Form"
        component={FormScreen}
        options={{ title: 'Registrar Carro' }}
      />

      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detalle del Reporte' }}
      />

      <Stack.Screen
        name="Stats"
        component={StatsScreen}
        options={{ title: 'Estadísticas' }}
      />
    </Stack.Navigator>
  );
}