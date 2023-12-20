import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {Checkbox, Text} from 'react-native-paper';
import {
  ShoppingListItem,
  ShoppingListItemSnapshotIn,
} from '../../models/ShoppingLists';

export type ItemType = {
  shoppingListItem: ShoppingListItem;
  onItemPress: (item: ShoppingListItemSnapshotIn) => void;
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
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          _props.onItemChecked(_props.shoppingListItem.id, !checked);
          setChecked(!checked);
        }}
      />
      <Text>{_props.shoppingListItem.product}</Text>
    </TouchableOpacity>
  );
});

const $container: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

export default Item;
