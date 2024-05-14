import { supabase } from "@/utils/supabase";
import { User } from "@/utils/interfaces";

export async function fetchAllUsers(): Promise<User[] | null> {
  let { data: users, error } = await supabase.from("users").select("*");

  if (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
  return users;
}

export async function fetchUsersWithStatus(currentUserId: string) {
  // Fetch all users
  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*");
  if (userError) {
    console.error("Error fetching users:", userError);
    return { error: userError };
  }

  // Fetch relationships for the current user
  const { data: friendships, error: friendshipError } = await supabase
    .from("friends")
    .select("*")
    .or(`user_requested.eq.${currentUserId},user_accepted.eq.${currentUserId}`);
  if (friendshipError) {
    console.error("Error fetching friendships:", friendshipError);
    return { error: friendshipError };
  }

  // Merge user data with friendship status
  const usersWithStatus = users.map((user) => {
    const friendship = friendships.find(
      (f) => f.user_requested === user.id || f.user_accepted === user.id
    );
    return {
      ...user,
      status: friendship ? friendship.status : "add",
    };
  });

  return { users: usersWithStatus };
}
