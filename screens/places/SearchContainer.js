import React, { useState, Fragment, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { globalColors, globalFonts, globalPlacesFunctions } from '../../global/exports';
import { PickerSelect, Modal, Button, Text } from '../../components/exports';
import { Octicons } from '@expo/vector-icons';
import FilterModal from './FilterModal';
import { Ionicons } from '@expo/vector-icons';

export default props => {
  const initialAddressText = 'Near me';
  const placesSearchInput = useRef();
  const [uuid4, setUuid4] = useState(globalPlacesFunctions.getUuid4());
  const [selectedItem, setSelectedItem] = useState();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedAddressText, setSelectedAddressText] = useState();
  const [placeSearchInputFocused, setPlaceSearchInputFocused] = useState();
  //Set initial text to user's location
  useEffect(() => {//Set initial text in the ref and also state for later use
    placesSearchInput.current.setAddressText(initialAddressText);
    setSelectedAddressText(initialAddressText);
  }, []);
  //Everytime someone presses on google map, close search container
  useEffect(() => {
    if (props.triggerBlur) {//Set text back to last search result
      placesSearchInput.current.setAddressText(selectedAddressText);
      placesSearchInput.current.triggerBlur();//trigger blur to exit ListView
      setPlaceSearchInputFocused(false);//Set focus state off
      props.setTriggerBlur(false);//Reset toggle back
    }
  }, [props.triggerBlur]);
  //Render clear text button for Android devices only. iOS has own button
  const renderRightButton = () => {
    const hideButtonConditions = !placesSearchInput.current//On initial render, ref not set yet
      || !placeSearchInputFocused//If not focused
      || placesSearchInput.current.getAddressText().length === 0//If no text inside
      || Platform.OS === 'ios';//If ios, ios has its own button
    if (hideButtonConditions) {
      return null;
    }
    return (
      <Ionicons
        style={styles.androidCloseIcon}
        onPress={() => {//Clear text
          placesSearchInput.current.setAddressText('');
          placesSearchInput.current.triggerFocus();//Trigger focus to keep typing
        }}
        name="md-close-circle"
        size={20}
        color={globalColors.grey}
      />
    );
  };

  return (
    <Fragment>
      <GooglePlacesAutocomplete
        ref={placesSearchInput}
        placeholder={'Search location'}
        placeholderTextColor={globalColors.inputPlaceholder}
        onPress={(data, details = null) => {
          props.setPlaceDetails(details);//Set place_id to get geolocation for markers search
          setSelectedAddressText(data.description);//Preserve search text
          setPlaceSearchInputFocused(false);//Set focus state off
          setUuid4(globalPlacesFunctions.getUuid4());//Create a new session token after autocomplete + details call has been made
          // console.log(placesSearchInput.current._requests[0]._url); // Useful for seeing the last URL request sent to Google maps api
        }}
        fetchDetails={true}
        GooglePlacesDetailsQuery={{
          sessiontoken: uuid4
        }}
        predefinedPlacesAlwaysVisible={true}
        predefinedPlaces={[{
          description: initialAddressText,
          geometry: props.userLocation.geometry,
          place_id: props.userLocation.place_id
        }]}
        query={{
          key: props.googleMapsApiKey,
          language: 'en',
          sessiontoken: uuid4,
          location: `${props.userLocation.geometry.location.lat},${props.userLocation.geometry.location.lng}`,
          radius: 50000//Bias the results to current user location, 50kms
        }}
        textInputProps={{
          underlineColorAndroid: globalColors.transparent,
          autoCorrect: false,
          onFocus: () => setPlaceSearchInputFocused(true),
          onBlur: () => setPlaceSearchInputFocused(false)
        }}
        styles={{
          container: styles.autoCompleteContainer,
          description: styles.autoCompleteSuggestions,
          textInputContainer: styles.autoCompleteTextInputContainer,
          textInput: styles.autoCompleteTextInput,
          listView: styles.autoCompelteListView,
          separator: styles.autoCompleteSeparator,
          predefinedPlacesDescription: styles.autoCompletePredefinedPlacesDescription,
          row: styles.autoCompleteRow
        }}
        enablePoweredByContainer={false}
        isRowScrollable={false}
        renderRightButton={renderRightButton}
        onOpen={() => setPlaceSearchInputFocused(true)}
      />
      <View style={styles.pickerSelectContainer}>
        <PickerSelect
          value={Platform.OS === 'ios' ? selectedItem : props.selectedPlaceType}
          onValueChange={value => {
            if (Platform.OS === 'ios') {//IOS sets on scroll, so just change local state, use onDonePress to set the prop state
              setSelectedItem(value);
            } else {//Android sets on confirm
              props.setSelectedPlaceType(value);
            }
          }}
          onClose={() => props.setSelectedPlaceType(selectedItem)}
          onDonePress={() => props.setSelectedPlaceType(selectedItem)}
          useNativeAndroidPickerStyle={false}
          placeholder={{
            label: "Select a dog related location",
            value: null
          }}
          items={props.placeTypes.map(placeType => {
            return {
              key: placeType.id,
              label: placeType.name,
              value: placeType.id
            };
          })}
          style={{
            inputIOS: { ...styles.pickerSelectInput, ...styles.pickerSelectInputIos },
            inputAndroid: { ...styles.pickerSelectInput, ...styles.pickerSelectInputAndroid },
            placeholder: styles.pickerPlaceholder,
            chevronContainer: styles.chevronContainer,
            modalViewMiddle: styles.modalViewMiddle,
            modalViewBottom: styles.modalViewBottom
          }}
        />
        {props.selectedPlaceType && props.placeTypes.find(placeType => placeType.id === props.selectedPlaceType).filters ? (
          <TouchableOpacity
            style={styles.filterIcon}
            activeOpacity={0.6}
            onPress={() => setFilterModalVisible(true)}
          >
            <Octicons name="settings" size={20} color={globalColors.darkGrey} />
            <Modal
              modalVisible={filterModalVisible}
              setModalVisible={setFilterModalVisible}
            >
              <FilterModal
                setModalVisible={setFilterModalVisible}
                placeType={props.placeTypes.find(placeType => placeType.id === props.selectedPlaceType)}
              />
            </Modal>
          </TouchableOpacity>
        ) : null}
      </View>
    </Fragment>
  )
};

const styles = StyleSheet.create({
  autoCompleteContainer: {
    maxHeight: Dimensions.get('window').height * .5,
    marginBottom: 10,
    // borderColor: 'blue',
    // borderWidth: 1,
    position: 'absolute',
    width: '90%',
    marginTop: 50,
    zIndex: 1
  },
  pickerSelectContainer: {
    justifyContent: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
    position: 'absolute',
    width: '90%',
    marginTop: 100,
    zIndex: 0
  },
  filterIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 20
  },
  pickerSelect: {
    borderWidth: 1,
    borderColor: 'red',
  },
  pickerSelectInput: {
    backgroundColor: globalColors.white,
    fontSize: 16,
    fontFamily: globalFonts.DMSansRegular,
    borderWidth: 0.5,
    borderColor: globalColors.green,
    borderRadius: 100,
    color: 'black'
  },
  pickerSelectInputIos: {
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  pickerSelectInputAndroid: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pickerPlaceholder: {
    color: globalColors.inputPlaceholder
  },
  chevronContainer: {
    display: 'none'
  },
  modalViewMiddle: {
    justifyContent: 'flex-end',
    backgroundColor: globalColors.screenBackground
  },
  modalViewBottom: {
    backgroundColor: globalColors.screenBackground
  },
  autoCompleteSuggestions: {
    fontFamily: globalFonts.DMSansRegular,
    fontSize: 14
  },
  autoCompleteTextInputContainer: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderTopColor: globalColors.green,
    borderBottomColor: globalColors.green,
    borderLeftColor: globalColors.green,
    borderRightColor: globalColors.green,
    borderRadius: 100,
    backgroundColor: globalColors.white,
    alignItems: 'center'
  },
  autoCompleteTextInput: {
    color: globalColors.black,
    fontFamily: globalFonts.DMSansRegular,
    backgroundColor: globalColors.transparent,
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 16,
    marginRight: 16,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  autoCompelteListView: {
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: globalColors.white,
    borderWidth: .5,
    borderColor: globalColors.green
  },
  autoCompleteSeparator: {
    borderColor: globalColors.green,
    borderWidth: 0.5
  },
  autoCompletePredefinedPlacesDescription: {
    color: globalColors.black,
    fontFamily: globalFonts.DMSansMedium,
    fontSize: 14
  },
  autoCompleteRow: {
    marginVertical: 1
  },
  androidCloseIcon: {
    marginRight: 20
  }
});