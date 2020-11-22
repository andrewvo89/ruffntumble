import React, { forwardRef, useState, useEffect, Fragment } from 'react';
import { StyleSheet } from 'react-native';
import { Item, Input, Icon } from 'native-base';
import { globalColors } from '../global/exports';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Container from './Container';

export default forwardRef((props, ref) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  //Set local state first for the DateTimePicker component
  const confirmHandler = newSelectedDate => {
    setDatePickerVisible(false);
    props.onChangeValue(newSelectedDate);
  };

  return (
    <Fragment>
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        display="default"
        onConfirm={confirmHandler}
        onCancel={() => setDatePickerVisible(false)}
      />
      <Item
        style={{ ...styles.textInputContainer, ...props.containerStyle }}
        rounded
        onPress={() => setDatePickerVisible(true)}
      >
        <Container
          style={styles.touchableViewContainer}
          pointerEvents="none"
        >

          <Input
            style={{ ...styles.textInput, ...props.style }}
            ref={ref}
            disabled={true}
            placeholderTextColor={globalColors.inputPlaceholder}
            {...props}
            value={props.value ? moment(props.value).format('LL') : null}
          />
          <Icon
            name="calendar"
            type="FontAwesome"
            color="black"
          />
        </Container>
      </Item>
    </Fragment>
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
    fontSize: 16
  },
  touchableViewContainer: {
    flex: 1,
    flexDirection: 'row'
  }
});