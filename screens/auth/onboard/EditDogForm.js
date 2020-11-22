import { Formik } from 'formik';
import React, { useRef, useEffect, Fragment } from 'react';
import { StyleSheet } from 'react-native';
import * as yup from 'yup';
import { Button, Text, ValidatedTextInput, SearchPicker, SwitchSelector, SearchPickerMulti, DateTimePicker } from '../../../components/exports';
import { globalColors, globalFonts } from '../../../global/exports';
import breeds from '../../../database/local/breeds';
import genders from '../../../database/local/genders';

export default props => {
  const formikRef = useRef();
  const breedInputRef = useRef();
  //Update the form values every time props.dogProfile changes so that validation can happen
  useEffect(() => {
    for (const value in props.dogProfile) {
      formikRef.current.setFieldValue(value, props.dogProfile[value]);
    }
  }, [props.dogProfile]);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .label('Dog name')
      .required('Dog name is required.'),
    breed: yup
      .array()
      .label('Breed')
      .required('Breed is required')
      .of(yup.string().required().oneOf(breeds.map(breed => breed.id), "Breed be a valid option")),
    gender: yup
      .string()
      .label('Gender')
      .required('Gender is required.')
      .oneOf(genders.map(gender => gender.id), "Must be a valid option"),
    dateOfBirth: yup
      .date()
      .label("Date of birth")
      .required('Date of birth is required.')
      .max(new Date())
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={props.dogProfile}
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
              placeholder="Dog name"
              touched={touched.name}
              error={errors.name}
              value={props.dogProfile.name}
              onChangeText={text => {
                props.setDogProfile({
                  ...props.dogProfile,
                  name: text
                });
              }}
              onBlur={handleBlur('name')}
              returnKeyType="next"
              onSubmitEditing={() => breedInputRef.current._toggleSelector()}
              textContentType="name"
              autoFocus
            />
            <SearchPickerMulti
              containerStyle={styles.formInputContainer}
              selectToggleText={styles.formInput}
              ref={breedInputRef}
              selectText="Select breed(s)"
              searchPlaceholderText="Search breeds"
              maxSelections={3}
              maxSelectionsError="You cannot select more than 3 breeds."
              data={breeds.map(breed => ({
                value: breed.id,
                label: breed.name
              }))}
              selectedItems={props.dogProfile.breed}
              onSelectedItemsChange={items => {
                props.setDogProfile({
                  ...props.dogProfile,
                  breed: items,
                  touched: true
                });
              }}
              error={errors.breed}
            />
            <SwitchSelector
              containerStyle={styles.formInputContainer}
              fontSize={13}
              options={genders.map(gender => ({
                value: parseInt(gender.id),
                label: gender.name
              }))}
              value={parseInt(props.dogProfile.gender)}
              onChangeValue={value => {
                const transformedValue = value.toString().padStart(5, 0);
                props.setDogProfile({
                  ...props.dogProfile,
                  gender: transformedValue
                });
              }}
            />
            <DateTimePicker
              containerStyle={styles.formInputContainer}
              style={styles.formInput}
              placeholder="Date of birth"
              value={props.dogProfile.dateOfBirth}
              onChangeValue={value => {
                props.setDogProfile({
                  ...props.dogProfile,
                  dateOfBirth: value
                });
              }}
            />
            <Button
              containerStyle={styles.buttonContainer}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text
                style={isValid ? styles.createText : { ...styles.createText, ...styles.createTextDisabled }}
              >Save Changes</Text>
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
    width: '90%',
    marginBottom: 10
  },
  removeButton: {
    backgroundColor: globalColors.red
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