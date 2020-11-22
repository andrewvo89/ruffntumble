import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AuthScreen, { screenOptions as authScreenOptions } from '../screens/auth/AuthScreen';
import EmailLoginScreen, { screenOptions as emailLoginScreenOptions } from '../screens/auth/login/EmailLoginScreen';
import EmailSignupScreen, { screenOptions as emailSignupScreenOptions } from '../screens/auth/signup/EmailSignupScreen';
import LoginScreen, { screenOptions as loginScreenOptions } from '../screens/auth/login/LoginScreen';
import SignupScreen, { screenOptions as signupScreenOptions } from '../screens/auth/signup/SignupScreen';
import PasswordResetScreen, { screenOptions as passwordResetScreenOptions } from '../screens/auth/login/PasswordResetScreen';

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator
    >
      <AuthStackNavigator.Screen
        name="auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="login"
        component={LoginScreen}
        options={loginScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="signup"
        component={SignupScreen}
        options={signupScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="emaillogin"
        component={EmailLoginScreen}
        options={emailLoginScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="passwordreset"
        component={PasswordResetScreen}
        options={passwordResetScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="emailsignup"
        component={EmailSignupScreen}
        options={emailSignupScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
}