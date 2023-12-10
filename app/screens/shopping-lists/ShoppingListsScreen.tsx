import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {AnimatedFAB, Text} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';

const ShoppingListsScreen: FC<ShoppingStackScreenProps<'ShoppingLists'>> =
  observer(_props => {
    const {shoppingStore} = useStores();

    const renderItem = shoppingList => (
      <View>
        <Text>{shoppingList.item.name}</Text>
      </View>
    );

    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}>
        <FlatList
          data={shoppingStore.shoppingLists}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <AnimatedFAB
          extended
          visible
          icon={'plus'}
          label={translate('ShoppingListsScreen.addShoppingList')}
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

export default ShoppingListsScreen;
