import React from 'react';
import {observer} from 'mobx-react-lite';
import {View, ViewStyle} from 'react-native';
import {Checkbox, Text} from 'react-native-paper';
import {Product} from '../../models/Product';

type Action = 'selected' | 'unselected';

type ItemType = {
  product: Product;
  onSelectedChanged: (action: Action, product: Product) => void;
};

const Item = observer((props: ItemType) => {
  const [checked, setChecked] = React.useState(false);
  const {product, onSelectedChanged} = props;
  return (
    <View style={$container}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          onSelectedChanged(!checked ? 'selected' : 'unselected', product);
          setChecked(!checked);
        }}
      />
      <Text variant="titleLarge">{product.name}</Text>
    </View>
  );
});

const $container: ViewStyle = {
  flexDirection: 'row',
};

export default Item;
