import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {AnimatedFAB, IconButton, Searchbar} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';
import Item from './Item';

const ProductsScreen: FC<ShoppingStackScreenProps<'Products'>> = observer(
  _props => {
    const {productsStore} = useStores();
    const [productName, setProductName] = useState('');
    const {listId} = _props.route.params;

    useEffect(() => {
      productsStore.fetchProducts(listId);
      return () => {
        productsStore.clearStateTree();
      };
    }, [productsStore, listId]);

    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={$container}>
        <View style={$topBar}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              _props.navigation.goBack();
            }}
          />
          <Searchbar
            autoFocus
            style={$searchBar}
            value={productName}
            onChangeText={e => {
              productsStore.fetchProducts(undefined, e);
              setProductName(e);
            }}
          />
        </View>
        <FlatList
          keyboardShouldPersistTaps={'always'}
          // Somehow I need this hack
          data={productsStore.products.map(i => i)}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Item
              product={item}
              onSelectedChanged={(action, product) => {
                action === 'selected'
                  ? productsStore.selectProduct(product)
                  : productsStore.unselectProduct(product);
                setProductName('');
              }}
            />
          )}
        />
        {listId && (
          <AnimatedFAB
            extended
            visible
            icon={'check'}
            label={''}
            onPress={() => {
              productsStore.addProductsToShoppingList(listId);
              _props.navigation.goBack();
            }}
            style={$fab}
          />
        )}
      </Screen>
    );
  },
);

//#region
const $container: ViewStyle = {
  flex: 1,
};

const $topBar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $searchBar: ViewStyle = {
  flex: 1,
  marginEnd: 16,
};
const $fab: ViewStyle = {
  bottom: 16,
  right: 16,
  position: 'absolute',
};
//#endregion

export default ProductsScreen;
