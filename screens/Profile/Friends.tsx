import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { fetchAllUsers } from "@/fetch/fetch"; // Ensure this path is correct
import { User } from "@/utils/interfaces";
import AddFriendCard from "@/components/AddFriendCard";

const Friends: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const curUsers: User[] | any = await fetchAllUsers(); // Assuming fetchAllUsers is typed correctly
        setUsers(curUsers);
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

  // const handleAddFriend = async (userId) => {
  //   // API call to add friend
  //   const { data, error } = await supabase
  //     .from("friends")
  //     .insert([{ userId, friendId: "currentUserId", status: "pending" }]);

  //   if (!error) {
  //     // Update the state to reflect this new relationship
  //     // For example, you could update the relationship status in the local state array
  //     setUsers(
  //       users.map((user) =>
  //         user.id === userId
  //           ? {
  //               ...user,
  //               relationship: { ...user.relationship, status: "pending" },
  //             }
  //           : user
  //       )
  //     );
  //   }
  // };

  const handleAddFriend = async (userId: any) => {
    console.log("Added Friend: ", userId);
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <Text>Friends</Text>
      {users.map((user: User) => (
        // <AddFriendCard key={user.id} user={user} />
        <AddFriendCard
          key={user.id}
          user={user}
          onAddFriend={() => handleAddFriend(user.id)}
        />
      ))}
    </View>
  );
};

export default Friends;
