import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useColorScheme} from 'react-native';
import {navigationRef} from './navigationUtils';
import ShoppingNavigator, {ShoppingStackParamList} from './ShoppingNavigator';

//#region Types
export type AppStackParamList = {
  Shopping: NavigatorScreenParams<ShoppingStackParamList>;
};
export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;
//#endregion

//#region Interfaces
export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}
//#endregion

//#region Components
// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = observer((): React.JSX.Element => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Shopping" component={ShoppingNavigator} />
    </Stack.Navigator>
  );
});

export const AppNavigator = observer((props: NavigationProps) => {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      {...props}>
      <AppStack />
    </NavigationContainer>
  );
});
//#endregion
