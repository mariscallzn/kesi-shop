import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {Button, Chip, Divider, IconButton, TextInput} from 'react-native-paper';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {Product} from '../../repositories/ProductRepository';
import {ShoppingListItem} from '../../repositories/ShoppingRepository';
import Units from './Units';

export type AddProductType = {
  shoppingListItem?: ShoppingListItem;
  onAddOrUpdatePress: (newShoppingListItem: ShoppingListItem) => void;
  onOpenList: () => void;
};

const AddProduct: FC<AddProductType> = observer(_props => {
  const {onAddOrUpdatePress, onOpenList} = _props;
  const {product, quantity, unit} = _props.shoppingListItem || {
    product: {id: '', name: ''},
    unit: '',
  };
  const [isListSuggestionsVisible, setListSuggestionVisibility] =
    useState(false);
  const [_product, setProduct] = useState<Product>(product);
  const [_unit, setUnit] = useState(unit);
  const [_quantity, setQuantity] = useState(
    quantity === 0 ? '' : quantity?.toString(),
  );

  const {productsStore} = useStores();

  useEffect(() => {
    productsStore.fetchProducts();
    return () => {
      productsStore.clearStateTree();
      setProduct({id: '', name: ''});
      setUnit('');
      setQuantity('');
    };
  }, [productsStore]);

  const renderItem = (item: {
    product: Product;
    onChipPress: (product: Product) => void;
  }) => {
    return (
      <Chip
        onPress={() => {
          item.onChipPress(item.product);
        }}>
        {item.product.name}
      </Chip>
    );
  };

  return (
    <View>
      <View style={$productContainer}>
        <TextInput
          style={$productNameTextInput}
          mode="outlined"
          label={translate('ShoppingListScreen.productName')}
          value={_product.name}
          onChangeText={e => {
            productsStore.fetchProducts(undefined, e);
            setProduct({id: '', name: e});
            setListSuggestionVisibility(true);
          }}
        />
        <IconButton icon="open-in-new" onPress={onOpenList} />
      </View>
      {isListSuggestionsVisible ? (
        <FlatList
          horizontal
          contentContainerStyle={$flContentContainer}
          keyboardShouldPersistTaps="always"
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          data={productsStore.products
            .slice(0, 5)
            .map(p => ({id: p.id, name: p.name}))}
          ItemSeparatorComponent={() => <View style={$flSeparator} />}
          renderItem={({item}) =>
            renderItem({
              product: item,
              onChipPress: selectedProduct => {
                setProduct(selectedProduct);
                setListSuggestionVisibility(false);
              },
            })
          }
        />
      ) : null}
      <View style={$quantityContainer}>
        <TextInput
          style={$quantityTextInput}
          mode="outlined"
          label={translate('ShoppingListScreen.quantity')}
          keyboardType="number-pad"
          value={_quantity}
          onChangeText={setQuantity}
        />
        <TextInput
          style={$unitTextInput}
          mode="outlined"
          label={translate('ShoppingListScreen.unit')}
          value={_unit}
          onChangeText={setUnit}
        />
        <IconButton
          mode={'contained-tonal'}
          size={20}
          icon={'minus'}
          disabled={
            _quantity === undefined || _quantity === '0' || _quantity === ''
          }
          onPress={() => {
            if (_quantity) {
              setQuantity(`${Number(_quantity) - 1}`);
            }
          }}
        />
        <IconButton
          mode={'contained-tonal'}
          size={20}
          icon={'plus'}
          onPress={() => {
            if (_quantity) {
              setQuantity(`${Number(_quantity) + 1}`);
            } else {
              setQuantity('1');
            }
          }}
        />
      </View>
      <Divider />
      {/* TODO: Read from settings which system to load*/}
      <Units measurementSystem="imperial" setUnit={setUnit} />
      <Button
        style={$addButton}
        mode="contained-tonal"
        onPress={() => {
          onAddOrUpdatePress({
            id: _props.shoppingListItem?.id ?? '',
            product: _product,
            quantity: _quantity === undefined ? 0 : +_quantity,
            unit: _unit ?? '',
            checked: false,
          });
        }}>
        {_props.shoppingListItem === undefined
          ? translate('common.add')
          : translate('common.done')}
      </Button>
    </View>
  );
});

const $quantityContainer: ViewStyle = {
  flexDirection: 'row',
  marginHorizontal: 16,
  marginVertical: 8,
  alignItems: 'center',
};

const $productContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $productNameTextInput: ViewStyle = {
  flex: 1,
  marginHorizontal: 16,
};

const $quantityTextInput: ViewStyle = {
  flex: 1,
  marginEnd: 8,
};

const $unitTextInput: ViewStyle = {
  flex: 1,
  marginEnd: 16,
};

const $addButton: ViewStyle = {
  marginHorizontal: 16,
};

const $flContentContainer: ViewStyle = {
  paddingHorizontal: 16,
  marginTop: 8,
};
const $flSeparator: ViewStyle = {
  width: 4,
};

export default AddProduct;
