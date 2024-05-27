import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "./Profile"; // Adjust the path as needed
import FriendsScreen from "./Friends"; // Adjust the path as needed
import EditProfileScreen from "./EditProfile"; // Adjust the path as needed
import { MonoText } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { RootStackParamList } from "./types"; // Adjust the path as needed

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        component={ProfileScreen}
        options={{
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>My Profile</MonoText>,
          headerStyle: { backgroundColor: Colors.color2.light },
        }}
      />
      <Stack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>Friends</MonoText>,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>Edit Profile</MonoText>,
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
