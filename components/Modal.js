import React, { useEffect } from 'react';
import { Modal, SafeAreaView, StyleSheet, StatusBar, TouchableWithoutFeedback, View } from 'react-native';
import { globalColors } from '../global/exports';

export default props => {
  const { modalVisible, setModalVisible } = props;
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      onBackdropPress={() => setModalVisible(false)}
    >
      <StatusBar
        hidden={true}
      />
      <TouchableWithoutFeedback
        onPress={() => setModalVisible(false)}
      >
        <SafeAreaView style={{ ...styles.backdrop, ...props.backdropStyle }}>
          <View style={{ ...styles.container, ...props.containerStyle }}>
            {props.children}
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  container: {
    width: '95%',
    height: '95%',
    borderRadius: 20,
    backgroundColor: globalColors.white,
    alignItems: 'center',
    justifyContent: 'center'
  }
});