import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { globalColors } from '../global/exports';

export default props => {
  return (
    <View style={{ ...styles.buttonContainer, ...props.containerStyle }}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={props.onPress}
        disabled={props.disabled}
      >
        <View style={[styles.button, props.style, props.disabled ? styles.buttonDisabled : {}]}>
          {props.children}
        </View>
      </TouchableOpacity>
    </View >
  )
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 100,
    overflow: 'hidden'
  },
  button: {
    backgroundColor: globalColors.green,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    alignItems: 'center'
  },
  buttonDisabled: {
    backgroundColor: globalColors.disabledBackground
  }
});