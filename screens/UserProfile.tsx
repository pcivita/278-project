// // screens/UserProfile.tsx
// import React from "react";
// import { View, Text } from "react-native";
// import { User } from "@/utils/interfaces";
// import { StackScreenProps } from "@react-navigation/stack";

// type UserProfileProps = StackScreenProps<
//   { userProfile: { user: User } },
//   "userProfile"
// >;

// const UserProfile: React.FC<UserProfileProps> = ({ route }) => {
//   const { user } = route.params;

//   return (
    
//     <View>
//       <Text>User Profile</Text>
//       <Text>{user.}</Text>
//       {/* Render other user details */}
//     </View>
//   );
// };

// export default UserProfile;

// screens/UserProfile.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { User } from "@/utils/interfaces";
import { StackScreenProps } from "@react-navigation/stack";
import { MonoText } from "@/components/StyledText";
import ProfileCard from "@/components/ProfileCard";
import Colors from "@/constants/Colors";

type UserProfileProps = StackScreenProps<
  { userProfile: { user: User } },
  "userProfile"
>;

const UserProfile: React.FC<UserProfileProps> = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.profileImageWrapper}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: user.photo || "https://via.placeholder.com/150" }}
            style={styles.profileImage}
            onError={(error) => console.error('Image load error:', error)}
          />
        </View>
        <MonoText useUltra={true} style={styles.username}>
          @{user.username || 'Username'}
        </MonoText>
      </View>
      <View style={styles.profileCardContainer}>
        <ProfileCard
          name={user.name || 'Full Name'}
          location={'Location'}
          bio={user.bio || 'Bio'}
          colorScheme="color2"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "white"
  },
  header: {
    width: "100%",
    backgroundColor: Colors.color2.light,
    alignItems: "center",
    height: 100,
  },
  profileImageWrapper: {
    alignItems: "center",
    marginTop: -75,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  username: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 5,
  },
  profileCardContainer: {
    paddingHorizontal: 10,
    width: "100%",
    alignItems: "center"
  },
});

export default UserProfile;
