import React, { useEffect, useState, Fragment } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { ScreenContainer, Text, Divider, } from '../../../components/exports';
import ImageCarousel from './components/ImageCarousel';
import SummaryInformation from './components/SummaryInformation';
import { globalColors, globalPlacesFunctions } from '../../../global/exports';
import Reviews from './components/Reviews';


export default props => {
  const [fetching, setFetching] = useState(true);
  const [placeDetails, setPlaceDetails] = useState();
  const [firestorePlace, setFirestorePlace] = useState();
  const { placeId, googleMapsApiKey } = props.route.params;
  const placeType = JSON.parse(props.route.params.placeType);

  useEffect(() => {
    const getPlaceDetails = async () => {
      const newPlaceDetails = await globalPlacesFunctions.getPlaceDetails({ googleMapsApiKey, placeId });
      let newFirestorePlace = await globalPlacesFunctions.getFirestorePlace(placeId);
      // console.log('==================================================================');
      // console.log(newPlaceDetails);
      // console.log(newPlaceDetails.address_components.map(com => {
      //   return {
      //     type: com.types[0],
      //     name: com.long_name
      //   }
      // }));
      if (!newFirestorePlace) {
        await globalPlacesFunctions.createFirestorePlace({
          placeDetails: newPlaceDetails,
          placeTypeId: placeType.id
        });
        newFirestorePlace = await globalPlacesFunctions.getFirestorePlace(placeId);
      }
      setFirestorePlace(newFirestorePlace);
      setPlaceDetails(newPlaceDetails);
    };

    getPlaceDetails();
  }, [googleMapsApiKey, placeId]);

  useEffect(() => {
    if (placeDetails && firestorePlace) {
      setFetching(false);
    }
  }, [placeDetails, firestorePlace]);
  if (fetching) {
    return (
      <ScreenContainer>
        <ActivityIndicator
          size="large"
          color={globalColors.green}
        />
        <Text>Loading...</Text>
      </ScreenContainer>
    )
  }
  return (
    <ScrollView>
      <ScreenContainer style={styles.container}>
        <ImageCarousel
          googleMapsApiKey={googleMapsApiKey}
          photos={placeDetails.photos}
        />
        <Divider />
        <SummaryInformation
          placeDetails={placeDetails}
          placeTypeName={placeType.name}
        />
        <Divider />
        <Reviews
          reviews={placeDetails.reviews}
        />
      </ScreenContainer>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  },
  containerFetching: {
    justifyContent: 'center'
  }
});

export const screenOptions = ({ route }) => {
  return {
    headerTitle: route.params.name,
    headerBackTitle: 'Back'
  };
};