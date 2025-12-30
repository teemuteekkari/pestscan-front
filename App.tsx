import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import AppNavigator from 'src/navigation/AppNavigator';
import { AuthProvider } from 'src/store/AuthContext';
import { theme } from 'src/theme/theme';
import { toastConfig } from 'src/utils/toastConfig';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <StatusBar style="auto" />
            <AppNavigator />
            <Toast config={toastConfig} />
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
