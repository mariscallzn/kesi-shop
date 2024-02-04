import {observer} from 'mobx-react-lite';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, View, ViewStyle} from 'react-native';
import {AnimatedFAB} from 'react-native-paper';
import BottomSheet from '../../components/BottomSheet';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingListSnapshotIn} from '../../models/ShoppingLists';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';
import AddShoppingList from './AddShoppingList';
import ShoppingListCard from './ShoppingListCard';

const ShoppingListsScreen: FC<ShoppingStackScreenProps<'ShoppingLists'>> =
  observer(_props => {
    const {shoppingStore} = useStores();

    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [shoppingList, setShoppingList] = useState<
      ShoppingListSnapshotIn | undefined
    >(undefined);

    useEffect(() => {
      shoppingStore.loadShoppingLists();
    }, [shoppingStore]);

    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}>
        <BottomSheet
          maxHeight={50}
          isVisible={isBottomSheetVisible}
          setIsVisible={setBottomSheetVisible}
          dismissed={() => {
            setShoppingList(undefined);
          }}>
          <AddShoppingList
            shoppingList={shoppingList}
            onAddOrUpdatePress={value => {
              shoppingStore.addOrUpdateShoppingList(value.id, value.name);
              setBottomSheetVisible(false);
              setShoppingList(undefined);
            }}
          />
        </BottomSheet>
        <FlatList
          keyExtractor={item => item.id}
          data={shoppingStore.shoppingLists.map(h => h)}
          ItemSeparatorComponent={() => <View style={$flItemSeparator} />}
          renderItem={({item}) => (
            <ShoppingListCard
              shoppingList={item}
              onPress={(action, _shoppingList) => {
                if (action === 'card') {
                  _props.navigation.navigate('ShoppingList', {
                    listId: _shoppingList.id,
                  });
                } else {
                  setShoppingList(_shoppingList);
                  setBottomSheetVisible(true);
                }
              }}
            />
          )}
        />
        <AnimatedFAB
          extended
          visible
          icon={'plus'}
          label={translate('ShoppingListsScreen.addShoppingList')}
          onPress={() => {
            setBottomSheetVisible(true);
          }}
          style={$fab}
        />
      </Screen>
    );
  });

//#region Styles
const $container: ViewStyle = {
  flex: 1,
};

const $flItemSeparator: ViewStyle = {
  height: 8,
};

const $fab: ViewStyle = {
  bottom: 16,
  right: 16,
  position: 'absolute',
};
//#endregion

export default ShoppingListsScreen;
