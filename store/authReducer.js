import { ON_AUTH_STATE_CHANGED, LOGOUT } from "./actionTypes";

const initialState = {
  authUser: null,
  loginTouched: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ON_AUTH_STATE_CHANGED:
      return {
        ...state,
        authUser: action.authUser,
        loginTouched: true
      }
    case LOGOUT:
      return {
        ...state,
        authUser: null
      }
    default:
      return state;
  }
}