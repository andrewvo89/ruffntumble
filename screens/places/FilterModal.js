import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenContainer } from '../../components/exports';
import { globalColors } from '../../global/exports';

export default props => {
  const { setModalVisible, placeType } = props;
  return (
    <TouchableOpacity
      onPress={() => setModalVisible(false)}
    >
      {placeType.filters.map(filter => {
        return (
          <Text>{filter.name}</Text>
        )
      })}
      <Text>CLICK HERE TO CLOSE ME</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.transparent
  },
  closeModal: {
    fontSize: 30
  }
});