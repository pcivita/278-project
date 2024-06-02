import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import Colors from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { MonoText, MonoTextInput } from "@/components/StyledText";

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

  const handleCreateAccount = () => {
    console.log("creating account")
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setCurrentScreen("sign up")}
        style={styles.backCaret}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      
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
      />
      <MonoTextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <MonoText style={styles.buttonText}>Create Account</MonoText>
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
  backCaret: {
    alignSelf: "flex-start",
    marginTop: 50,
    width: windowWidth * 0.9,
    height: 50,
  },
  photoSelection: {
    alignItems: "center",
    marginTop: 100,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: Colors.color2.dark,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    // width: "100%",
    // padding: 15,
    // backgroundColor: Colors.color2.dark,
    // borderRadius: 5,
    // alignItems: "center",
    width: windowWidth * 0.8,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.color2.dark,
    flexDirection: "row",
    gap: 5,
    paddingRight: 5
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});


export default CreateAccount;
