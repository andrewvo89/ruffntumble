import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'native-base';

export default props => {
  return (
    <View
      {...props}
      style={{ ...styles.container, ...props.style }}
    >
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});