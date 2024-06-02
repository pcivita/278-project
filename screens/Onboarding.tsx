import { Link, router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  Image,
  FlatList,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
// import { UserContext } from "../contexts/UserContext";
// import { ActivityIndicator } from "react-native-paper";
import Login from "./Login";
import SignUp from "./SignUp";
import Colors from "@/constants/Colors";
import { MonoText } from "@/components/StyledText";
import EventCard from "@/components/EventCard";

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

  const [onboardingScreenNumber, setOnboardingScreenNumber] = useState(1);
  const flatListRef = useRef(null);

  const ONBOARDING_SCREENS = [
    {
      title: "Welcome to Flock",
      description: "Swipe to get started.",
    },
    {
      title: "Create events to invite your friends to",
      description:
        "For example, lunch at a local restaurant, a hike, a movie night, or anything else!",
    },
    {
      title: "Browse friends' events and join in on the fun",
      description: "Make more time for your good friends and make new friends",
    },
    {
      title: "View your upcoming events by date and month",
      description: "Never miss an upcoming event with your friends",
    },
  ];

  const DOTS = [1, 2, 3, 4];

  const renderOnboardingImage = () => {
    switch (onboardingScreenNumber) {
      case 1:
        return <Image source={require("../assets/icons/FlockIcon.png")} style={styles.logo} />;
      case 2:
        return (
          <View style={styles.onboardingImageContainer}>
            <Image 
              source={require("../assets/images/OnboardingImage1.png")} 
              resizeMode="contain" 
              style={styles.onboardingImage}/>
          </View>
        )
      case 3:
        return (
          <View style={styles.onboardingImageContainer}>
            <Image 
              source={require("../assets/images/OnboardingImage2.png")} 
              resizeMode="contain" 
              style={[styles.onboardingImage, { bottom: 140 }]}
            />
          </View>
        )
      case 4:
        return <Text>tutorial 4</Text>;
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
    console.log("login");
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
      <View style={[styles.container]}>
        <View style={styles.onboardingSpacing} />
        {renderOnboardingImage()}
        <View 
          style={[
            styles.bottomSheet, 
            onboardingScreenNumber === 1 && {backgroundColor: Colors.color1.light}, 
            onboardingScreenNumber === 2 && {backgroundColor: Colors.color5.light},
            onboardingScreenNumber === 3 && {backgroundColor: Colors.color3.light},
            onboardingScreenNumber === 4 && {backgroundColor: Colors.color2.light},
          ]}
        >
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
              style={styles.flatlist}
              onScroll={(event) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const currentIndex = Math.round(
                  contentOffsetX / (windowWidth * 0.8)
                );
                setOnboardingScreenNumber(currentIndex + 1);
              }}
              renderItem={({ item }) => {
                return (
                  <View style={styles.bottomSheetContent}>
                    <MonoText useUltra={true} style={styles.onboardingTitle}>
                      {item.title}
                    </MonoText>
                    <MonoText style={styles.onboardingDescription}>
                      {item.description}
                    </MonoText>
                  </View>
                );
              }}
            />
          )}
          <View style={styles.dotsContainer}>
            {DOTS.map((dot, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index + 1 === onboardingScreenNumber && {
                      backgroundColor: Colors.color1.dark,
                    },
                  ]}
                />
              );
            })}
          </View>
          {onboardingScreenNumber === 4 ? (
            <TouchableOpacity
              style={styles.onboardingButton}
              // onPress={() => {setOnboardingScreenNumber(5)}}
              onPress={() => setCurrentScreen("sign up")}
            >
              <MonoText useUltra={true} style={styles.onBoardingButtonText}>
                Continue
              </MonoText>
            </TouchableOpacity>
          ) : (
            <View style={styles.onboardingButtonPlaceholder} />
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
      return <Login setCurrentScreen={setCurrentScreen} />;
    case "sign up":
      return <SignUp setCurrentScreen={setCurrentScreen} />;
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
    backgroundColor: "white",
    zIndex: 1,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    alignItems: "center",
    width: windowWidth,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: windowHeight * 0.4,
    paddingBottom: 10,

    elevation: 20, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  flatlist: {
    width: windowWidth * 0.8,
    minHeight: 150,
    maxHeight: 150,
    marginTop: 48,
    // backgroundColor: "pink"
  },
  bottomSheetContent: {
    width: windowWidth * 0.8,
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: 10,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginBottom: -10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "lightgrey",
    marginHorizontal: 4,
  },
  onboardingImageContainer: {
    height: windowHeight * 0.5,
    flexDirection: "row",
    width: windowWidth * 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  onboardingImage: {
    width: windowWidth * 0.9,
  },



  whiteContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "white",
  },
  logo: {
    width: 250,
    height: 250,
    marginTop: 100,
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
  spacing: {
    marginTop: 24,
    marginBottom: 36,
    height: 45,
  },
  onboardingButton: {
    backgroundColor: Colors.color2.dark,
    padding: 10,
    borderRadius: 999,
    width: windowWidth * 0.8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 36,
    height: 45,
  },
  onboardingButtonPlaceholder: {
    width: 200,
    height: 50,
    backgroundColor: 'transparent',
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
    fontSize: 18,
    color: "white",
  },
  onboardingTitle: {
    fontSize: 24,
    width: windowWidth * 0.75,
    textAlign: "center",
  },
  onboardingDescription: {
    fontSize: 16,
    marginTop: 16,
    width: windowWidth * 0.75,
    textAlign: "center",
  },
  backCaret: {
    alignSelf: "flex-start",
    marginTop: 50,
    // alignSelf: "flex-start",
    width: windowWidth * 0.9,
    height: 50,
  },
  // spacing: {
  //   height: windowHeight * 0.05,
  // },
  onboardingSpacing: {
    height: windowHeight * 0.05,
  },
  profileUploader: {
    marginTop: 16,
  },
  blueText: {
    color: "blue",
  },
});
