import React from 'react';
import {observer} from 'mobx-react-lite';
import {View, ViewStyle} from 'react-native';
import {Checkbox, Text} from 'react-native-paper';
import {Product} from '../../models/Product';

type Action = 'selected' | 'unselected';

type ItemType = {
  checked: boolean;
  product: Product;
  onSelectedChanged: (action: Action, product: Product) => void;
};

const Item = observer((props: ItemType) => {
  const {product, checked, onSelectedChanged} = props;
  const [_checked, setChecked] = React.useState(checked);
  return (
    <View style={$container}>
      <Checkbox
        status={_checked ? 'checked' : 'unchecked'}
        onPress={() => {
          onSelectedChanged(!_checked ? 'selected' : 'unselected', product);
          setChecked(!_checked);
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
