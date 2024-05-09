// ProfileScreen.tsx
import { supabase } from "@/utils/supabase";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import ProfileCard from "../components/ProfileCard";
import Colors from "@/constants/Colors";


const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
          style={styles.profileImage}
        />
      </View>
      <View style={styles.friendsContainer}>
        <Text>13 friends</Text>
      </View>
      <ProfileCard 
        name="John Doe"
        location="Stanford, CA"
        bio="This is a short bio of John Doe."
        wants="Try new food, go on hikes, and get off campus more often"
        colorScheme="color1"
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  header: {
    width: "100%",
    backgroundColor: Colors.color1.light,
    alignItems: "center",
    marginBottom: 70
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    top: 70,
  },
  friendsContainer: {
    margin: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Profile;
