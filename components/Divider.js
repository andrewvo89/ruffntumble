import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalColors } from '../global/exports';

export default props => {
  return (
    <View
      style={{
        borderBottomWidth: .5,
        borderBottomColor: globalColors.grey,
        margin: 10,
        width: '85%',
        ...props.style
      }}
    />
  );
};