import { SET_GOOGLE_MAPS_API_KEY } from './actionTypes';

const initialState = {
  googleMapsApiKey: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_GOOGLE_MAPS_API_KEY:
      return {
        ...state,
        googleMapsApiKey: action.googleMapsApiKey
      }
    default:
      return state;
  }
};