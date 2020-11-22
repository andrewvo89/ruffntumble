// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const auth = require('./functions/auth');
exports.deleteNonVerifiedUsers = auth.deleteNonVerifiedUsers;
exports.onCreateUser = auth.onCreateUser;
// exports.createEmailUser = auth.createEmailUser;
// exports.createGoogleUser = auth.createGoogleUser;
exports.sendEmailVerification = auth.sendEmailVerification;
exports.sendWelcomeEmail = auth.sendWelcomeEmail;
exports.getGoogleClientIds = auth.getGoogleClientIds;
exports.sendPasswordReset = auth.sendPasswordReset;
// exports.getFacebookAppId = auth.getFacebookAppId;
// exports.getFacebookAppSecret = auth.getFacebookAppSecret;
// exports.getFacebookAppName = auth.getFacebookAppName;

const places = require('./functions/places');
exports.getGoogleMapsApiKey = places.getGoogleMapsApiKey;