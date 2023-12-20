import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import {
  ShoppingListItem,
  ShoppingListItemSnapshotIn,
} from '../../models/ShoppingLists';

export type ItemType = {
  shoppingListItem: ShoppingListItem;
  onItemPress: (item: ShoppingListItemSnapshotIn) => void;
};

const Item: FC<ItemType> = observer(_props => {
  return (
    <TouchableOpacity
      style={$container}
      onPress={() => {
        _props.onItemPress(_props.shoppingListItem);
      }}>
      <Text>{_props.shoppingListItem.product}</Text>
    </TouchableOpacity>
  );
});

const $container: ViewStyle = {
  flex: 1,
};

export default Item;
