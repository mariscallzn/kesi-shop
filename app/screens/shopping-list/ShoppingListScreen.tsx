import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {AnimatedFAB, IconButton, Text} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';
import Item from './Item';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> =
  observer(_props => {
    const {shoppingStore} = useStores();
    const {items, name} = shoppingStore.getListById(
      _props.route.params.listId,
    )!!;

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
          <Text variant="titleMedium">{name}</Text>
        </View>
        <FlatList
          keyExtractor={item => item.id}
          // TODO: Check render performance. Hack to force re-render.
          // It seems that "items" must be called. For some reason
          // if I only pass items it doesn't detect the changes
          data={items.map(i => i)}
          renderItem={({item}) => <Item shoppingListItem={item} />}
        />
        <AnimatedFAB
          extended
          visible
          icon={'plus'}
          label={translate('common.add')}
          onPress={() => {
            _props.navigation.navigate('Products', {
              listId: _props.route.params.listId,
            });
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
