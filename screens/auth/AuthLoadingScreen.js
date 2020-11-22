import React from 'react';
import { ActivityIndicator } from 'react-native';
import { globalColors } from '../../global/exports';

export default props => {
  return (
    <ScreenContainer>
      <ActivityIndicator
        size="large"
        color={globalColors.primary}
      />
    </ScreenContainer>
  );
};