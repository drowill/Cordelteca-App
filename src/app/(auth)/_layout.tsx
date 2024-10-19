import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Tabs } from 'expo-router';
import {Colors} from './../../../constants/Colors';


export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
      }}>
        <Tabs.Screen name="index" 
        options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({color}) => <Entypo name="home" size={24} color={color} />
        }}
        />
        <Tabs.Screen name="perfil"
        options={{
            tabBarLabel: 'Perfil',
            tabBarIcon: ({color}) => <Ionicons name="person" size={24} color={color} /> 
        }} />
    </Tabs>
  )
}