import React, { useState, Fragment, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { ScreenContainer, ScrollView, KeyboardAvoidingView, Text } from '../../../components/exports';
import { globalColors, globalErrorfunctions } from '../../../global/exports';
import { sendPasswordReset } from '../../../store/authActions';
import PasswordResetForm from './PasswordResetForm';

export default props => {
  const formikRef = useRef();
  const initialValues = { email: props.route.params.email }
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  if (error) {
    Alert.alert(
      'Password reset error',
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
      setLoading(true);
      await sendPasswordReset(values.email);
      Alert.alert(
        `Password reset`,
        `Password reset email send to ${values.email}`,
        [{
          text: 'OK',
          onPress: () => {
            props.navigation.pop();
          }
        }]
      );
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
              <Text>Sending email...</Text>
            </Fragment>
          ) : (
              <PasswordResetForm
                ref={formikRef}
                submitHandler={submitHandler}
                initialValues={initialValues}
              />
            )}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export const screenOptions = {
  headerTitle: 'Password Reset'
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 24,
    marginBottom: 20
  }
});