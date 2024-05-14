import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/utils/supabase";

interface UserContextProps {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: user, error: authError } = await supabase.auth.getUser();

      if (authError) {
        console.error("Authentication error:", authError);
        return;
      }

      if (user.user?.id) {
        setUserId(user.user.id);
      } else {
        console.error("User is not logged in or ID is unavailable.");
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
