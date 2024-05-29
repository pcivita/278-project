import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Auth } from "@/components/AppleAuth.native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "@/types";

interface SignUpProps {
  // navigation: any;
  setCurrentScreen: (screen: string) => void;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const SignUp: React.FC<SignUpProps> = ({  setCurrentScreen }) => {
  const navigation = useNavigation<StackNavigationProp<OnboardingStackParamList>>();

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
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUpManually")}
        style={styles.primaryButton}
      >
        <Text style={styles.loginText}>Sign Up Manually</Text>
      </TouchableOpacity>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Auth navigation={navigation} />
      </View>
      <Text
        style={styles.submessageText}
        onPress={() => navigation.navigate("SignUp")}
      >
        Don't have an account?<Text style={styles.blueText}>Sign Up</Text>
      </Text>
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
  primaryButton: {
    backgroundColor: "pink",
    padding: 10,
    borderRadius: 999,
    width: windowWidth * 0.8,
    alignItems: "center",
    marginTop: 12,
  },
  loginText: {
    fontSize: 16,
    color: "white",
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
});

export default SignUp;
