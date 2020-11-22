import firebase from '../database/firebase';
import constants from './constants';

const getFriendlyError = async (error) => {
  let newError;
  switch (error.code) {
    case 'auth/account-exists-with-different-credential':
      newError = await accountExistsWithDifferentCredentials(error);
      break;
    case 'auth/user-not-found':
      newError = wrongCredentials(error);
      break;
    case 'auth/wrong-password':
      newError = wrongCredentials(error);
      break;
    case 'auth/invalid-email':
      newError = wrongCredentials(error);
      break;
    case 'auth/email-already-in-use':
      newError = {
        ...error,
        message:
          'An account has already been created with Google. Login first via Google to link an additional login method.'
      };
      break;
    default:
      break;
  }
  return newError;
};

const accountExistsWithDifferentCredentials = async (error) => {
  const providers = firebase.auth().fetchSignInMethodsForEmail(error.email);
  const friendlyProviderNames = providers.map((provider) => {
    return geFriendlyProviderName(provider);
  });
  return {
    ...error,
    message: `An account has already been created with the following providers: ${friendlyProviderNames.join(
      ', '
    )}. Login first to link an additional login method.`
  };
};

const geFriendlyProviderName = (provider) => {
  switch (provider) {
    case constants.PASSWORD:
      return 'Email';
    case constants.GOOGLE:
      return 'Google';
    case constants.FACEBOOK:
      return 'Facebook';
    default:
      return '';
  }
};

const wrongCredentials = (error) => {
  return {
    ...error,
    message: 'Your login credentials are incorrect. Please try again.'
  };
};

export default {
  getFriendlyError
};
