import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {ViewStyle} from 'react-native';
import {AnimatedFAB} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';

const BusinessStoresScreen: FC<ShoppingStackScreenProps<'BusinessStores'>> =
  observer(_props => {
    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}>
        <AnimatedFAB
          extended
          visible
          icon={'plus'}
          label={translate('BusinessStoresScreen.addStore')}
          onPress={() => {
            _props.navigation.navigate('CreateList');
          }}
          style={$fab}
        />
      </Screen>
    );
  });

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

export default BusinessStoresScreen;
