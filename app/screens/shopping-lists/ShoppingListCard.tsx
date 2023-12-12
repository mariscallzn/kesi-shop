import React from 'react';
import {observer} from 'mobx-react-lite';
import {Card, Text} from 'react-native-paper';

type Action = 'options' | 'card';

type ShoppingListCardType = {
  listId: string;
  cardTitle: string;
  totalItems: number;
  checkedItems: number;
  onPress: (action: Action, listId: string) => void;
};

const ShoppingListCard = observer((props: ShoppingListCardType) => {
  const {listId, cardTitle, onPress} = props;
  return (
    <Card
      onPress={() => {
        onPress('card', listId);
      }}>
      <Text>{cardTitle}</Text>
    </Card>
  );
});

export default ShoppingListCard;
