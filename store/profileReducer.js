import { SET_USER_PROFILE, SET_DOG_PROFILES, SET_DOG_PROFILE, ADD_DOG_PROFILE, EDIT_DOG_PROFILE, REMOVE_DOG_PROFILE } from './actionTypes';

const initialState = {
  userProfile: null,
  dogProfiles: [],
  dogProfile: null
};

export default (state = initialState, action) => {
  let newDogProfiles;
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.userProfile
      }
    case SET_DOG_PROFILES:
      return {
        ...state,
        dogProfiles: action.dogProfiles
      }
    case SET_DOG_PROFILE:
      return {
        ...state,
        dogProfile: action.dogProfile
      }
    case ADD_DOG_PROFILE:
      return {
        ...state,
        dogProfiles: [
          ...state.dogProfiles,
          action.dogProfile
        ],
        dogProfile: null
      }
    case EDIT_DOG_PROFILE:
      const foundIndex = state.dogProfiles.findIndex(dogProfile => {
        return dogProfile.id === action.dogProfile.id
      });
      newDogProfiles = [...state.dogProfiles];
      newDogProfiles.splice(foundIndex, 1, action.dogProfile);
      return {
        ...state,
        dogProfiles: newDogProfiles
      }
    case REMOVE_DOG_PROFILE:
      newDogProfiles = state.dogProfiles.filter(dogProfile => {
        return dogProfile.id != action.id;
      });
      return {
        ...state,
        dogProfiles: newDogProfiles
      }
    default:
      return state;
  }
}