import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StartupScreen from '../screens/StartupScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import AwaitingVerificationScreen from '../screens/auth/onboard/EmailVerificationScreen';
import { verifyAuth, logout } from '../store/authActions';
import { AsyncStorage } from 'react-native';
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import { OnboardNavigator } from './OnboardNavigator';
import firebase from '../database/firebase';

export default props => {
  const dispatchAuth = useDispatch();
  const authState = useSelector(state => state.authState);
  const authenticated = !!authState.authUser;

  useEffect(() => {
    const authVerification = async () => {
      const localAuthUser = await AsyncStorage.getItem('authUser');
      // console.log('AppNavigator', localAuthUser);
      if (!localAuthUser) {
        // console.log('dispatchAuth')
        await dispatchAuth(logout());
      }
      // await firebase.auth().signInWithEmailAndPassword('andrew.vo89@gmail.com', 'Andrew');
      dispatchAuth(verifyAuth());
    };
    authVerification();
  }, []);

  // console.log('AppNavigator re-render authState: ', authState);

  let Navigator = StartupScreen;
  if (authenticated) {
    Navigator = AuthLoadingScreen;
    const authUser = authState.authUser;
    if (!authUser.onboard.emailVerified) {//Email not verified yet
      Navigator = AwaitingVerificationScreen;
    } else if (!authUser.onboard.profileCreated) {//User Profile not yet created
      Navigator = OnboardNavigator;
    } else {//Start app
      Navigator = MainNavigator;
    }
  } else {
    if (authState.loginTouched) {
      Navigator = AuthNavigator;//Show AuthNavigator
    }
  }
  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};