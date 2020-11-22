import React, { Fragment, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { globalColors } from '../../../../global/exports';
import { Text } from '../../../../components/exports';
import { Ionicons } from '@expo/vector-icons';
import ReviewItem from './ReviewItem';

export default ({ reviews }) => {
  const carouselRef = useRef();
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const IMAGE_WIDTH = Math.round(SCREEN_WIDTH * .8);
  const IMAGE_HEIGHT = Math.round(IMAGE_WIDTH * 3 / 4);

  return (
    <View style={styles.container}>
      {reviews
        ? (
          <Fragment>
            <Carousel
              ref={carouselRef}
              layout={'default'}
              loop={true}
              containerCustomStyle={styles.carouselContainerStyle}
              contentContainerStyle={styles.contentContainerStyle}
              slideStyle={{
                // borderColor: 'red',
                // borderWidth: 1,
                // borderRadius: 10
              }}
              inactiveSlideOpacity={1}
              sliderWidth={SCREEN_WIDTH}
              itemWidth={IMAGE_WIDTH}
              data={reviews}
              renderItem={item => <ReviewItem review={item.item} />}
            />
          </Fragment>
        )
        : (
          <TouchableOpacity
            style={{
              ...styles.uploadImageContainer,
              height: IMAGE_HEIGHT
            }}
            activeOpacity={0.6}
          >
            <Ionicons name="md-star" size={50} color="black" />
            <Text>Leave a review?</Text>
          </TouchableOpacity>
        )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignSelf: 'stretch'
  },
  carouselContainerStyle: {
    flexGrow: 0
  },
  contentContainerStyle: {
    alignItems: 'center'
  },
  uploadImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderColor: globalColors.darkGrey,
    backgroundColor: globalColors.white,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10
  },
});