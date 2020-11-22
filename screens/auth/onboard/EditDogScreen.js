import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, ImageSelector, ScreenContainer, TextLink, ScrollView, KeyboardAvoidingView } from '../../../components/exports';
import { globalColors, globalFonts, globalStyles } from '../../../global/exports';
import { useSelector, useDispatch } from 'react-redux';
import { editDogProfile, removeDogProfile } from '../../../store/profileActions';
import Toast from 'react-native-root-toast';
import EditDogForm from './EditDogForm';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import { Octicons } from '@expo/vector-icons';

export default props => {
  const dispatchProfile = useDispatch();
  const dogProfiles = useSelector(state => state.profileState.dogProfiles);
  const [dogProfile, setDogProfile] = useState(
    dogProfiles.find(dogProfile => {
      return dogProfile.id === props.route.params.id;
    })
  );
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  //Set the headerTitle after you get the right dog profile from Redux based on the param id
  useEffect(() => {
    if (dogProfile) {
      props.navigation.setOptions({
        headerTitle: `${dogProfile.name}`,
        headerRight: () => {
          return (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
              <Item
                IconComponent={Octicons}
                iconSize={24}
                iconName={'trashcan'}
                onPress={() => {
                  Alert.alert('Remove dog', `Are you sure you want to remove ${dogProfile.name}`, [{
                    text: 'No',
                    style: 'cancel',
                    onPress: () => null
                  }, {
                    text: 'Yes',
                    onPress: () => {
                      dispatchProfile(removeDogProfile(dogProfile.id));
                      props.navigation.pop();
                      Toast.show(`${dogProfile.name.trim()} removed successfully.`, {
                        duration: 3000,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        containerStyle: globalStyles.toast
                      });
                    }
                  }], { cancelable: true });
                }}
              />
            </HeaderButtons>

          )
        }
      });
    }
  }, [dogProfile, props.navigation]);
  //Reset image selector right after it shows
  useEffect(() => {
    if (showImageSelector) {
      setShowImageSelector(false);
    }
  }, [showImageSelector]);

  if (error) {
    Alert.alert(
      'Profile edit error',
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

  const submitHandler = async () => {
    try {
      dispatchProfile(editDogProfile({
        id: dogProfile.id,
        name: dogProfile.name.trim(),
        breed: dogProfile.breed,
        gender: dogProfile.gender,
        dateOfBirth: dogProfile.dateOfBirth,
        photoUrl: dogProfile.photoUrl
      }));
      props.navigation.pop();
      Toast.show(`${dogProfile.name.trim()} saved successfully.`, {
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

  return (
    <ScrollView keyboardAvoiding>
      <KeyboardAvoidingView>
        <ScreenContainer>
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
              image={dogProfile ? dogProfile.photoUrl : null}
              icon={{
                name: 'dog',
                type: 'material-community',
                color: 'white'
              }}
            />
          </TouchableOpacity>
          {!loading && (
            <TextLink
              style={styles.mainText}
              onPress={() => setShowImageSelector(true)}
            >Upload dog picture</TextLink>
          )}
          {loading ? (
            <ActivityIndicator
              size="large"
              color={globalColors.primary}
            />
          ) : (
              <EditDogForm
                submitHandler={submitHandler}
                dogProfile={dogProfile}
                setDogProfile={setDogProfile}
              />
            )}
        </ScreenContainer>
      </KeyboardAvoidingView>
    </ScrollView>
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
  },
  addDogProfileToast: {
    fontFamily: globalFonts.DMSansRegular,
    fontSize: 16
  },
  dogProfilesAvatar: {
    marginRight: 5
  }
});