import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import globalColors from '../global/colors';

export default props => {
  if (Platform.OS === 'android') {
    return props.children;
  }
  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior="padding"
      keyboardVerticalOffset={props.keyboardVerticalOffset}
    >
      {props.children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: globalColors.screenBackground
  },
});