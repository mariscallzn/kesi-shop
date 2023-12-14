import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {FlatList, ViewStyle} from 'react-native';
import {AnimatedFAB} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';
import ShoppingListCard from './ShoppingListCard';

const ShoppingListsScreen: FC<ShoppingStackScreenProps<'ShoppingLists'>> =
  observer(_props => {
    const {shoppingStore} = useStores();

    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}>
        <FlatList
          keyExtractor={item => item.id}
          data={shoppingStore.shoppingLists}
          renderItem={({item}) => (
            <ShoppingListCard
              shoppingList={item}
              onPress={(action, id) => {
                if (action === 'card') {
                  _props.navigation.navigate('ShoppingList', {listId: id});
                }
              }}
            />
          )}
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
