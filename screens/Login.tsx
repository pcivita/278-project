import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Auth } from "@/components/AppleAuth.native";

interface LoginProps {
  navigation: any;
  setCurrentScreen: (screen: string) => void;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Login: React.FC<LoginProps> = ({ navigation, setCurrentScreen }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogIn = () => {
    console.log("login");
    // logIn(email, password);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setCurrentScreen("onboarding")}
        style={styles.backCaret}
      >
        <FontAwesome5 name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.spacing} />
      <Text>flock logo</Text>
      <Text style={styles.title}>Flock</Text>
      <Text
        style={[
          styles.subtitle,
          { width: 220, fontSize: 20, marginTop: 6, marginBottom: 30 },
        ]}
      >
        Hang out with your friends
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text.toLowerCase())}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <View style={{ height: 32 }} />
      <TouchableOpacity onPress={handleLogIn} style={styles.secondaryButton}>
        <Text style={styles.loginText}>Log In</Text>
      </TouchableOpacity>
      <Text
        style={styles.submessageText}
        onPress={() => setCurrentScreen("sign up")}
      >
        Don't have an account?<Text style={styles.blueText}> Sign Up</Text>
      </Text>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Auth navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 24,
    marginTop: 14,
    width: windowWidth * 0.7,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "green",
    padding: 10,
    marginVertical: 5,
    color: "#000",
  },
  loginText: {
    fontSize: 16,
    color: "white",
  },
  submessageText: {
    fontSize: 16,
    color: "gray",
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: "pink",
    padding: 10,
    borderRadius: 999,
    width: windowWidth * 0.8,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButton: {
    backgroundColor: "pink",
    padding: 10,
    borderRadius: 999,
    width: windowWidth * 0.8,
    alignItems: "center",
    marginTop: 12,
  },
  backCaret: {
    alignSelf: "flex-start",
    marginTop: 50,
    width: windowWidth * 0.9,
    height: 50,
  },
  spacing: {
    height: windowHeight * 0.05,
  },
  blueText: {
    color: "blue",
  },
});

export default Login;
