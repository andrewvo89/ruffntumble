import firebase from '../database/firebase';
import { SET_GOOGLE_MAPS_API_KEY } from './actionTypes';
const RADIUS = 10000;

export const getGoogleMapsApiKey = () => {
  return async dispatch => {
    const googleMapsApiKey = (await firebase.functions().httpsCallable('getGoogleMapsApiKey')()).data;
    dispatch({
      type: SET_GOOGLE_MAPS_API_KEY,
      googleMapsApiKey
    });
  };
};