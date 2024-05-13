import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import Friends from "./Friends";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Friends" component={Friends} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
