import {observer} from 'mobx-react-lite';
import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import {Screen} from '../../components/Screen';
import {translate} from '../../i18n/translate';
import {ShoppingStackScreenProps} from '../../navigators/ShoppingNavigator';

const CreateListScreen: FC<ShoppingStackScreenProps<'CreateList'>> = observer(
  _props => {
    const [text, setText] = React.useState('');
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
            value={text}
            onChangeText={t => setText(t)}
            mode="outlined"
          />
        </View>
        <Button style={$button} mode="contained-tonal">
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
