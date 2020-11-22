import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Button, Icon, Text } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { globalColors } from '../global/exports';

export default props => {
  const [active, setActive] = useState(false);
  let buttonStyle = {
    height: props.size,
    width: props.size,
    borderRadius: props.size / 2,
    ...styles.buttonStyle
  }
  if (active) {
    buttonStyle = {
      ...buttonStyle,
      ...styles.buttonStyleActive
    }
  }

  return (
    <TouchableOpacity
      style={{ ...buttonStyle, ...props.style }}
      activeOpacity={1}
      onPressIn={() => setActive(true)}
      onPressOut={() => setActive(false)}
      onPress={props.onPress}
    >
      <MaterialIcons
        name="gps-fixed"
        size={props.size / 2}
        color={globalColors.darkGrey}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonStyleActive: {
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15
  }
});