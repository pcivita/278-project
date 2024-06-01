import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Auth } from "@/components/AppleAuth.native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "@/types";
import { MonoText } from "@/components/StyledText";
import Colors from "@/constants/Colors";

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
      {/* <TouchableOpacity
        onPress={() => setCurrentScreen("onboarding")}
        style={styles.backCaret}
      >
        <FontAwesome5 name="arrow-left" size={24} color="black" />
      </TouchableOpacity> */}
      {/* <Text style={styles.title}>Get started with Flock today</Text> */}
      <View style={styles.header} />
      <Image source={require("../assets/icons/FlockIcon.png")} style={styles.logo} />
      <MonoText useUltra={true} style={styles.title}>
        Get started with Flock today
      </MonoText>
      <View style={styles.buttonsContainer}>
        <Auth navigation={navigation} signup={true} />
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpManually")}
          style={styles.button}
        >
          <MonoText style={styles.buttonText}>Sign Up with Email</MonoText>
        </TouchableOpacity>
      </View>
      
      <MonoText
        style={styles.submessageText}
        onPress={() => navigation.navigate("Login")}
      >
        Already have an account?<Text style={styles.coloredText}> Log in instead</Text>
      </MonoText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    backgroundColor: Colors.color2.light,
    alignItems: "center",
    height: 200,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: -75,
  },
  title: {
    fontSize: 24,
    marginTop: 80,
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 10,
  },
  subtitle: {
    fontSize: 24,
    marginTop: 14,
    width: windowWidth * 0.7,
    textAlign: "center",
  },
  button: {
    width: windowWidth * 0.8,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.color2.dark,
  },
  buttonText: {
    fontSize: 40 * 0.43,
    color: "white",
  },
  submessageText: {
    fontSize: 14,
    marginTop: 10,
  },
  coloredText: {
    color: Colors.color1.dark,
  }
  // backCaret: {
  //   alignSelf: "flex-start",
  //   marginTop: 50,
  //   width: windowWidth * 0.9,
  //   height: 50,
  // },
});

export default SignUp;
