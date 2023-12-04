import React from 'react';
import {Text, ViewStyle} from 'react-native';
import {Screen} from '../../components/Screen';

const CreateListScreen = () => {
  return (
    <Screen safeAreaEdges={['top']} contentContainerStyle={$container}>
      <Text>CreateListScree</Text>
    </Screen>
  );
};

//#endregion
const $container: ViewStyle = {
  flex: 1,
};
//#endregion

export default CreateListScreen;
