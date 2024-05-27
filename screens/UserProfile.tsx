// screens/UserProfile.tsx
import React from "react";
import { View, Text } from "react-native";
import { User } from "@/utils/interfaces";
import { StackScreenProps } from "@react-navigation/stack";

type UserProfileProps = StackScreenProps<
  { userProfile: { user: User } },
  "userProfile"
>;

const UserProfile: React.FC<UserProfileProps> = ({ route }) => {
  const { user } = route.params;
  return (
    <View>
      <Text>User Profile</Text>
      <Text>{user.name}</Text>
      {/* Render other user details */}
    </View>
  );
};

export default UserProfile;
