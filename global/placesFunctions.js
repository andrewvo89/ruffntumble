import firebase from '../database/firebase';

const getUuid4 = () => {
  let currentDate = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (currentDate + Math.random() * 16) % 16 | 0;
    currentDate = Math.floor(currentDate / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

const getGeocodeLocation = async ({ googleMapsApiKey, latitude, longitude }) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`;
  const response = await fetch(url);
  const responseData = await response.json();
  let selectedResult = responseData.results[0];//Return the closest level type (establishment / street_address)
  return selectedResult;
};

const getPlaceDetails = async ({ googleMapsApiKey, placeId }) => {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${googleMapsApiKey}`;
  const response = await fetch(url);
  const responseData = await response.json();
  return responseData.result;
};

const getTextSearchLocations = async ({ googleMapsApiKey, placeTypes, selectedPlaceType, placeDetails, maxResults }) => {
  let results = [];
  const placeType = placeTypes.find(placeType => placeType.id === selectedPlaceType);
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
    `key=${googleMapsApiKey}` +
    `&location=${placeDetails.geometry.location.lat},${placeDetails.geometry.location.lng}` +
    `&query=${placeType.queryValue.split(" ").join("%20")}%20near%20${placeDetails.formatted_address.split(" ").join("%20")}` +
    `&radius=${placeType.radius}`;
  if (placeType.type) {
    url = url.concat(`&type=${placeType.type}`);
  };
  let response = await fetch(url);
  let responseData = await response.json();
  results.push(...responseData.results);
  // console.log(url);
  //Results with 20 or more will require more than 1 api call, 60 results max
  //If initial results length exceeds maxResults, do not enter the loop
  while (responseData.next_page_token && results.length < maxResults) {
    const pageTokenUrl = url.concat(`&pagetoken=${responseData.next_page_token}`);//Set 2 second delay to request from google API using pagetoken, as per api docs
    await new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
    response = await fetch(pageTokenUrl);
    responseData = await response.json();
    results.push(...responseData.results);
    if (results.length >= maxResults) {
      break;//If max is reached after above call, break out of loop
    }
  };
  if (results.length > maxResults) {
    results.splice(maxResults);
  }
  return results;

};

const calculateDistance = ({ latitudeA, longitudeA, latitudeB, longitudeB }) => {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((latitudeB - latitudeA) * p) / 2 +
    c(latitudeA * p) * c(latitudeB * p) *
    (1 - c((longitudeB - longitudeA) * p)) / 2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
};

const getImageUri = ({ googleMapsApiKey, maxWidth, photoReference }) => {
  return `https://maps.googleapis.com/maps/api/place/photo?` +
    `maxwidth=${maxWidth}` +
    `&photoreference=${photoReference}` +
    `&key=${googleMapsApiKey}`;
};

const getSuburbState = addressComponents => {
  const localityAddressComponent = addressComponents.find(address_component => address_component.types.includes('locality'));
  const stateAddressComponent = addressComponents.find(address_component => address_component.types.includes('administrative_area_level_1'));
  if (!localityAddressComponent && !stateAddressComponent) {
    return ``;
  }
  if (!localityAddressComponent) {
    return stateAddressComponent.long_name;
  }
  if (!stateAddressComponent) {
    return localityAddressComponent.long_name;
  }
  return `${localityAddressComponent.long_name}, ${stateAddressComponent.long_name}`
};

const getFirestorePlace = async placeId => {
  const doc = await firebase.firestore().collection('places').doc(placeId).get();
  if (doc.exists) {
    return {
      id: doc.id,
      ...doc.data()
    };
  }
  return null;
};

const createFirestorePlace = async ({ placeDetails, placeTypeId }) => {
  const addressComponents = getAddressComponents(placeDetails.address_components);
  await firebase.firestore().collection('places').doc(placeDetails.place_id).set({
    placeType: placeTypeId,
    attributes: {},
    addressComponents,
    formattedAddress: placeDetails.formatted_address || null,
    formattedPhoneNumber: placeDetails.formatted_phone_number || null,
    coordinates: {
      latitude: placeDetails.geometry.location.lat || null,
      longitude: placeDetails.geometry.location.lng || null
    },
    plusCode: placeDetails.plus_code || null,
    internationalPhoneNumber: placeDetails.international_phone_number || null,
    name: placeDetails.name || null,
    url: placeDetails.url || null
  });
};

const getAddressComponents = addressComponents => {
  const newAddressComponents = new Object();
  addressComponents.forEach(addressComponent => {
    newAddressComponents[addressComponent.types[0]] = addressComponent.long_name;
  });
  return newAddressComponents;
}

export default {
  getUuid4,
  getGeocodeLocation,
  getPlaceDetails,
  getTextSearchLocations,
  calculateDistance,
  getImageUri,
  getSuburbState,
  getFirestorePlace,
  createFirestorePlace
};