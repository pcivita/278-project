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

    const { error: profileError } = await supabase
      .from('users')
      .update({ username, name, bio })
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
      <View style={[styles.inputContainer, { height: 170 }]}>
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
    marginTop: 50
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
    width: windowWidth * 0.9,
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
