import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import UserOnboardScreen, { screenOptions as userOnboardScreenOptions } from '../screens/auth/onboard/UserOnboardScreen';
import DogOnboardScreen, { screenOptions as dogOnboardScreenOptions } from '../screens/auth/onboard/DogOnboardScreen';
import EditDogScreen from '../screens/auth/onboard/EditDogScreen';

const OnboardStackNavigator = createStackNavigator();

export const OnboardNavigator = () => {
  const onboard = useSelector(state => state.authState.authUser.onboard);
  return (
    <OnboardStackNavigator.Navigator
    >
      <OnboardStackNavigator.Screen
        name="userprofile"
        component={UserOnboardScreen}
        options={userOnboardScreenOptions}
      />
      <OnboardStackNavigator.Screen
        name="dogprofile"
        component={DogOnboardScreen}
        options={dogOnboardScreenOptions}
      />
      <OnboardStackNavigator.Screen
        name="editdogprofile"
        component={EditDogScreen}
      //Screen options dynamically set after dog is retrieved from Redux
      />
    </OnboardStackNavigator.Navigator>
  );
}