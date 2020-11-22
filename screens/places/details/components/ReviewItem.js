import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, Avatar } from '../../../../components/exports';
import { useSelector } from 'react-redux';
import { Card, CardItem } from 'native-base';
import { Text } from '../../../../components/exports';
import { globalFonts, globalColors } from '../../../../global/exports';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

export default ({ review }) => {
  const MAX_RATING = 5;
  //author_name
  //profile_photo_url
  //rating
  //relative_time_descrtiption
  //text
  //time
  const {
    author_name: authorName,
    profile_photo_url: photoUrl,
    rating,
    relative_time_description: relativeTime,
    text,
  } = review;

  return (
    <Card style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar image={photoUrl} />
        <View style={styles.nameContainer}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.relativeTime}>{relativeTime}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(rating)].map((_star, index) => (
              <Ionicons
                key={index}
                style={styles.ratingIcon}
                name="md-star"
                size={20}
                color={globalColors.green} />
            ))}
            {[...Array(MAX_RATING - rating)].map((_star, index) => (
              <Ionicons
                key={index}
                style={styles.ratingIcon}
                name="md-star"
                size={20}
                color={globalColors.grey} />
            ))}
          </View>
        </View>
      </View>
      <ScrollView style={styles.bodyContainer}>
        <Text style={styles.reviewText}>{text}</Text>
      </ScrollView>
    </Card >
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 15,
    height: 250,
    backgroundColor: 'white'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden'
  },
  nameContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 10
  },
  authorName: {
    fontFamily: globalFonts.DMSansMedium
  },
  relativeTime: {
    fontFamily: globalFonts.DMSansRegular
  },
  ratingContainer: {
    flexDirection: 'row'
  },
  ratingIcon: {
    marginRight: 3
  },
  bodyContainer: {
  },
  reviewText: {
    textAlign: 'left'
  }
});