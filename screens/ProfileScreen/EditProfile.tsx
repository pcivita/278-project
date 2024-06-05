import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { supabase } from "@/utils/supabase";
import * as ImagePicker from 'expo-image-picker';
import Colors from "@/constants/Colors";
import { useNavigation, NavigationProp, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList, UserProfile } from "./types"; // Adjust the path as needed
import { MonoText, MonoTextInput } from "@/components/StyledText";
import Alert from "@/components/Alert";

type EditProfileScreenRouteProp = RouteProp<RootStackParamList, 'EditProfile'>;

const windowWidth = Dimensions.get("window").width;

const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<EditProfileScreenRouteProp>();
  const { userProfile, setAlertVisible, setAlertMessage } = route.params;

  const [name, setName] = useState<string>(userProfile.name || '');
  const [bio, setBio] = useState<string>(userProfile.bio || '');
  const [username, setUsername] = useState<string>(userProfile.username || '');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(userProfile.photo || null);

  const [alertVisible, setLocalAlertVisible] = useState(false);
  const [alertMessage, setLocalAlertMessage] = useState("");

  const closeAlert = () => {
    setLocalAlertVisible(false);
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const pickedPhoto = result.assets[0].uri; // Access the uri from the assets array
      setProfilePhoto(pickedPhoto);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Fetching user data...");
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        setLocalAlertMessage('Error fetching user');
        setLocalAlertVisible(true);
        return;
      }

      const userId = data.user.id;
      console.log("User ID:", userId);

      let profilePhotoUrl = profilePhoto;
      if (profilePhoto && profilePhoto !== userProfile.photo) {
        try {
          console.log("Profile photo selected:", profilePhoto);

          // Fetch the file data and convert to Blob
          const response = await fetch(profilePhoto);
          const blob = await response.blob();
          console.log("Blob created:", blob);

          const formData = new FormData();
          formData.append('file', {
            uri: profilePhoto,
            name: `${Date.now()}.jpg`,
            type: 'image/jpeg',
          } as any);  // 'any' type assertion to bypass TypeScript error

          const filePath = `${userId}/${Date.now()}.jpg`;
          console.log("File path for upload:", filePath);

          // Upload the FormData using the Supabase storage API
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profile_photos')
            .upload(filePath, formData as any, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            console.error('Error uploading photo:', uploadError);
            throw uploadError;
          }

          console.log("Photo uploaded:", uploadData);

          // Construct the public URL
          const { data: publicUrlData, error: urlError } = supabase.storage
            .from('profile_photos')
            .getPublicUrl(filePath);

          if (urlError) {
            console.error('Error getting public URL:', urlError);
            throw urlError;
          }

          profilePhotoUrl = publicUrlData.publicUrl;
          console.log("Public URL of uploaded photo:", profilePhotoUrl);
        } catch (photoError) {
          console.error('Error uploading or fetching photo URL:', photoError);
          setLocalAlertMessage('Error uploading photo');
          setLocalAlertVisible(true);
          return;
        } 
      }

      console.log("Updating user profile...");
      const { error: updateError } = await supabase
        .from('users')
        .update({ name, bio, username, photo: profilePhotoUrl }) // Ensure the column name matches your database schema
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        setLocalAlertMessage('Error updating profile');
        setLocalAlertVisible(true);
      } else {
        console.log("Profile updated successfully");
        setAlertMessage('Profile updated successfully');
        setAlertVisible(true);
        navigation.goBack();
      }
    } catch (mainError) {
      console.error('Error in handleSave:', mainError);
      setLocalAlertMessage('An unexpected error occurred');
      setLocalAlertVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Alert
        visible={alertVisible}
        message={alertMessage}
        onClose={closeAlert}
      />
      <TouchableOpacity onPress={handleImagePick} style={styles.photoSelection}>
        <Image source={{ uri: profilePhoto || "https://via.placeholder.com/150" }} style={styles.profileImage} />
        <MonoText style={styles.changePhotoText}>Change Photo</MonoText>
      </TouchableOpacity>
      <MonoTextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <MonoTextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <MonoTextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <MonoText useMedium={true} style={styles.buttonText}>Save</MonoText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  photoSelection: {
    alignItems: "center"
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    fontSize: 16,
    color: Colors.color2.dark,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: windowWidth * 0.9,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.color2.dark,
    flexDirection: "row",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default EditProfileScreen;
