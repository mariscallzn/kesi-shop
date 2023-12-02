import React from 'react';
import {Text, ViewStyle} from 'react-native';
import {Screen} from '../../components/Screen';

const ListGroupScreen = () => {
  return (
    <Screen safeAreaEdges={['top']} contentContainerStyle={$container}>
      <Text>ListGroupScreen</Text>
    </Screen>
  );
};

const $container: ViewStyle = {
  flex: 1,
};

export default ListGroupScreen;
