import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Card, Text} from 'react-native-paper';
import {ShoppingList} from '../../models/ShoppingLists';

type Action = 'options' | 'card';

type ShoppingListCardType = {
  shoppingList: ShoppingList;
  onPress: (action: Action, id: string) => void;
};

const ShoppingListCard: FC<ShoppingListCardType> = observer(_props => {
  const {shoppingList, onPress} = _props;
  return (
    <Card
      onPress={() => {
        onPress('card', shoppingList.id);
      }}>
      <Text>{shoppingList.name}</Text>
    </Card>
  );
});

export default ShoppingListCard;
