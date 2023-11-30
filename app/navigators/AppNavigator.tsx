import {NavigatorScreenParams} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {ShoppingStackParamList} from './ShoppingNavigator';

//#region Types
export type AppStackParamList = {
  Shopping: NavigatorScreenParams<ShoppingStackParamList>;
};
//#endregion

const AppNavigator = () => {
  return (
    <View>
      <Text>AppNavigator</Text>
    </View>
  );
};

export default AppNavigator;
