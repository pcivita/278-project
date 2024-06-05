import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
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
    console.log("Handling friend request for:", friendId);

    // Check if a request already exists
    const { data: existingRequests, error } = await supabase
      .from("friends")
      .select("*")
      .or(`user_requested.eq.${userId},user_accepted.eq.${userId}`)
      .or(`user_requested.eq.${friendId},user_accepted.eq.${friendId}`);

    if (error) {
      console.error("Error checking friendship status:", error);
      return;
    }

    console.log("Existing requests:", existingRequests);

    const existingRequest = existingRequests.find(
      (request) =>
        (request.user_requested === userId &&
          request.user_accepted === friendId) ||
        (request.user_requested === friendId &&
          request.user_accepted === userId)
    );

    if (existingRequest) {
      console.log("Existing request found:", existingRequest);

      if (
        existingRequest.status === "Requested" ||
        existingRequest.status === "Friends"
      ) {
        // Delete the request if it's pending or already friends
        const { error: deleteError } = await supabase
          .from("friends")
          .delete()
          .eq("id", existingRequest.id);

        if (!deleteError) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === friendId ? { ...user, status: "Add Friend" } : user
            )
          );
          console.log("Request deleted");
        } else {
          console.error("Error deleting friend request:", deleteError);
        }
      }
    } else {
      // No existing request, create a new one
      const { error: insertError } = await supabase.from("friends").insert([
        {
          user_requested: userId,
          user_accepted: friendId,
          status: "Requested",
        },
      ]);

      if (!insertError) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === friendId ? { ...user, status: "Requested" } : user
          )
        );
        console.log("Request created");
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
    <ScrollView style={styles.container}>
      {users.map((user: User) => (
        // <AddFriendCard key={user.id} user={user} />
        <AddFriendCard
          key={user.id}
          user={user}
          onAddFriend={() => handleAddFriend(user.id)}
          status={user.status}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "white",
    flex: 1,
  },
  username: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default Friends;
