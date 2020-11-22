import React from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { Image } from 'react-native-elements';
import { globalColors } from '../global/exports';

export default props => {
  return (
    <Image
      style={{ ...styles.image, ...props.style }}
      containerStyle={{ ...styles.container, ...props.containerStyle }}
      PlaceholderContent={(
        <View style={{ ...styles.view, ...props.placeholderContainerStyle }}>
          <ActivityIndicator size="large" color={props.activityIndicatorColor || globalColors.primary} />
        </View>
      )}
      transition={true}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
  },
  image: {
  },
  view: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: globalColors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center'
  }
});