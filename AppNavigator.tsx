import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./utils/supabase";
import Onboarding from "./screens/Onboarding";
import Login from "./screens/Login";
import LoginWithUsername from "./screens/LoginWithUsername";

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setInitialized(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          // If there is a session, navigate to Main
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          // No session, navigate to Login
          <Stack.Screen name="Onboarding" component={Onboarding} />
        )}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoginWithUsername" component={LoginWithUsername} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
