import {observer} from 'mobx-react-lite';
import React, {FC, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import {IconButton, Searchbar, Text} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';

const ProductsScreen: FC<ShoppingStackScreenProps<'Products'>> = observer(
  _props => {
    const {productsStore} = useStores();
    const [productName, setProductName] = useState('');

    return (
      <Screen
        safeAreaEdges={['top', 'bottom']}
        contentContainerStyle={$container}>
        <View style={$topBar}>
          <IconButton
            icon="arrow-left"
            onPress={() => {
              _props.navigation.goBack();
            }}
          />
          <Searchbar
            style={$searchBar}
            value={productName}
            onChangeText={setProductName}
          />
        </View>
        {/* TODO: Review performance, I might have to uninstall the app */}
        <Text>{JSON.stringify(productsStore.products)}</Text>
      </Screen>
    );
  },
);

//#region
const $container: ViewStyle = {
  flex: 1,
};

const $topBar: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $searchBar: ViewStyle = {
  flex: 1,
  marginEnd: 16,
};
//#endregion

export default ProductsScreen;
