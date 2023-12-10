import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {useStores} from '../../models/helpers/useStores';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';

const CreateListScreen: FC<ShoppingStackScreenProps<'CreateList'>> = observer(
  _props => {
    const {shoppingStore} = useStores();
    const [listName, setListName] = React.useState('');
    return (
      <Screen safeAreaEdges={['top']} contentContainerStyle={$container}>
        <IconButton
          icon="arrow-left"
          onPress={() => {
            _props.navigation.goBack();
          }}
        />
        <View style={$contentContainer}>
          <TextInput
            style={$inputText}
            label={translate('CreateListScreen.listName')}
            value={listName}
            onChangeText={t => setListName(t)}
            mode="outlined"
          />
        </View>
        <Button
          style={$button}
          mode="contained-tonal"
          onPress={() => {
            shoppingStore.addShoppingList(listName);
            _props.navigation.goBack();
          }}>
          {translate('CreateListScreen.createList')}
        </Button>
      </Screen>
    );
  },
);

//#endregion
const $container: ViewStyle = {
  flex: 1,
};
const $contentContainer: ViewStyle = {
  flex: 1,
};
const $inputText: ViewStyle = {
  marginBottom: 56,
  marginHorizontal: 16,
};
const $button: ViewStyle = {
  marginHorizontal: 16,
  marginBottom: 16,
};
//#endregion

export default CreateListScreen;
