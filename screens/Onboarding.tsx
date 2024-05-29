import { Link, router } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { Themes } from "../assets/Themes";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import ProfileCard from "../components/ProfileCard";
// import { Profile } from "../components/Profile";
import * as ImagePicker from "expo-image-picker";
// import { UserContext } from "../contexts/UserContext";
// import { ActivityIndicator } from "react-native-paper";
// Removed Firebase storage imports
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { storage } from "../firebase";
import Login from "./Login"

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState("onboarding");
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [fullName, setFullName] = useState("");

  const [onboardingScreenNumber, setOnboardingScreenNumber] = useState(0);
  const flatListRef = useRef(null);

  const ONBOARDING_SCREENS = [
    {
      title: "Create hangouts with friends",
      description:
        "Whether it’s lunch at your dorm, going on a hike, or a game night, create hangouts and invite your friends to join along.",
    },
    {
      title: "Sign up for friends' hangouts",
      description:
        "blah blah blah",
    },
    {
      title: "Have fun!",
      description:
        "blah blah blah",
    },
    {
      title: "Celebrate all the choices being made",
      description:
        "Engage with your friends on Turno to learn about their lives.",
    },
  ];

  const DOTS = [1, 2, 3, 4];

  const renderOnboardingImage = () => {
    switch (onboardingScreenNumber) {
      case 0:
        return (
          <Text>flock start</Text>
          // <Image
          //   source={require("../assets/images/adaptive-icon.png")}
          //   style={{
          //     width: windowWidth,
          //     resizeMode: "contain",
          //   }}
          // />
        );
      case 1:
        return (
          <Text>tutorial 1</Text>
        );
      case 2:
        return (
          <Text>tutorial 2</Text>
        );
      case 3:
        return (
          <Text>tutorial 3</Text>
        );
      case 4:
        return (
          <Text>tutorial 4</Text>
        );
      default:
        return (
          <Text>finalScreen</Text>

        );
    }
  };

  // const { user, logIn, logoutUser, signUp, initializeUserDatabaseEntry } =
  //   useContext(UserContext);
  //   useEffect(() => {
  //     if (user) {
  //       router.replace("/roll");
  //     }
  //   }, [user]);

  const handleLogIn = () => {
    console.log("login")
    // logIn(email, password);
  };

  // Removed image upload function
  // const uploadImage = async (imageUri) => {
  //   try {
  //     const response = await fetch(imageUri);
  //     const blob = await response.blob();

  //     if (blob.size > 32000000) {
  //       Alert.alert(
  //         "Image size exceeds the maximum limit of 32 MB. Please select another image."
  //       );
  //       return null;
  //     }

  //     const uniqueFileName = `${Date.now()}_${Math.floor(
  //       Math.random() * 10000
  //     )}`;
  //     const fileName = `profile_pictures/${uniqueFileName}`;
  //     const storageRef = ref(storage, fileName);

  //     const snapshot = await uploadBytesResumable(storageRef, blob);
  //     const downloadURL = await getDownloadURL(snapshot.ref);

  //     return downloadURL;
  //   } catch (error) {
  //     console.error("Error uploading image: ", error);
  //     return null;
  //   }
  // };

  const handleSignUp = async () => {
    console.log("sign up");


    // setLoading(true);
    // if (email && password) {
    //   try {
    //     const user = await signUp(email, password);
    //     if (user) {
    //       await initializeUserDatabaseEntry(
    //         email,
    //         downloadUrl,
    //         user.uid,
    //         username,
    //         fullName
    //       );

    //       setEmail("");
    //       setPassword("");
    //       setUsername("");
    //       setProfilePicUri(null);

    //       setCurrentScreen("onboarding");
    //     }
    //   } catch (error) {
    //     console.error("Error in sign-up process: ", error);
    //   }
    // }
    // setLoading(false);
  };

  const renderOnboarding = () => {
    return (
      <View style={styles.container}>
        <View style={styles.onboardingSpacing} />
        {onboardingScreenNumber !== 0 && (
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              fontFamily: "Poppins-Bold",
              color: "white",
              marginBottom: 24,
            }}
          >
            Flock
          </Text>
        )}
        {renderOnboardingImage()}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "#fff",
            alignItems: "center",
            width: windowWidth,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: windowHeight * 0.45,
            paddingBottom: 10,
          }}
        >
          {onboardingScreenNumber === 0 ? (
            <View style={styles.firstScreenContainer}>
              <Text style={styles.title}>Flock</Text>
              <Text style={styles.subtitle}>
                Spend time with your friends
              </Text>
              <TouchableOpacity
                style={[styles.primaryButton, { marginTop: 60 }]}
                onPress={() =>
                  setOnboardingScreenNumber(onboardingScreenNumber + 1)
                }
              >
                <Text style={styles.onBoardingButtonText}>Get started</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {onboardingScreenNumber < 5 && (
                <FlatList
                  data={ONBOARDING_SCREENS}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  decelerationRate="fast"
                  showsHorizontalScrollIndicator={false}
                  ref={flatListRef}
                  pagingEnabled
                  snapToInterval={windowWidth * 0.8}
                  scrollEventThrottle={16}
                  onScroll={(event) => {
                    const contentOffsetX = event.nativeEvent.contentOffset.x;
                    const currentIndex = Math.round(
                      contentOffsetX / (windowWidth * 0.8)
                    );
                    setOnboardingScreenNumber(currentIndex + 1);
                  }}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          width: windowWidth * 0.8,
                          flex: 1,
                          alignItems: "center",
                          paddingTop: 10,
                        }}
                      >
                        <Text style={styles.onboardingTitle}>{item.title}</Text>
                        <Text style={styles.onboardingDescription}>
                          {item.description}
                        </Text>
                      </View>
                    );
                  }}
                  style={{
                    width: windowWidth * 0.8,
                    marginTop: 48,
                  }}
                />
              )}
              {onboardingScreenNumber < 5 ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 48,
                    }}
                  >
                    {DOTS.map((dot, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor:
                              index + 1 === onboardingScreenNumber
                                ? "blue"
                                : "lightgrey",
                            marginHorizontal: 4,
                          }}
                        />
                      );
                    })}
                  </View>
                  {onboardingScreenNumber === 4 ? (
                    <TouchableOpacity
                      style={[
                        styles.primaryButton,
                        { marginTop: 24, marginBottom: 36 },
                      ]}
                      onPress={() => {
                        setOnboardingScreenNumber(5);
                      }}
                    >
                      <Text style={styles.onBoardingButtonText}>Continue</Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[
                        styles.primaryButton,
                        {
                          backgroundColor: "white",
                          marginTop: 24,
                          marginBottom: 36,
                        },
                      ]}
                    >
                      <Text style={styles.onBoardingButtonText}>Continue</Text>
                    </View>
                  )}
                </>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      fontWeight: "bold",
                      fontFamily: "Poppins-Bold",
                      color: "black",
                      textAlign: "center",
                      marginTop: 36,
                    }}
                  >
                    Flock
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: "Poppins-Regular",
                      color: "black",
                      marginTop: 24,
                      textAlign: "center",
                    }}
                  >
                    Get rolling on making hard decisions
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderColor: "pink",
                      padding: 12,
                      borderRadius: 999,
                      width: windowWidth * 0.8,
                      alignItems: "center",
                      marginTop: 48,
                      borderWidth: 1,
                    }}
                    onPress={() => setCurrentScreen("log in")}
                  >
                    <Text
                      style={[styles.onBoardingButtonText, { color: "black" }]}
                    >
                      Log in
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => setCurrentScreen("sign up")}
                  >
                    <Text style={styles.onBoardingButtonText}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    );
  };

  const renderLogIn = () => {
    return (
      <View style={styles.whiteContainer}>
        <TouchableOpacity
          onPress={() => setCurrentScreen("onboarding")}
          style={styles.backCaret}
        >
          <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.spacing} />
        {/* <Image
          source={require("../assets/Themes/Images/DiceFaces/Dice-3.png")}
          style={styles.logo}
        /> */}
        <Text>dice 3</Text>
        <Text style={styles.title}>Flock</Text>
        <Text
          style={[
            styles.subtitle,
            { width: 220, fontSize: 20, marginTop: 6, marginBottom: 30 },
          ]}
        >
          Get rolling on making hard decisions
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
          Don't have an account?<Text style={styles.blueText}>Sign Up</Text>
        </Text>
      </View>
    );
  };

  const renderSignUp = () => {
    // const selectPhoto = async () => {
    //   try {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //       mediaTypes: ImagePicker.MediaTypeOptions.All,
    //       allowsEditing: true,
    //       aspect: [4, 4],
    //       quality: 0.5,
    //     });

    //     if (!result.canceled) {
    //       setProfilePicUri(result.assets[0].uri);
    //       // Removed the call to uploadImage
    //       // const downloadURL = await uploadImage(result.assets[0].uri);
    //       // setDownloadUrl(downloadURL);
    //     }
    //   } catch (error) {
    //     console.error("Error picking image: ", error);
    //   }
    // };

    return (
      <View style={styles.whiteContainer}>
        <TouchableOpacity
          onPress={() => setCurrentScreen("onboarding")}
          style={styles.backCaret}
        >
          <FontAwesome5 name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        {/* <Image
          source={require("../assets/Themes/Images/DiceFaces/Dice-3.png")}
          style={styles.logo}
        /> */}
        <Text>dice 3</Text>
        <Text style={styles.title}>Flock</Text>
        <Text
          style={[
            styles.subtitle,
            { width: 220, fontSize: 20, marginTop: 6, marginBottom: 30 },
          ]}
        >
          Get rolling on making hard decisions
        </Text>
        <TouchableOpacity
          style={styles.profileUploader}
          // onPress={() => selectPhoto()}
        >
          {/* <Image
            source={require("../assets/Vectors/EditPencil.png")}
            style={{ position: "absolute", zIndex: 99, right: -5, top: -5 }}
          /> */}
          <Text>edit pencil</Text>
          {profilePicUri ? (
            <Image
              source={{ uri: profilePicUri }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          ) : (
            <Text>profile</Text>
            // <Profile width={100} height={100} />
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text.toLowerCase())}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Full Name (ex: Caleb Liu)"
          onChangeText={(text) => setFullName(text)}
          value={fullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text.toLowerCase())}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text.toLowerCase())}
          value={password}
        />

        <View style={{ height: 32 }} />
        <TouchableOpacity onPress={handleSignUp} style={styles.primaryButton}>
          <Text style={styles.loginText}>Create Account</Text>
        </TouchableOpacity>
        <Text
          style={styles.submessageText}
          onPress={() => setCurrentScreen("log in")}
        >
          Already have an account?<Text style={styles.blueText}> Log In</Text>
        </Text>
      </View>
    );
  };

  switch (currentScreen) {
    case "log in":
      // return renderLogIn();
      return <Login setCurrentScreen={setCurrentScreen} />;
    case "sign up":
      return renderSignUp();
    default:
      return renderOnboarding();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "blue",
    zIndex: 1,
  },
  whiteContainer: {
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
  firstScreenContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    // fontFamily: "Poppins-Bold",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 24,
    marginTop: 14,
    // fontFamily: "Poppins-Regular",
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
    // fontFamily: "Poppins-Regular",
  },
  loginText: {
    fontSize: 16,
    // fontFamily: "Poppins-Bold",
    color: "white",
  },
  submessageText: {
    fontSize: 16,
    // fontFamily: "Poppins-Regular",
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
  onBoardingButtonText: {
    fontSize: 16,
    // fontFamily: "Poppins-SemiBold",
    color: "white",
  },
  onboardingTitle: {
    fontSize: 24,
    // fontFamily: "Poppins-SemiBold",
    width: windowWidth * 0.8,
  },
  onboardingDescription: {
    fontSize: 16,
    // fontFamily: "Poppins-Regular",
    marginTop: 16,
    width: windowWidth * 0.8,
  },
  backCaret: {
    alignSelf: "flex-start",
    marginTop: 50,
    // alignSelf: "flex-start",
    width: windowWidth * 0.9,
    height: 50,
  },
  spacing: {
    height: windowHeight * 0.05,
  },
  onboardingSpacing: {
    height: windowHeight * 0.05,
  },
  profileUploader: {
    marginTop: 16,
  },
  blueText: {
    color: "blue"
  },
});
