const functions = require('firebase-functions');
const admin = require('firebase-admin');
const emailFunctions = require('./email.js');
const dotenv = require('dotenv');
const constants = require('../global/constants');
dotenv.config();
const PASSWORD = 'password';
const GOOGLE = 'google.com';
const FACEBOOK = 'facebook.com';

exports.deleteNonVerifiedUsers = functions.runWith(constants.runtimeOpts).pubsub.schedule('every day at 7am').timeZone('Sydney').onRun(async context => {
  const SEVEN_DAYS_IN_MILLISECONDS = 604800000;
  const users = await getAllUsers();
  const deleteUserList = [];
  for (const user of users) {
    if (!user.emailVerified) {
      const dateDifferenceInMilliseconds = (new Date()).getTime() - new Date(user.metadata.creationTime).getTime();
      if (dateDifferenceInMilliseconds >= SEVEN_DAYS_IN_MILLISECONDS) {
        deleteUserList.push(user.uid);
      }
    }
  }
  const promises = [];
  for (const uid of deleteUserList) {
    promises.push(admin.firestore().collection('users').doc(uid).delete());
  }
  await Promise.all(promises);
  return admin.auth().deleteUsers(deleteUserList);
});

exports.onCreateUser = functions.runWith(constants.runtimeOpts).auth.user().onCreate(async user => {
  if (user.emailVerified) {
    return await sendWelcomeEmail(user.email);
  } else {
    return await sendEmailVerification(user.email);
  }
});

exports.sendEmailVerification = functions.runWith(constants.runtimeOpts).https.onCall(async (data, context) => {
  return await sendEmailVerification(data.email);
});

exports.sendWelcomeEmail = functions.runWith(constants.runtimeOpts).firestore.document('users/{id}').onUpdate(async (change, context) => {
  if (!change.before.data().onboard.emailVerified && change.after.data().onboard.emailVerified) {
    return await sendWelcomeEmail(change.after.data().email);
  }
  return true;
});

exports.sendPasswordReset = functions.runWith(constants.runtimeOpts).https.onCall(async (data, context) => {
  const passwordResetLink = await admin.auth().generatePasswordResetLink(data.email);
  admin.auth().generateSignInWithEmailLink()
  return await emailFunctions.sendEmail({
    from: process.env.FROM_EMAIL,
    to: data.email,
    subject: 'Reset your password for RuffnTumble App',
    html: `<p>Hello fellow dog owner,</p>
    <p>Please reset your password by clicking <a href="${passwordResetLink}">here.</a></p>
    <p>RuffnTumble Team</p>`
  })
});

const sendWelcomeEmail = async email => {
  return await emailFunctions.sendEmail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Welcome to RuffnTumble App',
    html: `<p>Hello fellow dog owner,</p>
    <p>We are glad to have you on board with the best social app for dogs.</a></p>
    <p>RuffnTumble Team</p>`
  });
};

const sendEmailVerification = async email => {
  const emailVerificationLink = await admin.auth().generateEmailVerificationLink(email);
  return await emailFunctions.sendEmail({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'Verify your email for RuffnTumble App',
    html: `<p>Hello fellow dog owner,</p>
    <p>Please verify your email by clicking <a href="${emailVerificationLink}">here.</a></p>
    <p>RuffnTumble Team</p>`
  });
};

exports.getGoogleClientIds = functions.runWith(constants.runtimeOpts).https.onCall(async () => {
  return {
    androidClientId: process.env.ANDROID_CLIENT_ID,
    iosClientId: process.env.IOS_CLIENT_ID
  };
});

const getAllUsers = async nextPageToken => {
  const users = [];
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
  users.push(...listUsersResult.users);
  if (listUsersResult.pageToken) {
    const nextUsers = await getAllUsers(listUsersResult.pageToken);
    users.push(...nextUsers);
  }
  return users;
};

// exports.getFacebookAppId = functions.runWith(constants.runtimeOpts).https.onCall(async () => {
//   return process.env.FACEBOOK_APP_ID;
// });

// exports.getFacebookAppSecret = functions.runWith(constants.runtimeOpts).https.onCall(async () => {
//   return process.env.FACEBOOK_APP_SECRET;
// });

// exports.getFacebookAppName = functions.runWith(constants.runtimeOpts).https.onCall(async () => {
//   return process.env.FACEBOOK_APP_NAME;
// });

// exports.createEmailUser = functions.runWith(constants.runtimeOpts).https.onCall(async (data, context) => {
//   const { email, password } = data;
//   try {
//     // await verifyAuthAvailability(email, PASSWORD);
//     const userRef = await admin.auth().createUser({
//       email,//If user does not exist at all in database, create a new user and new firestore entry
//       password
//     });
//     return await admin.firestore().collection('users').doc(userRef.uid).set({
//       email,
//       firstName: '',
//       lastName: '',
//       photoUrl: '',
//       onboard: {
//         emailVerified: false,
//         profileCreated: false
//       },
//       createdAt: admin.firestore.FieldValue.serverTimestamp()
//     });
//   } catch (error) {
//     console.error(error);
//     throw new functions.https.HttpsError('unknown', error.message, error);
//   }
// });

// exports.createGoogleUser = functions.runWith(constants.runtimeOpts).https.onCall(async (data, context) => {
//   const { id, email, firstName, lastName, photoUrl } = data;
//   try {
//     // await verifyAuthAvailability(email, GOOGLE);
//     return await admin.firestore().collection('users').doc(id).set({
//       email,
//       firstName,
//       lastName,
//       photoUrl,
//       onboard: {
//         emailVerified: true,
//         profileCreated: false
//       },
//       createdAt: admin.firestore.FieldValue.serverTimestamp()
//     });
//   } catch (error) {
//     console.error(error);
//     throw new functions.https.HttpsError('unknown', error.message, error);
//   }
// });

// exports.createFacebookUser = functions.runWith(constants.runtimeOpts).https.onCall(async (data, context) => {
//   const { id, email, firstName, lastName, photoUrl } = data;
//   try {
//     await verifyAuthAvailability(email, FACEBOOK);
//     await admin.auth().updateUser(id, { emailVerified: true });
//     await admin.firestore().collection('users').doc(id).set({
//       email,
//       firstName,
//       lastName,
//       photoUrl,
//       onboard: {
//         emailVerified: true,
//         profileCreated: false
//       },
//       createdAt: admin.firestore.FieldValue.serverTimestamp()
//     });
//     return true;
//   } catch (error) {
//     console.error(error);
//     throw new functions.https.HttpsError('unknown', error.message, error);
//   }
// });

// const geFriendlyProviderName = provider => {
//   switch (provider) {
//     case PASSWORD:
//       return 'Email'
//     case GOOGLE:
//       return 'Google'
//     case FACEBOOK:
//       return 'Facebook'
//     default:
//       return '';
//   }
// };

// const verifyAuthAvailability = async (email, provider) => {
//   const authUser = admin.auth().getUserByEmail(email);
//   if (authUser) {//If auth method has already been created
//     const providers = admin.auth().fetchSignInMethodsForEmail(email);
//     if (provider === PASSWORD && providers.includes(provider)) {//If provider is email and email already exists
//       throw new Error(`${geFriendlyProviderName(provider)} account already exists.`);
//     } else {//If other auth methods exists
//       const friendlyProviderNames = authUser.providers.map(provider => geFriendlyProviderName(provider));
//       throw new Error(`An account has already been created with the following providers: ${friendlyProviderNames.join(', ')}. Login first to link an additional login method.`);
//     }
//   }
//   return true;
// };