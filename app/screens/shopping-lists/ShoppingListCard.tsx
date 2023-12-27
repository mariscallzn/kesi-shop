import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import {Card, IconButton, ProgressBar, Text} from 'react-native-paper';
import {ShoppingList} from '../../models/ShoppingLists';

type Action = 'options' | 'card';

type ShoppingListCardType = {
  shoppingList: ShoppingList;
  onPress: (action: Action, id: string) => void;
};

const ShoppingListCard: FC<ShoppingListCardType> = observer(_props => {
  const {shoppingList, onPress} = _props;
  const progress = shoppingList.checkedItems / shoppingList.totalItems;
  return (
    <Card
      style={$container}
      onPress={() => {
        onPress('card', shoppingList.id);
      }}>
      <View style={$topContainer}>
        <Text style={$titleText} variant="titleLarge">
          {shoppingList.name}
        </Text>
        <IconButton
          icon={'dots-vertical'}
          onPress={() => {
            onPress('options', shoppingList.id);
          }}
        />
      </View>
      <View style={$bottomContainer}>
        <View style={$progressContainer}>
          {/* TODO: Colors should come from theme */}
          <ProgressBar
            theme={{colors: {primary: 'green'}}}
            animatedValue={progress}
          />
        </View>
        <Text>
          {shoppingList.checkedItems}/{shoppingList.totalItems}
        </Text>
      </View>
    </Card>
  );
});

const $container: ViewStyle = {
  marginHorizontal: 16,
};

const $topContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginStart: 16,
};

const $titleText: ViewStyle = {
  flex: 1,
  marginTop: 12,
};

const $bottomContainer: ViewStyle = {
  marginStart: 16,
  marginEnd: 8,
  marginVertical: 8,
  flexDirection: 'row',
};

const $progressContainer: ViewStyle = {
  flex: 1,
  marginEnd: 12,
  justifyContent: 'center',
};
export default ShoppingListCard;
