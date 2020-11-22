import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FindAPlaceScreen, { screenOptions as findAPlaceScreenOptions } from '../screens/places/FindAPlaceScreen';
import PlaceDetailsScreen, { screenOptions as placeDetailsScreenOptions } from '../screens/places/details/PlaceDetailsScreen';
import { Foundation } from '@expo/vector-icons';

const PlacesStackNavigator = createStackNavigator();

export const PlacesNavigator = () => {
  return (
    <PlacesStackNavigator.Navigator
    >
      <PlacesStackNavigator.Screen
        name="places"
        component={FindAPlaceScreen}
        options={findAPlaceScreenOptions}
      />
      <PlacesStackNavigator.Screen
        name="details"
        component={PlaceDetailsScreen}
        options={placeDetailsScreenOptions}
      />
    </PlacesStackNavigator.Navigator>
  );
};

export const screenOptions = {
  title: 'Find a dog place',
  tabBarIcon: ({ focused, color, size }) => (
    <Foundation name="guide-dog" size={size} color={color} />
  )
};