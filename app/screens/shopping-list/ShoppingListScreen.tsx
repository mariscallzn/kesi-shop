import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {AnimatedFAB, IconButton, Text} from 'react-native-paper';
import BottomSheet from '../../components/BottomSheet';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingListItemSnapshotIn} from '../../models/ShoppingLists';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';
import AddProduct from './AddProduct';
import Item from './Item';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> =
  observer(_props => {
    const {shoppingStore} = useStores();
    const {items, name} = shoppingStore.getListById(
      _props.route.params.listId,
    )!!; //TODO Review this force read
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [shoppingListItem, setShoppingListItem] = useState<
      ShoppingListItemSnapshotIn | undefined
    >(undefined);

    useEffect(() => {
      shoppingStore.loadShoppingListItems(_props.route.params.listId);
    }, [shoppingStore, _props.route.params.listId]);

    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}>
        <BottomSheet
          maxHeight={50}
          isVisible={isBottomSheetVisible}
          setIsVisible={setBottomSheetVisible}
          dismissed={() => {
            setShoppingListItem(undefined);
          }}>
          <AddProduct
            shoppingListItem={shoppingListItem}
            onAddOrUpdatePress={newOrUpdatedShoppingListItem => {
              shoppingStore.addOrUpdateProductInShoppingList(
                newOrUpdatedShoppingListItem,
                _props.route.params.listId,
              );
              setBottomSheetVisible(false);
            }}
            onOpenList={() => {
              setBottomSheetVisible(false);
              _props.navigation.navigate('Products', {
                listId: _props.route.params.listId,
                shoppingListProducts: items.map(i => i.product),
              });
            }}
          />
        </BottomSheet>
        <View style={$topBar}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              _props.navigation.goBack();
            }}
          />
          <Text style={$topBarTitle} variant="titleMedium">
            {name}
          </Text>
        </View>
        <FlatList
          keyExtractor={item => item.id}
          // TODO: Check render performance. Hack to force re-render.
          // It seems that "items" must be called. For some reason
          // if I only pass items it doesn't detect the changes
          data={items.map(i => i)}
          renderItem={({item}) => (
            <Item
              shoppingListItem={item}
              onItemPress={itemPressed => {
                setShoppingListItem(itemPressed);
                setBottomSheetVisible(true);
              }}
              onItemChecked={(itemId, checked) => {
                shoppingStore.checkItemFromList(
                  itemId,
                  _props.route.params.listId,
                  checked,
                );
              }}
            />
          )}
        />
        <AnimatedFAB
          extended
          visible
          icon={'plus'}
          label={translate('common.add')}
          onPress={() => {
            setBottomSheetVisible(true);
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
  marginEnd: 16,
};

//TODO: FIX: Review why long texts pass beyond edge screen
const $topBarTitle: ViewStyle = {
  marginEnd: 16,
  flex: 1,
};

const $fab: ViewStyle = {
  bottom: 16,
  right: 16,
  position: 'absolute',
};
//#endregion

export default ShoppingListScreen;
