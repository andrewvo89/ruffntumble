import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { globalColors } from '../global/exports';

export default props => {
  return (
    <Avatar
      containerStyle={[styles.containerStyle, props.style]}
      rounded
      onPress={props.onPress}
      activeOpacity={0.6}
      size={props.size ? props.size : 'large'}
      icon={props.icon ? props.icon : {
        name: 'user',
        type: 'font-awesome',
        color: 'white'
      }}
      source={props.image ? {
        uri: props.image
      } : null}
    />
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: globalColors.grey
  }
});