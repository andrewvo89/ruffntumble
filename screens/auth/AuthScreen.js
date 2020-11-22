import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import PaginationDot from 'react-native-animated-pagination-dot';
import { useSelector } from 'react-redux';
import { Button, Container, ScreenContainer, Text, TextLink } from '../../components/exports';
import { globalColors, globalFonts } from '../../global/exports';

export default props => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <ScreenContainer>
      <Text style={styles.mediumText}>Welcome!</Text>
      <Text>Your all-in-one pet app</Text>
      <Container style={{ marginVertical: 40 }}>
        <Container style={styles.imageContainer}>
          <Text>Image</Text>
        </Container>
        <Text>Find a dog park</Text>
      </Container>
      <PaginationDot
        activeDotColor={'black'}
        curPage={currentPage}
        maxPage={4}
      />
      <Button
        buttonContainerStyle={styles.signUpButton}
        rounded
        onPress={() => props.navigation.navigate('signup')}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </Button>
      <Text>Already have an account?</Text>
      <TextLink
        style={styles.loginText}
        onPress={() => props.navigation.navigate('login')}
      >
        Login
      </TextLink>
      {/* <TouchableOpacity
        onPress={() => props.navigation.navigate('login')}
      >
        <Text style={styles.loginText}>
          Login
        </Text>
      </TouchableOpacity> */}
    </ScreenContainer>
  );
};

export const screenOptions = {
  headerShown: false
};

const styles = StyleSheet.create({
  mediumText: {
    fontFamily: globalFonts.DMSansMedium,
    fontSize: 24
  },
  signUpButton: {
    marginVertical: 15
  },
  imageContainer: {
    height: 250,
    width: 250,
    borderStyle: 'solid',
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 5,
    backgroundColor: '#C4C4C410',
    marginBottom: 10
  },
  buttonText: {
    color: globalColors.white
  },
  loginText: {
    color: globalColors.green
  }
});