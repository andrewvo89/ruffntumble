import { Formik } from 'formik';
import React, { useRef, forwardRef } from 'react';
import { StyleSheet } from 'react-native';
import * as yup from 'yup';
import { Button, Container, Text, ValidatedTextInput, TextLink, PasswordTextInput } from '../../../components/exports';
import { globalColors, globalFonts } from '../../../global/exports';

export default forwardRef((props, ref) => {
  const passwordInputRef = useRef();

  const initialValues = {
    email: props.initialValues.email,
    password: props.initialValues.password,
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .label('email')
      .required(null)
      .email('Email is not in the correct format'),
    password: yup
      .string()
      .label('password')
      .required('Password is required')
  });

  return (
    <Formik
      innerRef={ref}
      initialValues={initialValues}
      onSubmit={props.submitHandler}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
        <Container style={styles.mainContainer}>
          <ValidatedTextInput
            containerStyle={styles.formInputContainer}
            style={styles.formInput}
            placeholder="Email"
            touched={touched.email}
            error={errors.email}
            onChangeText={text => setFieldValue('email', text.trim().toLowerCase())}
            onBlur={handleBlur('email')}
            value={values.email}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current._root.focus()}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <PasswordTextInput
            containerStyle={styles.formInputContainer}
            style={styles.formInput}
            ref={passwordInputRef}
            placeholder="Password"
            touched={touched.password}
            error={errors.password}
            onChangeText={text => setFieldValue('password', text.trim())}
            onBlur={handleBlur('password')}
            value={values.password}
            onSubmitEditing={handleSubmit}
            autoCompleteType="password"
            textContentType="password"
          />
          <Button
            containerStyle={styles.buttonContainer}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text style={isValid ? styles.loginText : { ...styles.loginText, ...styles.loginTextDisabled }}>Login</Text>
          </Button>
        </Container>
      )}
    </Formik>
  );
});

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%'
  },
  buttonContainer: {
    width: '90%'
  },
  formInputContainer: {
    width: '90%',
    marginBottom: 15
  },
  formInput: {
    fontSize: 13
  },
  loginText: {
    color: globalColors.white,
    fontSize: 16,
    fontFamily: globalFonts.DMSansMedium
  },
  loginTextDisabled: {
    color: globalColors.disabledText
  }
});