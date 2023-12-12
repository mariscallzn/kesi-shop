import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import {AnimatedFAB, IconButton, Text} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> =
  observer(_props => {
    const {shoppingStore} = useStores();
    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}>
        <View style={$topBar}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              _props.navigation.goBack();
            }}
          />
          <Text variant="titleMedium">
            {shoppingStore.getListNameById(_props.route.params.listId)?.name}
          </Text>
        </View>
        <AnimatedFAB
          extended
          visible
          icon={'plus'}
          label={translate('common.add')}
          onPress={() => {
            console.log('TODO');
          }}
          style={$fab}
        />
      </Screen>
    );
  });

//#region
const $container: ViewStyle = {
  flex: 1,
};

const $topBar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $fab: ViewStyle = {
  bottom: 16,
  right: 16,
  position: 'absolute',
};
//#endregion

export default ShoppingListScreen;
