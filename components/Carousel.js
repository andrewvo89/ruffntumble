import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'native-base';
import Carousel from 'react-native-snap-carousel';

export default props => {
  const caraouselRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item, index }) => {
    return (
      <View style={{
        backgroundColor: 'grey',
        borderRadius: 5,
        height: 150,
        padding: 50,
        marginLeft: 25,
        marginRight: 25,
      }}>
        <Text style={{ fontSize: 30 }}>{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    );
  }

  return (
    <Carousel style={{ ...styles.carousel, ...props.style }}
      {...props}
      layout={"default"}
      ref={caraouselRef}
      sliderWidth={300}
      itemWidth={300}
      renderItem={renderItem}
      onSnapToItem={setActiveIndex}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    // height: '100%'
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  }
});