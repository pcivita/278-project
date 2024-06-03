import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ProfileCard from "../../components/ProfileCard";
import Colors from "@/constants/Colors";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { MonoText } from "@/components/StyledText";
import { RootStackParamList, UserProfile } from "./types";
import { supabase } from "@/utils/supabase";

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [friendCount, setFriendCount] = useState<number>(0);

  const fetchUserProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      setLoading(false);
      return;
    }

    const userId = data.user.id;
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    } else {
      console.log("Profile data fetched:", profileData);
      setUserProfile(profileData);
      fetchFriendCount(userId); // Fetch friend count when user profile is fetched
    }
    setLoading(false);
  };

  const fetchFriendCount = async (userId: string) => {
    const { count, error } = await supabase
      .from("friends")
      .select("*", { count: "exact" })
      .or(`user_requested.eq.${userId},user_accepted.eq.${userId}`)
      .eq("status", "Friends");

    if (error) {
      console.error("Error fetching friend count:", error);
    } else {
      console.log("Friend count fetched:", count);
      setFriendCount(count || 0);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const goToFriends = () => {
    navigation.navigate("Friends");
  };

  const goToEditProfile = () => {
    if (userProfile) {
      navigation.navigate("EditProfile", { userProfile });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text>Error fetching profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.profileImageWrapper}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: userProfile.photo || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
            onError={(error) => console.error("Image load error:", error)}
          />
        </View>
        <MonoText useUltra={true} style={styles.username}>
          @{userProfile.username || "username"}
        </MonoText>
        <TouchableOpacity onPress={goToFriends}>
          <MonoText style={styles.mutualFriends}>
            {friendCount} friends
          </MonoText>
        </TouchableOpacity>
      </View>
      <View style={styles.profileCardContainer}>
        <ProfileCard
          name={userProfile.name || "Full Name"}
          location={"Location"}
          bio={userProfile.bio || "Bio"}
          colorScheme="color2"
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={goToEditProfile}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.signOutButton]}
          onPress={() => supabase.auth.signOut()}
        >
          <Text style={[styles.buttonText, styles.signOutButtonText]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    backgroundColor: Colors.color2.light,
    alignItems: "center",
    height: 100,
  },
  profileImageWrapper: {
    alignItems: "center",
    marginTop: -75,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  username: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5,
  },
  mutualFriends: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  profileCardContainer: {
    paddingHorizontal: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    width: "49%",
    backgroundColor: Colors.color2.dark,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.color2.dark,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signOutButtonText: {
    color: "black",
  },
});

export default ProfileScreen;
