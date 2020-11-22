const functions = require('firebase-functions');
const dotenv = require('dotenv');
const constants = require('../global/constants');
dotenv.config();

exports.getGoogleMapsApiKey = functions.runWith(constants.runtimeOpts).https.onCall(async () => {
  return process.env.GOOGLE_MAPS_API_KEY;
});