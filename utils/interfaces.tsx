export interface User {
  id: string;
  created_at: Date;
  phone: number;
  name: string;
  username: string;
  status: string;
}

// Define a type for the friend request
export interface FriendRequest {
  id: number;
  user_requested: string;
  user_accepted: string;
  created_at: Date;
  user: {
    name: string;
  };
}
