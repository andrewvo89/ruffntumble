import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Item, Input, Icon } from 'native-base';
import { globalColors } from '../global/exports';
import ScreenContainer from './ScreenContainer';
import Container from './Container';
import Text from './Text';

export default props => {
  const searchInputRef = useRef();
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState();

  useEffect(() => {
    const newFilteredData = props.data.filter(item => {
      return item.label
        .toLowerCase()
        .trim()
        .includes(searchValue.toLowerCase().trim())
    });
    setFilteredData(newFilteredData);
  }, [searchValue, props.data]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.itemContainer}
        onPress={() => props.onChangeValue(item.value)}
      >
        <Text>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer style={styles.screenContainer}>
      <Item
        style={{ ...styles.textInputContainer, ...props.containerStyle }}
        rounded
        onPress={props.onPress}
      >
        <Icon
          style={{ color: globalColors.green }}
          name="left"
          type="AntDesign"
          onPress={() => props.setModalVisible(false)}
        />
        <Input
          ref={searchInputRef}
          style={{ ...styles.textInput, ...props.style }}
          value={searchValue}
          onChangeText={setSearchValue}
          {...props}
        />
        <Icon
          style={{ color: globalColors.green }}
          name="search1"
          type="AntDesign"
          onPress={() => searchInputRef.current._root.focus()}
        />
      </Item >
      <Container style={styles.flatListContainer}>
        <FlatList
          keyExtractor={item => item.value}
          data={filteredData}
          renderItem={renderItem}
        />
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 80,
    paddingHorizontal: 10
  },
  textInputContainer: {
    paddingHorizontal: 16,
    borderRadius: 100,
    width: '100%',
    borderColor: globalColors.green,
    marginBottom: 10
  },
  textInput: {
    paddingHorizontal: 0,
    fontSize: 16
  },
  flatListContainer: {
    width: '100%',
    alignItems: 'stretch'
  },
  itemContainer: {
    borderColor: '#EEEEEE',
    borderWidth: 1,
    alignItems: 'flex-start',
    padding: 16
  }
});