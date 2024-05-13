import React from "react";
import { Button, View } from "react-native";
import { supabase } from "@/utils/supabase";

// Define TypeScript interface for props
interface FriendRequestButtonProps {
  userOneId: string; // Assuming IDs are strings, change to number if necessary
  userTwoId: string; // Same assumption as above
}

const FriendRequestButton: React.FC<FriendRequestButtonProps> = ({
  userOneId,
  userTwoId,
}) => {
  return (
    <View>
      <Button
        title="Send Friend Request"
        onPress={() => sendFriendRequest(userOneId, userTwoId)}
      />
      <Button
        title="Accept Friend Request"
        onPress={() => acceptFriendRequest(userOneId, userTwoId)}
      />
    </View>
  );
};

export default FriendRequestButton;

// Functions sendFriendRequest and acceptFriendRequest need to be defined or imported
// Assume these functions return void and take two string arguments

const sendFriendRequest = async (userOneId: string, userTwoId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .insert([
      { user_one_id: userOneId, user_two_id: userTwoId, status: "pending" },
    ]);

  if (error) {
    console.error("Error sending friend request:", error);
    return false;
  }

  console.log("Friend request sent:", data);
  return true;
};

const acceptFriendRequest = async (userOneId: string, userTwoId: string) => {
  const { data, error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .match({
      user_one_id: userOneId,
      user_two_id: userTwoId,
      status: "pending",
    });

  if (error) {
    console.error("Error accepting friend request:", error);
    return false;
  }

  console.log("Friend request accepted:", data);
  return true;
};
