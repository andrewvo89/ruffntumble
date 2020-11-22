import firebase from '../database/firebase';
import { SET_USER_PROFILE, SET_DOG_PROFILES, SET_DOG_PROFILE, ADD_DOG_PROFILE, EDIT_DOG_PROFILE, REMOVE_DOG_PROFILE } from './actionTypes';
import { globalImageFunctions } from '../global/exports';

export const setUserProfile = userProfile => {
  return {
    type: SET_USER_PROFILE,
    userProfile
  };
};

export const setDogProfile = dogProfile => {
  return {
    type: SET_DOG_PROFILE,
    dogProfile
  };
};

export const addDogProfile = dogProfile => {
  return {
    type: ADD_DOG_PROFILE,
    dogProfile
  };
};

export const editDogProfile = dogProfile => {
  return {
    type: EDIT_DOG_PROFILE,
    dogProfile
  };
};

export const removeDogProfile = id => {
  return {
    type: REMOVE_DOG_PROFILE,
    id
  };
};

export const updateUserProfile = ({ userProfile }) => {
  return async dispatch => {
    const { id, firstName, lastName, photoUrl } = userProfile;
    const resizedPhotoUrl = await globalImageFunctions.resizeImage({
      uri: photoUrl,
      width: 400,
      format: 'jpeg'
    });
    const newPhotoUrl = await globalImageFunctions.getPhotoUrl({
      collection: 'users',
      docId: id,
      folder: 'profile',
      imageUri: resizedPhotoUrl
    });
    const currentUser = firebase.auth().currentUser;
    await currentUser.updateProfile({
      displayName: `${firstName} ${lastName}`,
      photoURL: newPhotoUrl ? newPhotoUrl : null
    });
    await firebase.firestore().collection('users').doc(id).update({
      firstName,
      lastName,
      photoUrl: newPhotoUrl,
      "onboard.profileCreated": true,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    dispatch({
      type: SET_USER_PROFILE,
      userProfile: null
    });
  }
};

export const createDogProfiles = ({ userId, dogProfiles }) => {
  return async dispatch => {
    for (const dogProfile of dogProfiles) {
      const { name, breed, gender, dateOfBirth, photoUrl } = dogProfile;
      const docRef = await firebase.firestore().collection('dogs').add({
        name,
        breed,//Date is converted to milliseconds because data is serialized, can't send date objects
        gender,//Need to convert milliseconds back to date.
        dateOfBirth,
        photoUrl,
        owners: [userId],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      const resizedPhotoUrl = await globalImageFunctions.resizeImage({
        uri: photoUrl,
        width: 400,
        format: 'jpeg'
      });
      const newPhotoUrl = await globalImageFunctions.getPhotoUrl({
        collection: 'dogs',
        docId: docRef.id,
        folder: 'profile',
        imageUri: resizedPhotoUrl
      });
      await firebase.firestore().collection('dogs').doc(docRef.id).update({
        photoUrl: newPhotoUrl
      });
    }
    dispatch({
      type: SET_DOG_PROFILE,
      dogProfile: null
    });
    dispatch({
      type: SET_DOG_PROFILES,
      dogProfiles: []
    });
  };
};