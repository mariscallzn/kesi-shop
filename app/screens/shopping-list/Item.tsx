import {observer} from 'mobx-react-lite';
import React, {FC, memo} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {ShoppingListItem} from '../../repositories/ShoppingRepository';

export type ItemType = {
  shoppingListItem: ShoppingListItem;
  onItemPress: (item: ShoppingListItem) => void;
  onItemChecked: (itemId: string, checked: boolean) => void;
};

const Item: FC<ItemType> = observer(_props => {
  const [checked, setChecked] = React.useState(_props.shoppingListItem.checked);
  const {colors} = useTheme();
  const CustomCheckBox = () => {
    return (
      <IconButton
        size={20}
        iconColor={checked ? 'green' : colors.primary}
        icon={checked ? 'check' : 'circle-outline'}
        onPress={() => {
          _props.onItemChecked(_props.shoppingListItem.id, !checked);
          setChecked(!checked);
        }}
      />
    );
  };

  return (
    <TouchableOpacity
      style={$container}
      onPress={() => {
        if (checked) {
          _props.onItemChecked(_props.shoppingListItem.id, !checked);
          setChecked(!checked);
        } else {
          _props.onItemPress(_props.shoppingListItem);
        }
      }}>
      {_props.shoppingListItem.category && !checked && (
        <View
          style={{
            ...$categoryView,
            backgroundColor:
              _props.shoppingListItem.category?.color !== ''
                ? _props.shoppingListItem.category?.color
                : undefined,
          }}
        />
      )}
      <CustomCheckBox />
      <Text
        variant="bodyLarge"
        style={[
          $title,
          {color: checked ? colors.onSurfaceDisabled : colors.onBackground},
        ]}>
        {_props.shoppingListItem.product.name}
      </Text>
      {_props.shoppingListItem.quantity > 0 && !checked && (
        <View style={[$amountContainer, {backgroundColor: colors.onPrimary}]}>
          <Text
            style={[$amount, {color: colors.primary}]}
            variant={'labelLarge'}>
            {_props.shoppingListItem.quantity + _props.shoppingListItem.unit}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const $container: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};

const $categoryView: ViewStyle = {
  width: 4,
  height: '100%',
};

const $title: ViewStyle = {
  flex: 1,
};

const $amountContainer: ViewStyle = {
  marginHorizontal: 16,
  borderRadius: 32,
  alignItems: 'center',
  justifyContent: 'center',
};

const $amount: ViewStyle = {
  marginHorizontal: 16,
};

export default memo(Item);
