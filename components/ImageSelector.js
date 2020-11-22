import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default props => {
  const [imageSelector, setImageSelector] = useState();
  const CAMERA = 'CAMERA';
  const GALLERY = 'GALLERY';

  useEffect(() => {
    if (props.initializeHandler) {
      Alert.alert('Image Selector', 'Where do we find your picture?', [
        {
          text: 'Camera',
          onPress: () => setImageSelector(CAMERA)
        },
        {
          text: 'Gallery',
          onPress: () => setImageSelector(GALLERY)
        }
      ], {
        cancelable: true
      });
    }
  }, [props.initializeHandler]);

  useEffect(() => {
    const verifyPermissions = async () => {
      const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
      if (result.status !== 'granted') {
        Alert.alert(
          'Insufficient permission!',
          'You need to grant permissions to use this app.',
          [{ text: 'Okay' }]
        );
        return false;
      }
      return true;
    };

    const selectImage = async selection => {
      let image;
      const imageOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: props.allowsEditing ? props.allowsEditing : true,
        aspect: props.aspect ? props.aspect : [1, 1]
      };
      const hasPermission = await verifyPermissions();
      if (!hasPermission) {
        return;
      }
      switch (selection) {
        case CAMERA:
          image = await ImagePicker.launchCameraAsync(imageOptions);
          break;
        case GALLERY:
          image = await ImagePicker.launchImageLibraryAsync(imageOptions);
          break;
        default:
          image = { cancelled: true };
      }
      if (!image.cancelled) {
        props.setPickedImage(image.uri);
      }
    };

    if (imageSelector) {
      selectImage(imageSelector);
      setImageSelector(null);
    }
  }, [imageSelector]);

  return null;
}