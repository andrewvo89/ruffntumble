import React from 'react';
import { StyleSheet } from 'react-native';
import { H1, H2, H3 } from 'native-base';

export default props => {
  let Header;
  switch (props.size.toLowerCase()) {
    case 'h1':
      Header = H1;
      break;
    case 'h2':
      Header = H2;
      break;
    case 'h3':
      Header = H3;
      break;
    default:
      break;
  }
  return (
    <Header
      {...props}
      style={{ ...styles.header, ...props.style }}
    >
      {props.children}
    </Header>
  );
};

const styles = StyleSheet.create({
  header: {
    textAlign: 'center'
  }
});