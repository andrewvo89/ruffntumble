import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import { globalColors } from '../global/exports';

export default props => {
  return (
    <TouchableOpacity
      // activeOpacity={0.6}
      onPress={props.onPress}
    >
      <Text
        style={{ ...styles.text, ...props.style }}
      >
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'DMSansRegular',
    fontSize: 16,
    textAlign: 'center'
  }
});