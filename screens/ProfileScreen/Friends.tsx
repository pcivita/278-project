import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { fetchAllUsers, fetchUsersWithStatus } from "@/fetch/fetch"; // Ensure this path is correct
import { User } from "@/utils/interfaces";
import AddFriendCard from "@/components/AddFriendCard";
import { supabase } from "@/utils/supabase";
import { useUser } from "@/UserContext";

const Friends: React.FC = () => {
  const { userId } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await fetchUsersWithStatus(userId);
        if (result.error) {
          throw new Error(result.error.message);
        }
        setUsers(result.users); // Make sure to reference result.users, not result directly
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAddFriend = async (friendId: string) => {
    // TODO: Change Hard Code

    // Check if a request already exists
    const { data: existingRequests, error } = await supabase
      .from("friends")
      .select("*")
      .eq("user_requested", userId)
      .eq("user_accepted", friendId);

    if (error) {
      console.error("Error checking friendship status:", error);
      return;
    }

    if (existingRequests.length > 0) {
      // Assume handling the first entry if multiple; adjust logic if needed
      const existingRequest = existingRequests[0];
      if (existingRequest.status === "pending") {
        // Delete the request if it's pending
        const { error: deleteError } = await supabase
          .from("friends")
          .delete()
          .match({ id: existingRequest.id });

        if (!deleteError) {
          setUsers(
            users.map((user) =>
              user.id === friendId ? { ...user, status: "add" } : user
            )
          );
        } else {
          console.error("Error deleting friend request:", deleteError);
        }
      } else {
        // Optionally handle other statuses if necessary, e.g., 'accepted'
        console.log("Handle other statuses if needed");
      }
    } else {
      // No existing request, create a new one
      const { error: insertError } = await supabase.from("friends").insert([
        {
          user_requested: userId,
          user_accepted: friendId,
          status: "pending",
        },
      ]);

      if (!insertError) {
        setUsers(
          users.map((user) =>
            user.id === friendId ? { ...user, status: "pending" } : user
          )
        );
      } else {
        console.error("Error creating friend request:", insertError);
      }
    }
  };

  // const handleAddFriend = async (userId: any) => {
  //   console.log("Added Friend: ", userId);
  // };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={{ paddingTop: 10 }}>
      {users.map((user: User) => (
        // <AddFriendCard key={user.id} user={user} />
        <AddFriendCard
          key={user.id}
          user={user}
          onAddFriend={() => handleAddFriend(user.id)}
          status={user.status}
        />
      ))}
    </View>
  );
};

export default Friends;
