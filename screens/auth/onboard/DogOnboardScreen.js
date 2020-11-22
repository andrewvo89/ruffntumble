import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, ImageSelector, KeyboardAvoidingView, ScreenContainer, ScrollView, Text, Container, Button } from '../../../components/exports';
import { globalColors, globalFonts, globalStyles, globalImageFunctions } from '../../../global/exports';
import * as profileActions from '../../../store/profileActions';
import DogOnboardForm from './DogOnboardForm';

export default props => {
  const formikRef = useRef();
  const initialValues = {
    name: '',
    breed: [],
    gender: "00000",
    dateOfBirth: null,
    photoUrl: '',
    touched: false
  };//Touched used to fix bug on disabling Add Dog button when not valid
  const dispatch = useDispatch();
  const dogProfileRef = useRef();
  const profileState = useSelector(state => state.profileState);
  const [dogProfile, setDogProfile] = useState(profileState.dogProfile ? profileState.dogProfile : initialValues);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  //Save data to redux when screen is killed by going back to user profile
  useEffect(() => {
    return async () => {
      dispatch(profileActions.setDogProfile({
        ...dogProfileRef.current,
        name: dogProfileRef.current.name.trim()
      }));
    }
  }, []);
  //Update ref so that it can be used upon unmounting to save the temporary state
  useEffect(() => {
    dogProfileRef.current = dogProfile;
  }, [dogProfile]);
  //Reset image selector right after it shows
  useEffect(() => {
    if (showImageSelector) {
      setShowImageSelector(false);
    }
  }, [showImageSelector]);
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
      'Profile creation error',
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

  const finishHandler = async () => {
    try {
      const dbUserProfile = { ...profileState.userProfile };
      const dbDogProfiles = [...profileState.dogProfiles];
      await formikRef.current.validateForm();
      if (formikRef.current.isValid) {//If form is valid, add that current profile (without user having to click Add Another Dog)
        dbDogProfiles.push(dogProfile);
      }
      setLoading(true);
      if (dbDogProfiles.length > 0) {
        await dispatch(profileActions.createDogProfiles({
          userId: dbUserProfile.id,
          dogProfiles: dbDogProfiles
        }));
      }
      await dispatch(profileActions.updateUserProfile({
        userProfile: dbUserProfile
      }));
      Toast.show(`Profile created successfully.`, {
        duration: 3000,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        containerStyle: globalStyles.toast
      });
    } catch (error) {
      setError(error);
    }
  };

  const addDogHandler = async () => {
    try {
      dispatch(profileActions.addDogProfile({
        id: new Date().getTime().toString(),
        name: dogProfile.name.trim(),
        breed: dogProfile.breed,
        gender: dogProfile.gender,
        dateOfBirth: dogProfile.dateOfBirth,
        photoUrl: dogProfile.photoUrl
      }));
      setDogProfile(initialValues);
      Toast.show(`${dogProfile.name.trim()} added successfully.`, {
        duration: 3000,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        containerStyle: globalStyles.toast
      });
    } catch (error) {
      setError(error);
    }
  }

  return (
    <ScrollView keyboardAvoiding>
      <KeyboardAvoidingView>
        <ScreenContainer>
          {loading ? (
            <Fragment>
              <ActivityIndicator
                size="large"
                color={globalColors.primary}
              />
              <Text>Creating your profile...</Text>
            </Fragment>
          ) : (
              <Fragment>
                <ImageSelector
                  initializeHandler={showImageSelector}
                  setPickedImage={newPickedImage => {
                    setDogProfile({
                      ...dogProfile,
                      photoUrl: newPickedImage
                    });
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.avatarContainer}
                  onPress={() => setShowImageSelector(true)}
                  disabled={loading}
                >
                  <Avatar
                    size={150}
                    image={dogProfile.photoUrl}
                    icon={{
                      name: 'dog',
                      type: 'material-community',
                      color: 'white'
                    }}
                  />
                </TouchableOpacity>
                {profileState.dogProfiles.length > 0 ? (
                  <Container style={styles.dogProfilesAvatarContainer}>
                    {profileState.dogProfiles.map(dogProfile => {
                      return (
                        <Avatar
                          key={dogProfile.id}
                          onPress={() => props.navigation.navigate('editdogprofile', {
                            id: dogProfile.id
                          })}
                          style={styles.dogProfilesAvatar}
                          size={50}
                          image={dogProfile.photoUrl}
                          icon={{
                            name: 'dog',
                            type: 'material-community',
                            color: 'white'
                          }}
                        />
                      );
                    })}
                  </Container>
                ) : null}
                <DogOnboardForm
                  ref={formikRef}
                  addDogHandler={addDogHandler}
                  dogProfile={dogProfile}
                  setDogProfile={setDogProfile}
                />
                <Button
                  containerStyle={styles.buttonContainer}
                  onPress={finishHandler}
                >
                  <Text style={styles.createText} >Finish</Text>
                </Button>
              </Fragment>
            )}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export const screenOptions = {
  headerTitle: 'Dog Profile'
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
  },
  addDogProfileToast: {
    fontFamily: globalFonts.DMSansRegular,
    fontSize: 16
  },
  dogProfilesAvatarContainer: {
    height: 50,
    marginBottom: 10,
    flexDirection: 'row',
    // borderColor: globalColors.grey,
    // borderWidth: 1,
    // borderRadius: 100,
    width: '90%'
  },
  dogProfilesAvatar: {
    marginHorizontal: 2.5
  }
});