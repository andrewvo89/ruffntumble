import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { Item, Input, Icon, Badge } from 'native-base';
import { globalColors, globalStyles, globalFonts } from '../global/exports';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Text from './Text';

export default forwardRef((props, ref) => {
  const MAX_SELECTIONS = props.maxSelections;
  const [tempSelectedItems, setTempSelectedItems] = useState();
  const items = [{
    label: 'Parent',
    value: 0,
    children: props.data
  }];

  const stickyFooterComponent = (
    <View style={styles.footerContainer}>
      {props.selectedItems.length > 0 ? (
        <View style={styles.selectedItemsContainer}>
          {props.selectedItems.map(selectedItem => {
            const selectedItemData = props.data.find(item => item.value === selectedItem);
            return (
              <Badge
                key={selectedItem}
                style={styles.badge}
              >
                <View style={styles.badgeInnerContainer}>
                  <Text style={styles.badgeText}>{selectedItemData.label}</Text>
                  <Icon style={styles.badgeIcon}
                    type="AntDesign"
                    name="close"
                    onPress={() => {
                      props.onSelectedItemsChange(
                        props.selectedItems.filter(propsSelectedItem => {
                          return propsSelectedItem != selectedItem;
                        })
                      )
                    }}
                  />
                </View>
              </Badge>
            );
          })}
        </View>
      ) : null}
      <View style={styles.footerButtonsContainer}>
        <TouchableOpacity
          style={{ ...styles.footerButton, borderRightWidth: .5 }}
          onPress={() => {
            props.onSelectedItemsChange(tempSelectedItems);
            ref.current._toggleSelector();
          }}
        >
          <Text style={{ ...styles.buttonText, ...props.buttonText }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={props.selectedItems.length === 0}
          style={props.selectedItems.length > 0
            ? { ...styles.footerButton, borderRightWidth: .5 }
            : { ...styles.footerButton, ...styles.footerButtonDisabled, borderRightWidth: .5 }
          }
          onPress={() => {
            ref.current._toggleSelector();
          }}
        >
          <Text style={{ ...styles.buttonText, ...props.buttonText }}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ ...styles.container, ...props.containerStyle }}>
      <SectionedMultiSelect
        ref={ref}
        styles={{
          chipsWrapper: { ...styles.chipsWrapper, ...props.chipsWrapper },
          chipText: { ...styles.chipText, ...props.chipText },
          selectToggle: { ...styles.selectToggle, ...props.selectToggle },
          selectToggleText: props.selectedItems.length === 0
            ? { ...styles.selectToggleText, ...props.selectToggleText }
            : { ...styles.selectToggleText, ...styles.selectToggleTextActive, ...props.selectToggleText },
          item: { ...styles.item, ...props.item },
          subItemText: { ...styles.subItemText, ...props.subItemText },
          itemText: { ...styles.itemText, ...props.itemText },
          searchTextInput: { ...styles.searchTextInput, ...props.searchTextInput },
          confirmText: { ...styles.confirmText, ...props.confirmText },
          button: { ...styles.button, ...props.button },
          searchBar: { ...styles.searchBar, ...props.searchBar }
        }}
        items={items}
        uniqueKey="value"
        subKey="children"
        displayKey="label"
        selectText={props.selectText ? props.selectText : 'Select...'}
        searchPlaceholderText={props.searchPlaceholderText ? props.searchPlaceholderText : 'Search...'}
        renderSelectText={renderProps => {
          if (props.selectedItems.length === 0) {
            return renderProps.selectText
          }
          return props.selectedItems.map(selectedItem => {
            return props.data.find(dataItem => {
              return dataItem.value === selectedItem;
            }).label
          }).join(', ')
        }}
        showDropDowns={false}
        showChips={false}
        showCancelButton={false}
        readOnlyHeadings={true}
        modalAnimationType="slide"
        modalWithSafeAreaView={true}
        onToggleSelector={modalOpen => {
          if (modalOpen === true) {//Make a copy when opening Modal, to revert back incase they cancel, and not confirm
            setTempSelectedItems(props.selectedItems);
          };
        }}
        onSelectedItemsChange={newSelectedItems => {
          if (MAX_SELECTIONS) {//Set maximum selection
            if (newSelectedItems.length <= MAX_SELECTIONS) {
              props.onSelectedItemsChange(newSelectedItems);
            } else {
              Alert.alert(null,
                props.maxSelectionsError,
                [{
                  text: 'OK',
                  style: 'cancel'
                }]
              )
            }
          }
        }}
        selectedItems={props.selectedItems}
        hideConfirm={true}
        stickyFooterComponent={stickyFooterComponent}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  chipsWrapper: {
    marginTop: 10
  },
  chipText: {
    fontFamily: globalFonts.DMSansRegular,
    fontSize: 13
  },
  selectToggle: {
    borderColor: globalColors.green,
    borderWidth: 0.5,
    borderRadius: 100,
    paddingHorizontal: 30,
    paddingVertical: 12
  },
  selectToggleText: {
    fontSize: 16,
    fontFamily: globalFonts.DMSansRegular,
    color: globalColors.inputPlaceholder
  },
  selectToggleTextActive: {
    color: globalColors.black
  },
  item: {
    display: 'none'
  },
  itemText: {
    fontSize: 0
  },
  subItemText: {
    fontSize: 20,
    fontFamily: globalFonts.DMSansRegular,
    color: globalColors.black
  },
  searchBar: {
    backgroundColor: globalColors.lightGrey
  },
  searchTextInput: {
    fontSize: 16,
    fontFamily: globalFonts.DMSansRegular
  },
  confirmText: {
    fontSize: 16,
    fontFamily: globalFonts.DMSansMedium
  },
  button: {
    backgroundColor: globalColors.primary
  },
  footerContainer: {
    // borderWidth: 2,
    // borderColor: 'red',
    backgroundColor: globalColors.lightGrey,
    justifyContent: 'flex-end'
  },
  selectedItemsContainer: {
    // borderWidth: 2,
    // borderColor: 'blue',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  badge: {
    backgroundColor: globalColors.white,
    borderColor: globalColors.black,
    borderWidth: .5,
    marginVertical: 2.5,
    marginHorizontal: 2.5
  },
  badgeInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  badgeText: {
    fontFamily: globalFonts.DMSansRegular,
    fontSize: 13,
    color: globalColors.black
  },
  badgeIcon: {
    fontSize: 13
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  footerButton: {
    width: '50%',
    paddingVertical: 10,
    borderColor: globalColors.white,
    backgroundColor: globalColors.primary
  },
  footerButtonDisabled: {
    backgroundColor: globalColors.grey
  },
  buttonText: {
    color: globalColors.white,
    fontFamily: globalFonts.DMSansRegular,
    fontSize: 16
  }
});