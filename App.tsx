import React from 'react';
import {PaperProvider} from 'react-native-paper';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {useInitialRootStore} from './app/models/helpers/useStores';
import {AppNavigator} from './app/navigators/AppNavigator';

const App = (): JSX.Element | null => {
  const {rehydrated} = useInitialRootStore(() => {});
  if (!rehydrated) {
    return null;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
