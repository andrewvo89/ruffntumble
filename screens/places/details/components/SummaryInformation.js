import React, { Fragment } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { globalColors, globalFonts, globalPlacesFunctions } from '../../../../global/exports';
import { Text } from '../../../../components/exports';
import { Ionicons } from '@expo/vector-icons';
import { Rating, AirbnbRating } from 'react-native-elements';

export default ({ placeDetails, placeTypeName }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.placeName}>{placeDetails.name}</Text>
      <View style={styles.suburbContainer}>
        <Text style={styles.location}>{`${globalPlacesFunctions.getSuburbState(placeDetails.address_components)}`}</Text>
      </View>
      <TouchableOpacity style={styles.ratingsContainer}>
        {placeDetails.rating
          ? (
            <Fragment>
              <Text style={styles.ratingAverage}>{` ${placeDetails.rating}`}</Text>
              <Ionicons style={styles.ratingIcon} name="md-star" size={20} color={globalColors.green} />
              <Text style={styles.ratingTotalCount}>{` (${placeDetails.user_ratings_total})`}</Text>
            </Fragment>
          )
          : (
            <Text style={styles.leaveRating}>{`Rate this ${placeTypeName}`}</Text>
          )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  placeName: {
    fontSize: 24,
    fontFamily: globalFonts.DMSansBold
  },
  placeAddress: {
    fontSize: 16,
    fontFamily: globalFonts.DMSansMedium
  },
  suburbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leaveRating: {
    fontSize: 16,
    fontFamily: globalFonts.DMSansRegular
  },
  ratingAverage: {
    fontFamily: globalFonts.DMSansBold,
    marginRight: 5
  },
  location: {
    fontFamily: globalFonts.DMSansMedium
  }
});