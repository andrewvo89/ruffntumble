import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, BackHandler } from 'react-native';
import { ScreenContainer, Text, KeyboardAvoidingView, ScrollView } from '../../../components/exports';
import { globalColors, globalErrorfunctions } from '../../../global/exports';
import { signupWithEmail } from '../../../store/authActions';
import SignupForm from './SignupForm';

export default props => {
  const [initialValues, setInitialValues] = useState({
    email: '',
    passwword: ''
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  //Disable the Android back button when user is getting created
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      backHandler.remove();
    }
  }, []);
  //Set dynamic screen options when loading changes
  useEffect(() => {
    props.navigation.setOptions({
      ...screenOptions,
      headerShown: !loading
    });
  }, [loading]);

  if (error) {
    Alert.alert('Sign up error', error.message, [{
      text: 'OK',
      onPress: () => {
        setError(null);
        setLoading(false);
      }
    }]
    );
  }

  const submitHandler = async values => {
    try {
      setInitialValues(values);
      setLoading(true);
      await signupWithEmail(values.email, values.password);
    } catch (error) {
      setError(await globalErrorfunctions.getFriendlyError(error));
    }
  }

  return (
    <ScrollView keyboardAvoiding>
      <KeyboardAvoidingView>
        <ScreenContainer>
          {loading ? (
            <ActivityIndicator
              color={globalColors.primary}
              size="large"
            />
          ) : (
              <React.Fragment>
                <Text style={styles.titleText}>Sign up</Text>
                <SignupForm
                  submitHandler={submitHandler}
                  initialValues={initialValues}
                />
              </React.Fragment>
            )}
        </ ScreenContainer>
      </KeyboardAvoidingView>
    </ScrollView>
  );

};

export const screenOptions = {
  headerTitle: 'Sign up with Email'
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    marginBottom: 20
  }
});