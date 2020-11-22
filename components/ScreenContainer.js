import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalColors from '../global/colors';

export default props => {
  return (
    <SafeAreaView style={{ ...styles.container, ...props.style }}>
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: globalColors.screenBackground,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});