import {observer} from 'mobx-react-lite';
import React, {memo} from 'react';
import {View, ViewStyle} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import {Product} from '../../models/Product';

type Action = 'selected' | 'unselected';

type ItemType = {
  product: Product;
  onSelectedChanged: (action: Action, product: Product) => void;
};

const Item = observer((props: ItemType) => {
  const {product, onSelectedChanged} = props;
  const [_checked, setChecked] = React.useState(product.selected);

  return (
    <View style={$container}>
      <IconButton
        size={20}
        icon={_checked ? 'close-circle' : 'plus-circle-outline'}
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

export default memo(Item);
