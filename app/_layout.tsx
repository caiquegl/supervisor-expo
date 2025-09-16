import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ApolloProvider } from '@apollo/client';
import { ApolloProviderContext } from '@/context/apolloContext';
import { View, ActivityIndicator } from 'react-native';
import { useInitializeClient } from '@/service/apollot';
import { NativeBaseProvider } from 'native-base';
import { PaperProvider } from 'react-native-paper';
import { UserProvider } from '@/context/userContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let client = useInitializeClient();


  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || !client) {
    if (!client) {
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NativeBaseProvider>
      <Toast />
      <PaperProvider>
        <ApolloProvider client={client}>
          <ApolloProviderContext>
            <UserProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Slot />
                <StatusBar style="auto" />
              </ThemeProvider>
            </UserProvider>
          </ApolloProviderContext>
        </ApolloProvider>
      </PaperProvider>
    </NativeBaseProvider>
  );
}
