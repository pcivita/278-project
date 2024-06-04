import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image, ActivityIndicator } from "react-native";
import Colors from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { MonoText, MonoTextInput } from "@/components/StyledText";
import { supabase } from "@/utils/supabase";
import Alert from "@/components/Alert";


interface CreateAccountProps {
  // navigation: any;
  setCurrentScreen: (screen: string) => void;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CreateAccount: React.FC<CreateAccountProps> = ({ setCurrentScreen }) => {

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  
  const isFormValid = name !== "" && email !== "" && username !== "" && password.length >= 8;
  const passwordMessage = password && password.length < 8;

  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const closeAlert = () => {
    setAlertVisible(false);
  };

  // console.log(setCurrentScreen)

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

  const onSignUpPress = async () => {
    setLoading(true);

    const { error, data: { session } } = await supabase.auth.signUp({
      email,
      password,
    });

    if (name === "" || email === "" || username === "" || password.length < 8) {
      setAlertMessage("Please fill in all fields");
      setAlertVisible(true);
      setLoading(false);
      return;
    }
    else if (error) {
      setAlertMessage(error.message); // todo: change
      setAlertVisible(true);
      setLoading(false);
      return;
    }
    if (!session) {
      setAlertMessage("Session error. Try again"); // todo: change
      setLoading(false);
      return;
    }

    const userId = session.user.id;


    let profilePhotoUrl = "";
    if (profilePhoto) {
      profilePhotoUrl = profilePhoto;
      try {
        // Fetch the file data and convert to Blob
        const response = await fetch(profilePhoto);
        const blob = await response.blob();

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
        setAlertMessage('Error uploading or fetching photo URL:' + photoError);
        setAlertVisible(true);
        setLoading(false);
        return;
      } 
    }
  

    const { error: profileError } = await supabase
      .from('users')
      .update({ username, name, bio, photo: profilePhotoUrl })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating user profile:', profileError);
      setAlertMessage('Error updating user profile');
      setAlertVisible(true);
    }
    setLoading(false);
  }


  return (
    <View style={styles.container}>
      <Alert
        visible={alertVisible}
        message={alertMessage}
        onClose={closeAlert}
      />
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator  size="large" color="white" />
          <MonoText style={styles.overlayText}>Loading...</MonoText>
        </View>
      )}
      <TouchableOpacity
        onPress={() => setCurrentScreen("sign up options")}
        style={styles.backCaret}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleImagePick} style={styles.photoSelection}>
        <Image source={{ uri: profilePhoto || "https://via.placeholder.com/100" }} style={styles.profileImage} />
        <MonoText style={styles.greenText}>Choose Photo</MonoText>
      </TouchableOpacity>
  
      <View style={styles.inputContainer}>
        <MonoText style={styles.text}>Name (First and Last)
          <MonoText style={styles.pinkText}> *</MonoText>
        </MonoText>
        <MonoTextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <MonoText style={styles.text}>Email
          <MonoText style={styles.pinkText}> *</MonoText>
        </MonoText>
        <MonoTextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <MonoText style={styles.text}>Bio</MonoText>
        <MonoTextInput
          style={styles.input}
          placeholder="Tell your friends a little bit about you"
          value={bio}
          onChangeText={setBio}
        />
      </View>
      <View style={[styles.inputContainer, { marginTop: 50, height: 200 }]}>
        <MonoText style={styles.text}>Choose username
          <MonoText style={styles.pinkText}> *</MonoText>
        </MonoText>
        <MonoTextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <MonoText style={styles.text}>Choose password
          <MonoText style={styles.pinkText}> *</MonoText>
        </MonoText>
        <MonoTextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        {passwordMessage && (
          <MonoText style={styles.redText}>Password must be at least 8 characters</MonoText>
        )}
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={onSignUpPress}
      >
        <MonoText style={styles.buttonText}>Create Account</MonoText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 20,
    backgroundColor: "white",
  },
  backCaret: {
    alignSelf: "flex-start",
    marginTop: 70,
    marginLeft: 10,
  },
  photoSelection: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    marginBottom: 5,
  },
  greenText: {
    color: Colors.color2.dark,
    fontSize: 14,
    marginBottom: 20,
  },
  pinkText: {
    color: Colors.color5.dark,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    bottom: 2,
  },
  redText: {
    color: "red",
  },
  inputContainer: {
    width: "90%",
  },
  input: {
    fontSize: 16,
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    width: windowWidth * 0.8,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.color2.dark,
    flexDirection: "row",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    elevation: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    gap: 5,
    paddingTop: 100,
  },
  overlayText: {
    color: "white",
    fontSize: 16,
  }
});


export default CreateAccount;
