// Define the UserProfile type
export type UserProfile = {
  id: string;
  name: string;
  bio: string;
  username: string;
  photo?: string;
  friend_count?: number; // Add any other fields that exist in your user profile
};

// Define the navigation types
export type RootStackParamList = {
  Profile: undefined;
  EditProfile: { userProfile: UserProfile };
  Friends: undefined;
  // other routes...
};
