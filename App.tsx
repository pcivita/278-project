import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'TripSans-Regular': require('./assets/fonts/TripSans-Regular.ttf'),
    'TripSans-Ultra': require('./assets/fonts/TripSans-Ultra.ttf'),
    'TripSans-Medium': require('./assets/fonts/TripSans-Medium.ttf'),
    'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Keep the splash screen visible while fonts are loading
  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Return null to avoid rendering anything while loading
  }

  return <AppNavigator />;
}
