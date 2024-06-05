import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or any other icon library you're using
import ProfileScreen from "./Profile"; // Adjust the path as needed
import FriendsScreen from "./Friends"; // Adjust the path as needed
import EditProfileScreen from "./EditProfile"; // Adjust the path as needed
import { MonoText } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { RootStackParamList } from "./types"; // Adjust the path as needed
import UserProfile from "../UserProfile";

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
        options={({ navigation }) => ({
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>Friends</MonoText>,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>Edit Profile</MonoText>,
        }}
      />
      <Stack.Screen
        name="userProfile"
        component={UserProfile}
        options={{
          headerTitle: () => <MonoText useUltra={true} style={{ fontSize: 22 }}>User</MonoText>,
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
