import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen, { screenOptions as homeScreenOptions } from '../screens/main/HomeScreen';
import { Ionicons } from '@expo/vector-icons';
import { globalColors } from '../global/exports';
import { FontAwesome5 } from '@expo/vector-icons';
import { PlacesNavigator, screenOptions as placesNavigatorScreenOptions } from './PlacesNavigator';

const MainTabNavigator = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <MainTabNavigator.Navigator
      tabBarOptions={{
        activeTintColor: globalColors.primary,
        inactiveTintColor: globalColors.grey,
      }}
    >
      <MainTabNavigator.Screen
        name="home"
        component={HomeScreen}
        options={homeScreenOptions}
      />
      <MainTabNavigator.Screen
        name="places"
        component={PlacesNavigator}
        options={placesNavigatorScreenOptions}
      />
      <MainTabNavigator.Screen
        name="track"
        component={HomeScreen}
        options={trackScreenOptions}
      />
      <MainTabNavigator.Screen
        name="reminders"
        component={HomeScreen}
        options={remindersScreenOptions}
      />
      <MainTabNavigator.Screen
        name="social"
        component={HomeScreen}
        options={socialScreenOptions}
      />
      {/* <MainTabNavigator.Screen
        name="settings"
        component={HomeScreen}
        options={settingsScreenOptions}
      /> */}
    </MainTabNavigator.Navigator>
  );
};

const trackScreenOptions = {
  title: 'Track my walk',
  tabBarIcon: ({ focused, color, size }) => (
    <FontAwesome5 name="walking" size={size} color={color} />
  )
}

const remindersScreenOptions = {
  title: 'Reminders',
  tabBarIcon: ({ focused, color, size }) => (
    <Ionicons name="md-alarm" size={size} color={color} />
  )
}

const socialScreenOptions = {
  title: 'Social',
  tabBarIcon: ({ focused, color, size }) => (
    <Ionicons name="md-people" size={size} color={color} />
  )
}

const settingsScreenOptions = {
  title: 'Settings',
  tabBarIcon: ({ focused, color, size }) => (
    <Ionicons name="ios-options" size={size} color={color} />
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row'
  }
})