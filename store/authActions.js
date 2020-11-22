import firebase from '../database/firebase';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import { AsyncStorage } from 'react-native';
import { ON_AUTH_STATE_CHANGED, LOGOUT, SET_USER_PROFILE } from './actionTypes';
import { globalConstants } from '../global/exports';
let firestoreListener;

export const verifyAuth = () => {
  return async (dispatch, getState) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        if (!user.emailVerified) {
          //If email is not yet verified, start a timer to check verification property on user
          const checkEmailVerified = setInterval(async () => {
            await user.reload();
            if (user.emailVerified) {
              await firebase
                .firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                  'onboard.emailVerified': true
                });
              clearInterval(checkEmailVerified);
              dispatch(startFirestoreListener(user));
            }
          }, 1000);
          dispatch({
            type: ON_AUTH_STATE_CHANGED,
            authUser: {
              id: user.uid,
              email: user.email,
              firstName: '',
              lastName: '',
              photoUrl: '',
              onboard: {
                emailVerified: false,
                profileCreated: false
              }
            }
          });
        } else {
          //If google user or Expo  use, skip .emailVerified check
          dispatch(startFirestoreListener(user));
        }
      } else {
        //No user detected in auth()
        dispatch(logout());
        dispatch({
          type: ON_AUTH_STATE_CHANGED,
          authUser: null
        });
      }
    });
  };
};

export const startFirestoreListener = (user) => {
  return async (dispatch, getState) => {
    if (firestoreListener) {
      firestoreListener();
    }
    firestoreListener = firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(async (doc) => {
        // console.log(user);
        if (doc.exists) {
          const authUser = {
            id: user.uid,
            email: user.email,
            photoUrl: doc.data().photoUrl,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            onboard: doc.data().onboard
          };
          if (doc.data().onboard.emailVerified) {
            if (!doc.data().onboard.profileCreated) {
              dispatch({
                //If profile still to be created, set temp profile in Redux Storage to be used as pre-fill data in profile creation
                type: SET_USER_PROFILE,
                userProfile: authUser
              });
            } else {
              //If email is verified and profile is completed, set Login to AsyncStorage
              await AsyncStorage.setItem('authUser', authUser.id);
            }
          }
          dispatch({
            type: ON_AUTH_STATE_CHANGED,
            authUser
          });
        }
      });
  };
};

export const signupWithEmail = async (email, password) => {
  const userCredential = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  await firebase
    .firestore()
    .collection('users')
    .doc(userCredential.user.uid)
    .set({
      email: userCredential.user.email,
      firstName: '',
      lastName: '',
      photoUrl: '',
      onboard: {
        emailVerified: userCredential.user.emailVerified,
        profileCreated: false
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
};

export const sendEmailVerification = async (email) => {
  await firebase.functions().httpsCallable('sendEmailVerification')({ email });
};

export const sendPasswordReset = async (email) => {
  await firebase.functions().httpsCallable('sendPasswordReset')({ email });
};

export const loginWithEmail = async (email, password) => {
  await firebase.auth().signInWithEmailAndPassword(email, password);
};

export const loginWithGoogle = async () => {
  const { androidClientId, iosClientId } = (
    await firebase.functions().httpsCallable('getGoogleClientIds')()
  ).data;
  const result = await Google.logInAsync({
    androidClientId,
    iosClientId,
    scopes: ['profile', 'email']
  });
  if (result.type === globalConstants.SUCCESS) {
    const credential = firebase.auth.GoogleAuthProvider.credential(
      result.idToken,
      result.accessToken
    );
    const userCredential = await firebase
      .auth()
      .signInWithCredential(credential);
    if (userCredential.additionalUserInfo.isNewUser) {
      //If auth() has not recognized this account before
      await firebase
        .firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .set({
          email: result.user.email,
          firstName: result.user.givenName,
          lastName: result.user.familyName,
          photoUrl: result.user.photoUrl,
          onboard: {
            emailVerified: userCredential.user.emailVerified,
            profileCreated: false
          },
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      await firebase
        .firestore()
        .collection('users')
        .doc(userCredential.user.uid)
        .update({});
    }
  }
  return result;
};

// export const loginWithFacebook = async () => {
//   const FACEBOOK_APP_ID = (await firebase.functions().httpsCallable('getFacebookAppId')()).data;
//   const FACEBOOK_APP_NAME = (await firebase.functions().httpsCallable('getFacebookAppName')()).data;
//   await Facebook.initializeAsync(FACEBOOK_APP_ID, FACEBOOK_APP_NAME);
//   const result = await Facebook.logInWithReadPermissionsAsync(
//     FACEBOOK_APP_ID,
//     { permissions: ["public_profile", "email"] }
//   );
//   if (result.type === "success") {// Build Firebase credential with the Facebook access token.
//     const credential = firebase.auth.FacebookAuthProvider.credential(result.token);
//     const userCredential = await firebase.auth().signInWithCredential(credential);// Sign in with credential from the Facebook user.
//     if (userCredential.additionalUserInfo.isNewUser) {
//       const { email, first_name, last_name, picture } = userCredential.additionalUserInfo.profile;
//       await firebase.functions().httpsCallable('createFacebookUser')({
//         id: userCredential.user.uid,
//         email: email,
//         firstName: first_name,
//         lastName: last_name,
//         photoUrl: picture.data.url
//       });
//     }
//   }
//   return result.type || 'fail';
// };

export const logout = () => {
  return async (dispatch, getState) => {
    if (firestoreListener) {
      firestoreListener();
    }
    await AsyncStorage.removeItem('authUser');
    await firebase.auth().signOut();
    dispatch({ type: LOGOUT });
  };
};
