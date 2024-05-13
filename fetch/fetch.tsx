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
