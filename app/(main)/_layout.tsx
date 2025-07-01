import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function MainLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          freezeOnBlur: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Loading",
            freezeOnBlur: true,
          }}
        />
        <Stack.Screen
          name="sigin"
          options={{
            title: "Login",
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            title: "Home",
            freezeOnBlur: false,
          }}
        />
        <Stack.Screen
          name="PromotersComponent"
          options={{
            title: "Promoters",
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="PromoterDetail"
          options={{
            title: "Promoter Detail",
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="programmerVisits"
          options={{
            title: "Programmer Visits",
            freezeOnBlur: false,
          }}
        />
        <Stack.Screen
          name="pictures"
          options={{
            title: "Pictures",
            freezeOnBlur: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
