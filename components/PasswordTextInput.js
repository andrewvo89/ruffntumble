import React, { forwardRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Item, Input, Icon } from 'native-base';
import { globalColors } from '../global/exports';

export default forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);
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
        secureTextEntry={!showPassword}
        {...props}
      />
      <TouchableOpacity
        style={styles.iconContainer}
        onPressIn={() => setShowPassword(true)}
        onPressOut={() => setShowPassword(false)}
      >
        <Icon
          style={styles.icon}
          name={showPassword ? "ios-eye-off" : "ios-eye"}
          type="Ionicons"
        />
      </TouchableOpacity>
    </Item >
  );
});

const styles = StyleSheet.create({
  textInputContainer: {
    paddingHorizontal: 24,
    paddingRight: 0,
    borderRadius: 100,
    borderColor: globalColors.green
  },
  textInput: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 16
  },
  iconContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 24//Increases the area in which the Touchable Opacity can be pressed
  },
  icon: {
    color: globalColors.black,
    fontSize: 24
  }
});