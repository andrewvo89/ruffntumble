import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/authActions';
import { Ionicons } from '@expo/vector-icons';

export default props => {
  useEffect(() => {
    const asyncFunction = async () => {
      const localAuthUser = await AsyncStorage.getItem('authUser');
      // console.log('HomeScreen', localAuthUser);
    }
    asyncFunction();
  }, [])
  const dispatchAuth = useDispatch();

  return (
    <View style={styles.container}>
      <Text>Logged In!</Text>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title="Logout"
          onPress={() => dispatchAuth(authActions.logout())}
        />
      </View>
    </View>
  );
};

export const screenOptions = {
  title: 'Home',
  tabBarIcon: ({ focused, color, size }) => (
    <Ionicons name="ios-home" size={size} color={color} />
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginBottom: 10
  }
});