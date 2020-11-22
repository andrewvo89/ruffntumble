import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import AppNavigator from './navigation/AppNavigator';
import authReducer from './store/authReducer';
import profileReducer from './store/profileReducer';
import { RootSiblingParent } from 'react-native-root-siblings'
import placesReducer from './store/placesReducer';

const rootReducer = combineReducers({
  authState: authReducer,
  profileState: profileReducer,
  placesState: placesReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  let [fontsLoaded] = useFonts({
    'Roboto': require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    'DMSansRegular': require('./assets/fonts/DMSans-Regular.ttf'),
    'DMSansMedium': require('./assets/fonts/DMSans-Medium.ttf'),
    'DMSansBold': require('./assets/fonts/DMSans-Bold.ttf')
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <Provider store={store}>
      <RootSiblingParent>
        <StatusBar />
        <AppNavigator />
      </RootSiblingParent>
    </Provider>
  );

}