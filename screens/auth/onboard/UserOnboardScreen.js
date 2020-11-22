import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, ImageSelector, ScreenContainer, TextLink, ScrollView, KeyboardAvoidingView } from '../../../components/exports';
import { globalColors, globalFonts } from '../../../global/exports';
import { setUserProfile as setStoreUserProfile } from '../../../store/profileActions';
import UserOnboardForm from './UserOnboardForm';
import { HeaderBackButton } from '@react-navigation/stack';
// import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
// import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../../store/authActions';
import { useFocusEffect } from '@react-navigation/native';

export default props => {
  const dispatchProfile = useDispatch();
  const profileState = useSelector(state => state.profileState);
  const [userProfile, setUserProfile] = useState(profileState.userProfile);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  //Set dynamic screen options when loading changes
  // useEffect(() => {
  //   props.navigation.setOptions({
  //     ...screenOptions,
  //     headerRight: () => {
  //       if (!userProfileCreated || loading) {
  //         return null;
  //       }
  //       return (
  //         <HeaderButtons
  //           HeaderButtonComponent={HeaderButton}
  //         >
  //           <Item
  //             IconComponent={Ionicons}
  //             iconSize={24}
  //             iconName={Platform.OS === 'android' ? 'md-arrow-forward' : 'ios-arrow-forward'}
  //             onPress={() => props.navigation.navigate('dogprofile')}
  //           />
  //         </HeaderButtons>
  //       );
  //     }
  //   });
  // }, [userProfileCreated, loading]);
  //Disable back button when adding profile, ask to log out otherwise
  useFocusEffect(() => {
    const backAction = () => {
      if (loading) {
        return true;
      }
      Alert.alert("Log out", "Are you sure you want to log out?", [{
        text: "No",
        onPress: () => null,
        style: "cancel"
      }, {
        text: "Yes",
        onPress: async () => await dispatch(logout())
      }
      ], { cancelable: true });
      return true;
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    props.navigation.setOptions({
      ...screenOptions,
      headerLeft: props => {
        if (loading) {
          return null;
        }
        return (
          <HeaderBackButton
            {...props}
            onPress={() => backAction()}
          />
        );
      },
      headerBackTitle: "Log out"
    });
    return () => {
      backHandler.remove();
    }
  }, [loading]);
  //Reset image selector right after it shows
  useEffect(() => {
    if (showImageSelector) {
      setShowImageSelector(false);
    }
  }, [showImageSelector]);

  if (error) {
    Alert.alert(
      'Profile Creation Error',
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

  const submitHandler = () => {
    dispatchProfile(setStoreUserProfile({
      ...userProfile,
      firstName: userProfile.firstName.trim(),
      lastName: userProfile.lastName.trim()
    }));
    props.navigation.navigate('dogprofile');
  };

  // const submitHandler = async values => {
  //   try {
  //     setInitialValues(values);
  //     setLoading(true);
  //     let photoUrl = authUser.photoUrl;
  //     const firstName = values.firstName.trim();
  //     const lastName = values.lastName.trim();
  //     const id = authUser.id;
  //     if (pickedImage) {
  //       photoUrl = await uploadProfilePicture(id, pickedImage);
  //     } else if (photoUrl && !photoUrl.includes('400x400')) {//If your existing picture has 400x400, then don't both copying. Copying function is for Google and Facebook images.
  //       photoUrl = await copyProfilePicture(id, photoUrl);
  //     }
  //     await updateUserProfile(id, firstName, lastName, photoUrl);
  //     setLoading(false);
  //   } catch (error) {
  //     setError(error);
  //   }
  // }

  return (
    <ScrollView keyboardAvoiding>
      <KeyboardAvoidingView>
        <ScreenContainer>
          <ImageSelector
            initializeHandler={showImageSelector}
            setPickedImage={newPickedImage => {
              setUserProfile({
                ...userProfile,
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
              image={userProfile.photoUrl}
            />
          </TouchableOpacity>
          {!loading && (
            <TextLink
              style={styles.mainText}
              onPress={() => setShowImageSelector(true)}
            >Change my picture
            </TextLink>
          )}
          {loading ? (
            <ActivityIndicator
              size="large"
              color={globalColors.primary}
            />
          ) : (
              <UserOnboardForm
                submitHandler={submitHandler}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            )}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export const screenOptions = {
  headerTitle: 'User Profile'
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