import React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Image } from '../../../../components/exports';
import { useSelector } from 'react-redux';
import { globalPlacesFunctions } from '../../../../global/exports';

export default props => {
  const { photo, IMAGE_WIDTH, IMAGE_HEIGHT } = props;

  return (
    <TouchableWithoutFeedback onPress={props.onPress} >
      <Image
        style={{
          width: IMAGE_WIDTH,
          height: IMAGE_HEIGHT,
          borderRadius: 10
        }}
        source={{ uri: photo.url }}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  image: {}
});