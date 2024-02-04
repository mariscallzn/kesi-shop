import {observer} from 'mobx-react-lite';
import React, {FC, useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import {View, ViewStyle} from 'react-native';
import {translate} from '../../i18n/translate';
import {ShoppingListSnapshotIn} from '../../models/ShoppingLists';

type AddShoppingListType = {
  shoppingList?: ShoppingListSnapshotIn;
  onAddOrUpdatePress: (newList: ShoppingListSnapshotIn) => void;
};

// TODO: Delete button.
const AddShoppingList: FC<AddShoppingListType> = observer(_props => {
  const {shoppingList, onAddOrUpdatePress} = _props;

  const [_listName, setListName] = useState(shoppingList?.name);
  return (
    <View>
      <TextInput
        style={$listInputText}
        mode="outlined"
        label={translate('ShoppingListsScreen.listName')}
        value={_listName}
        onChangeText={setListName}
      />
      <Button
        style={$addButton}
        mode="contained-tonal"
        disabled={_listName === undefined}
        onPress={() => {
          if (_listName) {
            onAddOrUpdatePress({
              // TODO: Make the view receive whatever and the data model should validate
              id: shoppingList?.id ?? '',
              name: _listName,
            });
          }
        }}>
        {shoppingList === undefined
          ? translate('common.add')
          : translate('common.done')}
      </Button>
    </View>
  );
});

const $listInputText: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 8,
};

const $addButton: ViewStyle = {
  marginHorizontal: 16,
};

export default AddShoppingList;
