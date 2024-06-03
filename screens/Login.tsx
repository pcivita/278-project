import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Colors from "@/constants/Colors";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { MonoText, MonoTextInput } from "@/components/StyledText";
import { supabase } from "@/utils/supabase";
import Alert from "@/components/Alert";

interface LoginProps {
  setCurrentScreen: (screen: string) => void;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Login: React.FC<LoginProps> = ({ setCurrentScreen }) => {

  const [email, setemail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  
  // const isFormValid = email !== "" && password != "";
  // const wrongLogin = true; // TODO: 

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  
  const [loading, setLoading] = useState(false);
  const onLoginPress = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
    }
    setLoading(false);
  }

  const closeAlert = () => {
    setAlertVisible(false);
  };

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
        onPress={() => setCurrentScreen("log in options")}
        style={styles.backCaret}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>  
      <View style={styles.header}>
        <MonoText useUltra={true} style={styles.headerText}>Log in to your account</MonoText>
      </View>
      <View style={styles.inputContainer}>
        <MonoText style={styles.text}>Email</MonoText>
        <MonoTextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setemail}
        />
        <MonoText style={styles.text}>Password</MonoText>
        <MonoTextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {/* {wrongLogin && (
          <MonoText style={styles.redText}>The email/username or password you entered is incorrect.</MonoText>
        )} */}
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={onLoginPress}
      >
        <MonoText style={styles.buttonText}>Sign In</MonoText>
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
  header: {
    marginTop: 100,
    width: "90%"
  },
  headerText: {
    fontSize: 24,
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
    marginTop: 50,
    height: 200,
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    gap: 5,
    paddingTop: 100,
  },
  overlayText: {
    color: "white",
    fontSize: 16,
  }
});


export default Login;
