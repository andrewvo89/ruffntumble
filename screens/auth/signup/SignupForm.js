import { Formik } from 'formik';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import * as yup from 'yup';
import { Button, Container, Text, ValidatedTextInput, PasswordTextInput, TextInput } from '../../../components/exports';
import { globalColors, globalFonts, globalStyles } from '../../../global/exports';
import Toast from 'react-native-root-toast';

export default props => {
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();

  const initialValues = {
    email: props.initialValues.email,
    password: props.initialValues.password,
    passwordConfirm: props.initialValues.password
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .label('Email')
      .required()
      .email('Email is not in the correct format.'),
    password: yup
      .string()
      .label('Password')
      .required()
      .min(6, 'Password must be at least 6 character long.')
      .matches(/(?=.*[A-Z])/, 'Password must contain at least 1 uppercase letter'),
    passwordConfirm: yup
      .string()
      .label('Confirmation Password')
      .required()
      .oneOf([yup.ref('password')], "Confirmation password must match password.")
    // .test('passwords-match', 'Passwords must match', function (value) {
    //   return this.parent.password === value;
    // })
  });

  const errorToastHandler = errorValue => {
    if (errorValue) {
      Toast.show(errorValue, {
        duration: 1000,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        containerStyle: globalStyles.toast
      });
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={props.submitHandler}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched, }) => {
        return (
          <Container style={styles.mainContainer}>
            <ValidatedTextInput
              containerStyle={styles.formInputContainer}
              style={styles.formInput}
              showIcon={true}
              showBorder={false}
              placeholder="Email"
              touched={touched.email}
              error={errors.email}
              onChangeText={text => setFieldValue('email', text.trim().toLowerCase())}
              onBlur={() => {
                errorToastHandler(errors.email);
                handleBlur('email');
              }}
              value={values.email}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current._root.focus()}
              keyboardType="email-address"
              autoCompleteType="email"
              textContentType="emailAddress"
              autoFocus
            />
            <PasswordTextInput
              containerStyle={styles.formInputContainer}
              style={styles.formInput}
              ref={passwordInputRef}
              placeholder="Password"
              touched={touched.password}
              error={errors.password}
              onChangeText={text => setFieldValue('password', text.trim())}
              onBlur={() => {
                errorToastHandler(errors.password);
                handleBlur('password');
              }}
              value={values.password}
              returnKeyType="next"
              onSubmitEditing={() => passwordConfirmInputRef.current._root.focus()}
              autoCompleteType="password"
              textContentType="newPassword"
            />
            <PasswordTextInput
              containerStyle={styles.formInputContainer}
              style={styles.formInput}
              ref={passwordConfirmInputRef}
              placeholder="Confirm Password"
              touched={touched.passwordConfirm}
              error={errors.passwordConfirm}
              onChangeText={text => setFieldValue('passwordConfirm', text.trim())}
              onBlur={() => {
                errorToastHandler(errors.passwordConfirm);
                handleBlur('passwordConfirm');
              }}
              value={values.passwordConfirm}
              onSubmitEditing={handleSubmit}
              autoCompleteType="password"
              textContentType="newPassword"
            />
            <Button
              containerStyle={styles.buttonContainer}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={isValid ? styles.signupText : { ...styles.signupText, ...styles.signupTextDisabled }}>Sign up</Text>
            </Button>
          </Container>
        );
      }}
    </Formik>
  );
};

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
  signupText: {
    color: globalColors.white,
    fontSize: 16,
    fontFamily: globalFonts.DMSansMedium
  },
  signupTextDisabled: {
    color: globalColors.disabledText
  }
});