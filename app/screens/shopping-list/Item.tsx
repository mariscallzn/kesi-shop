import {observer} from 'mobx-react-lite';
import React, {FC, memo} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {Checkbox, Text} from 'react-native-paper';
import {ShoppingListItem} from '../../repositories/ShoppingRepository';

export type ItemType = {
  shoppingListItem: ShoppingListItem;
  onItemPress: (item: ShoppingListItem) => void;
  onItemChecked: (itemId: string, checked: boolean) => void;
};

const Item: FC<ItemType> = observer(_props => {
  const [checked, setChecked] = React.useState(_props.shoppingListItem.checked);
  return (
    <TouchableOpacity
      style={$container}
      onPress={() => {
        _props.onItemPress(_props.shoppingListItem);
      }}>
      {_props.shoppingListItem.category && (
        <View
          style={{
            ...$categoryView,
            backgroundColor:
              _props.shoppingListItem.category?.color !== ''
                ? _props.shoppingListItem.category?.color
                : undefined,
          }}
        />
      )}
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          _props.onItemChecked(_props.shoppingListItem.id, !checked);
          setChecked(!checked);
        }}
      />
      <Text>{_props.shoppingListItem.product.name}</Text>
    </TouchableOpacity>
  );
});

const $container: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const $categoryView: ViewStyle = {
  width: 4,
  height: '100%',
};

export default memo(Item);
