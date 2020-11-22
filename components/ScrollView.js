import React from 'react';
import { StyleSheet } from 'react-native';
import globalColors from '../global/colors';
import { ScrollView } from 'react-native-gesture-handler';

export default props => {
  return (
    <ScrollView
      style={{ ...styles.scrollView, ...props.style }}
      contentContainerStyle={
        props.keyboardAvoiding
          ? { ...styles.scrollViewContent, ...props.contentContainerStyle }
          : props.contentContainerStyle
      }
    >
      {props.children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: globalColors.screenBackground
  },
  scrollViewContent: {
    justifyContent: 'center',
    flex: 1
  },
});