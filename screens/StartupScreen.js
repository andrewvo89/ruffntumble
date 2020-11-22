import React from 'react';
import { Dimensions, Image, StyleSheet } from 'react-native';
import { Container, ScreenContainer, Text } from '../components/exports';
import { globalFonts } from '../global/exports';

export default (props) => {
  return (
    <ScreenContainer>
      <Container>
        <Image
          source={require('../assets/images/dog_1f415.png')}
          style={styles.dogImage}
          resizeMode='cover'
        />
        <Text style={styles.appTitleText}>RuffnTumble</Text>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  dogImage: {
    width: 40,
    height: 40
  },
  appTitleText: {
    fontFamily: globalFonts.DMSansMedium,
    fontSize: 16
  },
  madeByText: {
    fontFamily: globalFonts.DMSansMedium,
    fontSize: 8,
    marginBottom: 5
  }
});
