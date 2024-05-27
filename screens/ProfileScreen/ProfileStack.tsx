import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./Profile";
import Friends from "./Friends";
import { MonoText } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import UserProfile from "../UserProfile";

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: "black",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: () => (
            <MonoText useUltra={true} style={{ fontSize: 22 }}>
              My Profile
            </MonoText>
          ),
          headerStyle: { backgroundColor: Colors.color2.light },
        }}
      />
      <Stack.Screen
        name="Friends"
        component={Friends}
        options={{
          headerTitle: () => (
            <MonoText useUltra={true} style={{ fontSize: 22 }}>
              Friends
            </MonoText>
          ),
          // headerStyle: { backgroundColor: Colors.color2.light }
        }}
      />
      <Stack.Screen
        name="userProfile"
        component={UserProfile}
        options={{
          headerTitle: () => (
            <MonoText useUltra={true} style={{ fontSize: 22 }}>
              Friends
            </MonoText>
          ),
          // headerStyle: { backgroundColor: Colors.color2.light }
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
