import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create a Supabase client. This is the primary object you'll interact with to communicate with your Supabase backend.
export const supabase = createClient(
  supabaseUrl!, // The base URL of your Supabase project. The '!' asserts that the URL is non-null.
  supabaseAnonKey!, // The anonymous public API key for your Supabase project. The '!' asserts that the key is non-null.
  {
    auth: {
      storage: AsyncStorage, // Specifies AsyncStorage to be used for storing JWT tokens and other authentication related data.
      autoRefreshToken: true, // Enables automatic token refresh. When the JWT expires, this will automatically fetch a new one.
      persistSession: true, // Enables session persistence. This means the user's session will be saved and restored across app restarts.
      detectSessionInUrl: false, // Disables checking the URL for session information. This is useful for platforms like mobile where URL detection is not needed.
    },
  }
);

// Listen for changes in the application's state. This is commonly used in mobile applications to manage resources and behavior when the app is in the foreground or background.
AppState.addEventListener("change", (nextAppState) => {
  if (nextAppState === "active") {
    // If the app state changes to 'active' (app is in the foreground),
    // start automatically refreshing the authentication token.
    supabase.auth.startAutoRefresh();
  } else {
    // If the app state is anything other than 'active' (app goes to the background),
    // stop automatically refreshing the authentication token.
    supabase.auth.stopAutoRefresh();
  }
});
