import React, { forwardRef, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Item, Input, Icon } from 'native-base';
import { globalColors } from '../global/exports';

export default forwardRef((props, ref) => {
  let iconName = "check";
  if (props.error) {
    iconName = "x"
  }
  return (
    <Item
      style={(props.showBorder && props.error)
        ? { ...styles.textInputContainer, ...props.containerStyle, borderColor: globalColors.red }
        : { ...styles.textInputContainer, ...props.containerStyle }
      }
      rounded
      onPress={props.onPress}
    >
      <Input
        style={{ ...styles.textInput, ...props.style }}
        ref={ref}
        placeholderTextColor={globalColors.inputPlaceholder}
        {...props}
      />
      {(props.showIcon && props.touched) && (
        <Icon
          style={{ color: props.error ? globalColors.red : globalColors.green }}
          name={iconName}
          type="Feather"
        />
      )}
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