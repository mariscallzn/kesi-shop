import React from 'react';
import {ViewStyle} from 'react-native';
import {AnimatedFAB} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';

const ListGroupScreen = () => {
  return (
    <Screen safeAreaEdges={['top']} contentContainerStyle={$container}>
      <AnimatedFAB
        extended
        visible
        icon={'plus'}
        label={translate('ListGroupScreen.newList')}
        onPress={() => {}}
        style={$fab}
      />
    </Screen>
  );
};

//#region Styles
const $container: ViewStyle = {
  flex: 1,
};

const $fab: ViewStyle = {
  bottom: 16,
  right: 16,
  position: 'absolute',
};
//#endregion

export default ListGroupScreen;
