import { supabase } from "@/utils/supabase";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ProfileCard from "../../components/ProfileCard";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header} />
      <View style={styles.profileImageWrapper}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.username}>@fringe_diddy</Text>
        <Text style={styles.mutualFriends}>13 mutual friends</Text>
      </View>
      <View style={styles.profileCardContainer}>
        <ProfileCard
          name="Defne Genc"
          location="Stanford, CA"
          bio="I’m super free this spring please do fun things w/ me!"
          wants="Grab lunch, go on hikes, pet cats!"
          colorScheme="color2"
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.signOutButton]}>
          <Text
            style={[styles.buttonText, styles.signOutButtonText]}
            onPress={() => supabase.auth.signOut()}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
    paddingBottom: 20,
  },
  header: {
    width: "100%",
    backgroundColor: Colors.color2.light,
    alignItems: "center",
    height: 150, // Adjust this height to move the image further down
  },
  profileImageWrapper: {
    alignItems: "center",
    marginTop: -75, // This moves the profile image up to overlap with the header
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
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  mutualFriends: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  profileCardContainer: {
    width: "95%", // Make the profile card take up 95% of the width
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    width: "45%",
    backgroundColor: Colors.color2.dark,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  signOutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.color2.dark,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  signOutButtonText: {
    color: Colors.color2.dark,
  },
});

export default ProfileScreen;
