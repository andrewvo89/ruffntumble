import React, { forwardRef, useState, useEffect, Fragment } from 'react';
import { StyleSheet, Modal } from 'react-native';
import { Item, Input, Icon } from 'native-base';
import { globalColors } from '../global/exports';
import SearchPickerModal from './SearchPickerModal';
import Container from './Container';

export default forwardRef((props, ref) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState();

  useEffect(() => {
    if (props.value) {
      setSelectedItem(
        props.data.find(item => {
          return item.value === props.value;
        })
      );
      setModalVisible(false);
    } else {//Handle when field gets set to null
      setSelectedItem(null);
    }
  }, [props.data, props.value]);

  return (
    <Fragment>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SearchPickerModal
          setModalVisible={setModalVisible}
          data={props.data}
          onChangeValue={props.onChangeValue}
        />
      </Modal>
      <Item
        style={{ ...styles.textInputContainer, ...props.containerStyle }}
        rounded
        onPress={() => setModalVisible(true)}
      >
        <Container
          style={styles.touchableViewContainer}
          pointerEvents="none"
        >
          <Input
            style={{ ...styles.textInput, ...props.style }}
            ref={ref}
            editable={false}
            {...props}
            value={selectedItem ? selectedItem.label : null}
            onPress={() => setModalVisible(true)}
          />
          <Icon
            name="right"
            type="AntDesign"
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