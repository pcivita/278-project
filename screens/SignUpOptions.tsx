import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { Auth } from "@/components/AppleAuth.native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "@/types";
import { MonoText } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';

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
          // onPress={() => navigation.navigate("CreateAccount")}
          onPress={() => setCurrentScreen("create account")}
          style={styles.button}
        >
          <Ionicons name="mail" size={15} color="white" />
          <MonoText style={styles.buttonText}>Sign up with Email</MonoText>
        </TouchableOpacity>
      </View>
      
      <MonoText style={styles.submessageText} >
        Already have an account?{" "} 
        <MonoText 
          style={styles.coloredText} 
          onPress={() => setCurrentScreen("log in options")}
        > 
          Login instead
        </MonoText>
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
    height: 300,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: -75,
  },
  title: {
    fontSize: 24,
    marginTop: 100,
  },
  buttonsContainer: {
    marginTop: 50,
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
    flexDirection: "row",
    gap: 5,
    paddingRight: 5
  },
  buttonText: {
    fontSize: 40 * 0.43,
    color: "white",
  },
  submessageText: {
    fontSize: 16,
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
