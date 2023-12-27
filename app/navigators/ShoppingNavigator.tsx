import {CompositeScreenProps} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React from 'react';
import ProductsScreen from '../screens/products/ProductsScreen';
import ShoppingListScreen from '../screens/shopping-list/ShoppingListScreen';
import ShoppingListsScreen from '../screens/shopping-lists/ShoppingListsScreen';
import {AppStackParamList, AppStackScreenProps} from './AppNavigator';
//#region Types
export type ShoppingStackParamList = {
  ShoppingLists: undefined;
  ShoppingList: {
    listId: string;
  };
  Products: {
    listId?: string;
    shoppingListProducts?: string[];
  };
};

export type ShoppingStackScreenProps<T extends keyof ShoppingStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<ShoppingStackParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >;
//#endregion

//#region
const Stack = createNativeStackNavigator<ShoppingStackParamList>();

const ShoppingNavigator = observer(() => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ShoppingLists" component={ShoppingListsScreen} />
      <Stack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
    </Stack.Navigator>
  );
});

export default ShoppingNavigator;
//#endregion
