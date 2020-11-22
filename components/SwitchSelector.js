import React, { useState, useEffect } from 'react';
import SwitchSelector from 'react-native-switch-selector';
import { StyleSheet } from 'react-native';
import { globalColors } from '../global/exports';
import Container from './Container';

export default props => {
  return (
    <Container style={{ ...styles.switchSelectorContainer, ...props.containerStyle }}>
      <SwitchSelector
        style={styles.container}
        fontSize={16}
        borderRadius={100}
        buttonColor={globalColors.green}
        backgroundColor={globalColors.screenBackground}
        initial={props.value}
        selectedTextContainerStyle={styles.textContainer}
        textContainerStyle={styles.textContainer}
        textColor={globalColors.black}
        selectedColor={globalColors.white}
        {...props}
        onPress={props.onChangeValue}
        value={props.value}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    borderRadius: 100
  },
  container: {
    borderWidth: 0.5,
    borderColor: globalColors.green,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 100
  }
});