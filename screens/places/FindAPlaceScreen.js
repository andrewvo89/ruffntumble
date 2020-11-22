import React, { useEffect, useState, Fragment, useRef } from 'react';
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, Alert, Dimensions, ActivityIndicator, View, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { ScreenContainer, Text, GpsButton } from '../../components/exports';
import { globalColors, globalFonts, globalPlacesFunctions } from '../../global/exports';
import * as placesActions from '../../store/placesActions';
import SearchContainer from './SearchContainer';
import placeTypes from '../../database/local/placeTypes';

export default props => {
  const CURRENT_POSITION_TIMEOUT = 10000;
  const INITIAL_DELTA_DISTANCE = 1;
  const ONE_KM_DELTA = 0.009009009009009;
  const mapViewRef = useRef();
  const [triggerBlur, setTriggerBlur] = useState(false);
  const [error, setError] = useState();
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [fetchingUserLocation, setFetchingUserLocation] = useState(true);
  const [userLocation, setUserLocation] = useState();
  const [mapViewRegion, setMapViewRegion] = useState();
  const [fetchingMarkers, setFetchingMarkers] = useState(false);
  const [placeDetails, setPlaceDetails] = useState();
  const [selectedPlaceType, setSelectedPlaceType] = useState();
  const [deltaDistance, setDeltaDistance] = useState(INITIAL_DELTA_DISTANCE);//Default to 1km
  const [markers, setMarkers] = useState([]);
  const googleMapsApiKey = useSelector(state => state.placesState.googleMapsApiKey);
  const loading = !gpsEnabled || fetchingUserLocation || fetchingMarkers;
  const dispatch = useDispatch();
  //Check for GPS Signal
  useEffect(() => {
    const gpsCheckTimer = setInterval(async () => {
      const newGpsEnabled = await Location.hasServicesEnabledAsync();
      if (newGpsEnabled) {
        setGpsEnabled(true);
        clearInterval(gpsCheckTimer);
      }
    }, 2000);
  }, []);
  //Check for Google Maps Api Key
  useEffect(() => {
    if (!googleMapsApiKey) {
      const getGoogleMapsApiKey = async () => {
        await dispatch(placesActions.getGoogleMapsApiKey());
      };

      try {
        getGoogleMapsApiKey();
      } catch (error) {
        setError(error);
      }
    }
  }, [googleMapsApiKey]);
  //Once get API Key, get user location for Autocomplete Search
  useEffect(() => {
    if (gpsEnabled && googleMapsApiKey) {
      const getUserLocation = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
          throw new Error('You need to grant location permissions to use this app.');
        }//Get current co-ordinates from the phone's GPS signal
        const currentPosition = await Location.getCurrentPositionAsync({
          timeout: CURRENT_POSITION_TIMEOUT
        });//Perform reverse geocode search in order to get ahold of a place_id
        const geocodeLocation = await globalPlacesFunctions.getGeocodeLocation({
          googleMapsApiKey,
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude
        });//Use the place_id to get Place Details
        const newPlaceDetails = await globalPlacesFunctions.getPlaceDetails({
          googleMapsApiKey,
          placeId: geocodeLocation.place_id
        });//Store place details into user location for "Nearby" search and the UserLocation button on bottom right for Android
        setUserLocation(newPlaceDetails);
        setPlaceDetails(newPlaceDetails);
      };

      try {
        getUserLocation();
      } catch (error) {
        setError(error);
      }
    }
  }, [googleMapsApiKey, gpsEnabled]);
  //Once you have location details, set lat, lng for MapView region
  useEffect(() => {
    if (placeDetails) {
      setMapViewRegion({
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
        latitudeDelta: ONE_KM_DELTA * deltaDistance,
        longitudeDelta: ONE_KM_DELTA * deltaDistance
      });
    }
  }, [placeDetails, deltaDistance]);
  //If either of the search fields change (check dependencies), query google maps for new results
  useEffect(() => {
    const getMarkers = async () => {
      setFetchingMarkers(true);
      const newMarkers = await globalPlacesFunctions.getTextSearchLocations({
        googleMapsApiKey,
        placeTypes,
        selectedPlaceType,
        placeDetails,
        maxResults: 20
      });
      const shortestDistance = newMarkers.reduce((previousValue, currentValue) => {
        const currentDistance = globalPlacesFunctions.calculateDistance({
          latitudeA: placeDetails.geometry.location.lat,
          longitudeA: placeDetails.geometry.location.lng,
          latitudeB: currentValue.geometry.location.lat,
          longitudeB: currentValue.geometry.location.lng
        });
        return currentDistance < previousValue ? currentDistance : previousValue;
      }, Number.MAX_VALUE);
      let newDeltaDistance = 1;//Defaul radius of 1km if nearest marker is near
      if (shortestDistance > 1 && shortestDistance <= 10) {//Set delta distance to closest marker + 3km
        newDeltaDistance = shortestDistance + 10;
      } else if (shortestDistance > 10) {
        newDeltaDistance = shortestDistance + 20;
      }
      setDeltaDistance(newDeltaDistance);
      setMarkers(newMarkers);
      setFetchingMarkers(false);
    }
    //If both search conditions are valid, add markers
    if (selectedPlaceType && placeDetails) {
      getMarkers();
    }
  }, [selectedPlaceType, placeDetails]);
  //Only set loading false after all thes below has been loaded
  useEffect(() => {
    if (mapViewRegion) {
      setFetchingUserLocation(false);
    }
  }, [mapViewRegion]);

  if (error) {
    Alert.alert(
      'Location error',
      error.message,
      [{
        text: 'OK',
        onPress: () => {
          setError(null);
        }
      }]
    );
  }

  let children = null;
  if (!gpsEnabled) {
    children = (
      <Fragment>
        <ActivityIndicator
          size="large"
          color={globalColors.green}
        />
        <Text>Waiting for GPS to be enabled...</Text>
      </Fragment>
    );
  } else if (fetchingUserLocation) {
    children = (
      <Fragment>
        <ActivityIndicator
          size="large"
          color={globalColors.green}
        />
        <Text>Finding your location...</Text>
      </Fragment>
    );
  } else {
    children = (
      <Fragment>
        <MapView
          ref={mapViewRef}
          style={fetchingMarkers ? styles.mapStyleInactive : styles.mapStyle}
          provider={MapView.PROVIDER_GOOGLE}
          region={mapViewRegion}
          showsUserLocation={true}
          showsCompass={true}
          showsScale={true}
          showsMyLocationButton={Platform.OS === 'android' ? false : true}
          onPress={() => setTriggerBlur(true)}
        >
          {markers.map((marker, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.geometry.location.lat,
                  longitude: marker.geometry.location.lng
                }}
                showsCompass={true}
                showsMyLocationButton={true}
                onPress={() => props.navigation.navigate('details', {
                  placeId: marker.place_id,
                  googleMapsApiKey,
                  name: marker.name,
                  placeType: JSON.stringify(placeTypes.find(placeType => placeType.id === selectedPlaceType))
                })}
              />
            )
          })}
        </MapView>
        <SearchContainer
          googleMapsApiKey={googleMapsApiKey}
          userLocation={userLocation}
          setPlaceDetails={setPlaceDetails}
          selectedPlaceType={selectedPlaceType}
          setSelectedPlaceType={setSelectedPlaceType}
          placeTypes={placeTypes}
          fetchingMarkers={fetchingMarkers}
          triggerBlur={triggerBlur}
          setTriggerBlur={setTriggerBlur}
        />
        {Platform.OS === 'android' ? (
          <GpsButton
            style={styles.gpsButton}
            size={50}
            onPress={() => mapViewRef.current.animateToRegion({
              latitude: userLocation.geometry.location.lat,
              longitude: userLocation.geometry.location.lng,
              latitudeDelta: ONE_KM_DELTA * INITIAL_DELTA_DISTANCE,
              longitudeDelta: ONE_KM_DELTA * INITIAL_DELTA_DISTANCE
            }, 1000)}
          />
        ) : null}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ScreenContainer style={fetchingUserLocation ? styles.containerLoading : styles.container}>
        {children}
      </ScreenContainer>
      {fetchingMarkers ? (
        <ScreenContainer style={styles.overlay}>
          <ActivityIndicator
            size="large"
            color={globalColors.green}
          />
          <Text style={styles.fetchingMarkersText}>
            {`Finding ${placeTypes.find(placeType => placeType.id === selectedPlaceType).pluralName}...`}
          </Text>
        </ScreenContainer>
      ) : null}
    </Fragment>
  );
}

export const screenOptions = {
  headerShown: false
};

const TAB_CONTAINER_HEIGHT = 124;
const GPS_BUTTON_PADDING = 10;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  },
  containerLoading: {
    justifyContent: 'center'
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1
  },
  mapStyleInactive: {
    ...StyleSheet.absoluteFillObject,
    opacity: .5
  },
  gpsButton: {
    alignSelf: 'flex-end',
    marginTop: Dimensions.get('window').height - (TAB_CONTAINER_HEIGHT + GPS_BUTTON_PADDING),
    marginRight: GPS_BUTTON_PADDING,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
    backgroundColor: globalColors.transparent
  },
  fetchingMarkersText: {
    fontSize: 16,
    fontFamily: globalFonts.DMSansMedium,
    color: globalColors.green
  }
});