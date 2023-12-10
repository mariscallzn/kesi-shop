import {CompositeScreenProps} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React from 'react';
import CreateListScreen from '../screens/create-list/CreateListScreen';
import ShoppingListsScreen from '../screens/shopping-lists/ShoppingListsScreen';
import {AppStackParamList, AppStackScreenProps} from './AppNavigator';
//#region Types
export type ShoppingStackParamList = {
  ShoppingLists: undefined;
  List: undefined;
  CreateList: undefined;
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
      <Stack.Screen name="CreateList" component={CreateListScreen} />
    </Stack.Navigator>
  );
});

export default ShoppingNavigator;
//#endregion
