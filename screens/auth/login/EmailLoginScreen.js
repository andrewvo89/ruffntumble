import React, { useState, useEffect, Fragment, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, BackHandler } from 'react-native';
import { ScreenContainer, ScrollView, KeyboardAvoidingView, Text, TextLink } from '../../../components/exports';
import { globalColors, globalErrorfunctions } from '../../../global/exports';
import { loginWithEmail } from '../../../store/authActions';
import EmailLoginForm from './EmailLoginForm';

export default props => {
  const formikRef = useRef();
  const [initialValues, setInitialValues] = useState({
    email: '',
    passwword: ''
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  //Set dynamic screen options when loading changes
  useEffect(() => {//Disable back button when adding profile
    const backAction = () => {
      if (loading) {//If loading i.e. when adding profile, remove back button functionality
        return true;
      }
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    props.navigation.setOptions({
      ...screenOptions,
      headerShown: !loading
    });
    return () => {
      backHandler.remove();
    }
  }, [loading]);

  if (error) {
    Alert.alert(
      'Login error',
      error.message,
      [{
        text: 'OK',
        onPress: () => {
          setError(null);
          setLoading(false);
        }
      }]
    );
  }

  if (error) {
    Alert.alert(
      'Login error',
      error.message,
      [{
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
      await loginWithEmail(values.email, values.password);
    } catch (error) {
      setError(await globalErrorfunctions.getFriendlyError(error));
    }
  }

  return (
    <ScrollView keyboardAvoiding>
      <KeyboardAvoidingView>
        <ScreenContainer>
          {loading ? (
            <Fragment>
              <ActivityIndicator
                color={globalColors.primary}
                size="large"
              />
              <Text>Logging you in...</Text>
            </Fragment>
          ) : (
              <React.Fragment>
                <Text style={styles.titleText}>Login via email</Text>
                <EmailLoginForm
                  ref={formikRef}
                  submitHandler={submitHandler}
                  initialValues={initialValues}
                />
                <TextLink
                  style={styles.passwordResetText}
                  onPress={() => props.navigation.navigate('passwordreset', {
                    email: formikRef.current.values.email
                  })}
                >Forgot password?</TextLink>
              </React.Fragment>
            )}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export const screenOptions = {
  headerTitle: 'Login with Email'
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    marginBottom: 20
  },
  passwordResetText: {
    color: globalColors.green
  }
});