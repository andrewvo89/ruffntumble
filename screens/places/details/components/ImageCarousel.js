import { Ionicons } from '@expo/vector-icons';
import React, { Fragment, useRef, useState } from 'react';
import { Dimensions, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Image, Text } from '../../../../components/exports';
import { globalColors, globalPlacesFunctions } from '../../../../global/exports';
import CarouselItem from './CarouselItem';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default props => {
  const IMAGE_WIDTH = Math.round(SCREEN_WIDTH);
  const IMAGE_HEIGHT = Math.round(IMAGE_WIDTH * 3 / 4);
  const carouselRef = useRef();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [activeItem, setActiveItem] = useState(0);
  let children = (
    <TouchableOpacity
      style={{
        ...styles.uploadImageContainer,
        height: IMAGE_HEIGHT
      }}
      activeOpacity={0.6}
    >
      <Ionicons name="md-images" size={50} color="black" />
      <Text>Upload an image?</Text>
    </TouchableOpacity>
  );

  if (props.photos) {
    const photos = props.photos.map(photo => {
      const url = globalPlacesFunctions.getImageUri({
        maxWidth: photo.width,
        photoReference: photo.photo_reference,
        googleMapsApiKey: props.googleMapsApiKey
      });
      return {
        width: photo.width,
        height: photo.height,
        url
      };
    });
    children = (
      <Fragment>
        <Modal
          visible={selectedImageIndex === null ? false : true}
          transparent={true}
          onRequestClose={() => setSelectedImageIndex(null)}
        >
          <ImageViewer
            imageUrls={[photos[selectedImageIndex]]}//Display only 1 image (the selected one)
            renderImage={props => {
              return (
                <Image
                  style={{ width: props.style.width, height: props.style.height }}
                  placeholderContainerStyle={styles.imageViewerPlaceholder}
                  source={{ uri: props.source.uri }}
                  activityIndicatorColor={globalColors.white}
                />
              );
            }}
            enableSwipeDown={true}
            onSwipeDown={() => setSelectedImageIndex(null)}
            renderIndicator={(_currentIndex, allSize) => {
              return (
                <SafeAreaView style={styles.hello}>
                  <Ionicons
                    onPress={() => setSelectedImageIndex(null)}
                    name="md-close"
                    size={36}
                    color={globalColors.lightGrey}
                  />
                </SafeAreaView>
              )
            }}
          />
        </Modal>
        <Carousel
          ref={carouselRef}
          layout={'default'}
          containerCustomStyle={styles.carouselContainerStyle}
          contentContainerStyle={styles.contentContainerStyle}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={IMAGE_WIDTH}
          data={photos}
          renderItem={item => (
            <CarouselItem
              photo={item.item}
              IMAGE_HEIGHT={IMAGE_HEIGHT}
              IMAGE_WIDTH={IMAGE_WIDTH}
              onPress={() => setSelectedImageIndex(item.index)}
            />
          )}
          onSnapToItem={setActiveItem}
        />
        <Pagination
          carouselRef={carouselRef}
          dotsLength={photos.length}
          activeDotIndex={activeItem}
          tappableDots={true}
          dotStyle={styles.paginationDotStyle}
          containerStyle={styles.paginationContainerStyle}
          animatedDuration={10}
          animatedFriction={3}
          animatedTension={10}
        />
      </Fragment>
    );
  }

  return (
    <View style={styles.imageCarouselContainer}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainerStyle: {
    flexGrow: 0
  },
  contentContainerStyle: {
    alignItems: 'center'
  },
  imageCarouselContainer: {
    marginBottom: 10,
    alignSelf: 'stretch'
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
  paginationContainerStyle: {
    paddingVertical: 10
  },
  paginationDotStyle: {
    backgroundColor: globalColors.green,
    width: 12,
    height: 12,
    borderRadius: 6
  },
  imageViewerPlaceholder: {
    backgroundColor: globalColors.black
  },
  hello: {
    position: 'absolute',
    left: SCREEN_WIDTH - 36,
    top: 5
  }
});