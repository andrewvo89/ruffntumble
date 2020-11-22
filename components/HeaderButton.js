import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { globalColors } from '../global/exports';

export default props => {
  return (
    <View style={{ ...styles.buttonContainer, ...props.containerStyle }}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={props.onPress}
      >
        <View style={{ ...styles.button, ...props.style }}>
          {props.children}
        </View>
      </TouchableOpacity>
    </View >
  )
};

const styles = StyleSheet.create({
  buttonContainer: {

  },
  button: {
    alignItems: 'center'
  }
});