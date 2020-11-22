import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Container, ScreenContainer, Text, TextLink } from '../../../components/exports';
import { globalColors } from '../../../global/exports';
import { sendEmailVerification, logout } from '../../../store/authActions';

export default props => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [emailSent, setEmailSent] = useState(false);
  const email = useSelector(state => state.authState.authUser.email);
  const dispatch = useDispatch();
  //Add back button listener on mount
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Log out", "Are you sure you want to log out?", [{
        text: "No",
        onPress: () => null,
        style: "cancel"
      }, {
        text: "Yes",
        onPress: async () => await dispatch(logout())
      }
      ]);
      return true;
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      backHandler.remove();
    }
  }, []);
  //Wait 20 seconds before giving users option to resend email
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 20000);
  }, []);

  if (error) {
    Alert.alert(
      'Verification email error',
      error.message,
      [{
        text: 'OK',
        onPress: () => {
          setError(false);
          setLoading(false);
        }
      }]
    );
  }

  let MessageText = (
    <TextLink
      style={styles.sendEmailText}
      onPress={async () => {
        try {
          setLoading(true);
          await sendEmailVerification(email);
          setEmailSent(true);
          setLoading(false);
        } catch (error) {
          setError(error);
        }
      }}
    >Resend link</TextLink>
  );
  if (emailSent) {
    MessageText = <Text>Link sent</Text>;
  }

  return (
    <ScreenContainer>
      <Text style={styles.mainText}>Check your email for</Text>
      <Text style={styles.mainText}>a verification link</Text>
      <Container style={styles.messageTextContainer}>
        {loading ? (
          <ActivityIndicator
            color={globalColors.green}
            size="small"
          />
        ) : MessageText}
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mainText: {
    fontSize: 24
  },
  messageTextContainer: {
    marginTop: 20,
    height: 24,
    justifyContent: 'flex-end'
  },
  sendEmailText: {
    color: globalColors.green
  },
  emailSentText: {
    marginTop: 15
  }
});