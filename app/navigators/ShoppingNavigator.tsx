import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import ListGroupScreen from '../screens/list-group/ListGroupScreen';
//#region Types
export type ShoppingStackParamList = {
  ListGroups: undefined;
  List: undefined;
};
//#endregion

//#region
const Stack = createNativeStackNavigator<ShoppingStackParamList>();

const ShoppingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ListGroups" component={ListGroupScreen} />
    </Stack.Navigator>
  );
};

export default ShoppingNavigator;
//#endregion
