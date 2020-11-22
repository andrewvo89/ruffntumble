import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect, Fragment } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, StyleSheet, BackHandler } from 'react-native';
import { Button, Container, ScreenContainer, Text } from '../../../components/exports';
import { globalColors, globalFonts, globalErrorfunctions } from '../../../global/exports';
import { loginWithFacebook, loginWithGoogle } from '../../../store/authActions';

export default props => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  //Set dynamic screen options when loading changes
  useEffect(() => {//Disable back button when adding profile
    const backAction = () => {
      if (loading) {//If loading i.e. when adding profile, remove back button functionality
        return true;
      }
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    props.navigation.setOptions({
      ...screenOptions,
      headerShown: !loading
    });
    return () => {
      backHandler.remove();
    }
  }, [loading]);

  if (error) {
    Alert.alert(
      'Login error',
      error.message,
      [{
        text: 'OK',
        onPress: () => {
          setError(null);
          setLoading(false);
        }
      }]
    );
  }

  return (
    <ScreenContainer>
      {loading
        ? (
          <ActivityIndicator
            color={globalColors.primary}
            size="large"
          />
        )
        : (
          <Fragment>
            <Image
              source={require('../../../assets/images/dog_1f415.png')}
              style={styles.image}
              resizeMode='cover'
            />
            <Container style={styles.headerContainer}>
              <Text style={styles.headerText}>Log into RuffnTumble</Text>
            </Container>
            <Button
              containerStyle={styles.buttonContainer}
              style={{ backgroundColor: globalColors.green }}
              onPress={() => props.navigation.navigate('emaillogin')}
            >
              <Container style={styles.buttonTextContainer}>
                <MaterialIcons name="mail-outline" size={24} color={globalColors.white} />
                <Text style={styles.buttonText}>Login with email</Text>
              </Container>
            </Button>
            <Button
              containerStyle={styles.buttonContainer}
              style={{ backgroundColor: globalColors.black }}
              onPress={async () => {
                try {
                  setLoading(true);
                  const result = await loginWithGoogle();
                  if (result.type !== 'success') {//If login successful, there is no result, Navigators switch from parent
                    setLoading(false);
                  }
                } catch (error) {
                  setError(await globalErrorfunctions.getFriendlyError(error));
                }
              }}
            >
              <Container style={styles.buttonTextContainer}>
                <AntDesign name="google" size={24} color={globalColors.white} />
                <Text style={styles.buttonText}>Login with Google</Text>
              </Container>
            </Button>
            {/* <Button
              containerStyle={styles.buttonContainer}
              style={{ backgroundColor: globalColors.blue }}
              onPress={async () => {
                try {
                  setLoading(true);
                  const result = await loginWithFacebook();
                  if (result !== 'success') {
                    setLoading(false);
                  }
                } catch (error) {
                  setError(await globalErrorfunctions.getFriendlyError(error));
                }
              }}
            >
              <Container style={styles.buttonTextContainer}>
                <FontAwesome name="facebook-official" size={24} color={globalColors.white} />
                <Text style={styles.buttonText}>Login with Facebook</Text>
              </Container>
            </Button> */}
          </Fragment>
        )}
    </ScreenContainer>
  );
};

export const screenOptions = {
  headerTitle: 'Login',
  headerBackTitle: 'Home'
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%'
  },
  image: {
    width: 40,
    height: 40,
    marginBottom: 10
  },
  headerContainer: {
    marginBottom: 50
  },
  headerText: {
    fontSize: 24,
    fontFamily: globalFonts.DMSansMedium,
  },
  buttonContainer: {
    width: '90%',
    marginBottom: 10
  },
  buttonTextContainer: {
    flexDirection: 'row'
  },
  icon: {
    marginRight: 10
  },
  buttonText: {
    color: globalColors.white,
    fontFamily: globalFonts.DMSansMedium,
    fontSize: 16,
    marginLeft: 10
  }
});