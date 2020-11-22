import React, { forwardRef, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Item, Input, Icon } from 'native-base';
import { globalColors } from '../global/exports';

export default forwardRef((props, ref) => {
  return (
    <Item
      style={{ ...styles.textInputContainer, ...props.containerStyle }}
      rounded
      onPress={props.onPress}
    >
      <Input
        style={{ ...styles.textInput, ...props.style }}
        ref={ref}
        placeholderTextColor={globalColors.inputPlaceholder}
        {...props}
      />
    </Item >
  );
});

const styles = StyleSheet.create({
  textInputContainer: {
    paddingHorizontal: 24,
    borderRadius: 100,
    borderColor: globalColors.green
  },
  textInput: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 16
  }
});