import { Formik } from 'formik';
import React, { useRef, useEffect, Fragment } from 'react';
import { StyleSheet } from 'react-native';
import * as yup from 'yup';
import { Button, Text, ValidatedTextInput } from '../../../components/exports';
import { globalColors, globalFonts } from '../../../global/exports';

export default props => {
  const formikRef = useRef();
  const lastNameInputRef = useRef();
  //Update the form values every time props.userProfile changes so that validation can happen
  useEffect(() => {
    for (const value in props.userProfile) {
      formikRef.current.setFieldValue(value, props.userProfile[value]);
    }
  }, [props.userProfile]);
  const validationSchema = yup.object().shape({
    firstName: yup
      .string()
      .label('First Name')
      .required('First name is required.'),
    lastName: yup
      .string()
      .label('Last Name')
      .required('Last name is required.')
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={props.userProfile}
      onSubmit={props.submitHandler}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => {
        return (
          <Fragment>
            <ValidatedTextInput
              containerStyle={styles.formInputContainer}
              style={styles.formInput}
              placeholder="First name"
              touched={touched.firstName}
              error={errors.firstName}
              onChangeText={text => {
                props.setUserProfile({
                  ...props.userProfile,
                  firstName: text
                });
              }}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              returnKeyType="next"
              onSubmitEditing={() => lastNameInputRef.current._root.focus()}
              textContentType="givenName"
              autoFocus
            />
            <ValidatedTextInput
              containerStyle={styles.formInputContainer}
              style={styles.formInput}
              ref={lastNameInputRef}
              placeholder="Last name"
              touched={touched.lastName}
              error={errors.lastName}
              onChangeText={text => {
                props.setUserProfile({
                  ...props.userProfile,
                  lastName: text
                });
              }}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              onSubmitEditing={handleSubmit}
              textContentType="familyName"
            />
            <Button
              containerStyle={styles.buttonContainer}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text
                style={isValid ? styles.createText : { ...styles.createText, ...styles.createTextDisabled }}
              >Next</Text>
            </Button>
          </Fragment>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginBottom: 10
  },
  mainText: {
    marginBottom: 30
  },
  formInputContainer: {
    width: '90%',
    marginBottom: 15
  },
  formInput: {
    fontSize: 13
  },
  buttonContainer: {
    width: '90%'
  },
  createText: {
    color: globalColors.white,
    fontSize: 16,
    fontFamily: globalFonts.DMSansMedium
  },
  createTextDisabled: {
    color: globalColors.disabledText
  }
});