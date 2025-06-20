import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {
  AnimatedFAB,
  IconButton,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import BottomSheet from '../../components/BottomSheet';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';
import {ShoppingListItem} from '../../repositories/ShoppingRepository';
import AddProduct from './AddProduct';
import Item from './Item';

const ShoppingListScreen: FC<ShoppingStackScreenProps<'ShoppingList'>> =
  observer(_props => {
    const {colors} = useTheme();
    const {shoppingStore} = useStores();
    const {items, name, checkedItems, totalItems} = shoppingStore.getListById(
      _props.route.params.listId,
    )!!; //TODO Review this force read
    const progressBarValue = checkedItems / totalItems;
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [shoppingListItem, setShoppingListItem] = useState<
      ShoppingListItem | undefined
    >(undefined);

    useEffect(() => {
      shoppingStore.loadShoppingListItems(_props.route.params.listId);
    }, [shoppingStore, _props.route.params.listId]);

    const TopBar = () => {
      return (
        <Surface>
          <View style={$topBar}>
            <IconButton
              icon="arrow-left"
              onPress={() => {
                _props.navigation.goBack();
              }}
            />
            <Text style={$topBarTitle} variant="titleLarge">
              {name}
            </Text>
          </View>
          <ProgressBar
            style={$progressBar}
            theme={{colors: {primary: 'green'}}}
            progress={isNaN(progressBarValue) ? 0 : progressBarValue}
          />
        </Surface>
      );
    };

    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}
        statusBarProps={{backgroundColor: colors.backdrop}}>
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
              });
            }}
          />
        </BottomSheet>
        <TopBar />
        <FlatList
          keyExtractor={item => item.id}
          // TODO: Check render performance. Hack to force re-render.
          // It seems that "items" must be called. For some reason
          // if I only pass items it doesn't detect the changes
          data={items.map<ShoppingListItem>(i => ({
            id: i.id,
            checked: i.checked,
            product: {id: i.product_id, name: i.product},
            quantity: i.quantity,
            unit: i.unit,
            category: {id: i.category_id, color: i.categoryColor},
          }))}
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
  paddingEnd: 16,
  flexDirection: 'row',
  alignItems: 'center',
};

const $progressBar: ViewStyle = {
  borderRadius: 32,
  height: 8,
  marginHorizontal: 16,
  marginBottom: 8,
};

const $topBarTitle: ViewStyle = {
  flex: 1,
};

const $fab: ViewStyle = {
  bottom: 16,
  right: 16,
  position: 'absolute',
};
//#endregion

export default ShoppingListScreen;
