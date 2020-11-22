import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const config = {
  apiKey: Constants.manifest.extra.FIREBASE_API_KEY,
  authDomain: Constants.manifest.extra.FIREBASE_AUTH_DOMAIN,
  databaseURL: Constants.manifest.extra.FIREBASE_DATABASE_URL,
  projectId: Constants.manifest.extra.FIREBASE_PROJECT_ID,
  storageBucket: Constants.manifest.extra.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.manifest.extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.manifest.extra.FIREBASE_APP_ID,
  measurementId: Constants.manifest.extra.FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
firebase.initializeApp(config);
firebase.firestore();
firebase.auth();
firebase.storage();
firebase.functions();

export default firebase;
