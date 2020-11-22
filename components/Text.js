import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'native-base';

export default props => {
  return (
    <Text
      {...props}
      style={{ ...styles.text, ...props.style }}
    >
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'DMSansRegular',
    fontSize: 16,
    textAlign: 'center'
  }
});