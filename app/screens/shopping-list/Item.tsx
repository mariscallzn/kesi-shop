import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import {Text} from 'react-native-paper';
import {ShoppingListItem} from '../../models/ShoppingLists';

export type ItemType = {
  shoppingListItem: ShoppingListItem;
};

const Item: FC<ItemType> = observer(_props => {
  return (
    <View style={$container}>
      <Text>{_props.shoppingListItem.product.name}</Text>
    </View>
  );
});

const $container: ViewStyle = {
  flex: 1,
};

export default Item;
