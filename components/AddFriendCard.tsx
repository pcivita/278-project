import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { User } from "@/utils/interfaces";
import { useUser } from "@/UserContext";
import { MonoText } from "./StyledText";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface AddFriendCardProps {
  user: User;
  onAddFriend: () => void; // Callback function for adding a friend
  status: string;
}

type RootStackParamList = {
  userProfile: { user: User };
  // other routes...
};

const AddFriendCard: React.FC<AddFriendCardProps> = ({
  user,
  onAddFriend,
  status,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const goToUserProfile = () => {
    navigation.navigate("userProfile", { user: user });
  };

  const { userId } = useUser();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Friends":
        return styles.friendsButton;
      case "Add Friend":
        return styles.addButton;
      case "Requested":
        return styles.requestedButton;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Friends":
        return "Friends!";
      case "Add Friend":
        return "Add Friend";
      case "Requested":
        return "Requested";
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.profileSection} onPress={goToUserProfile}>
        <Image source={{ uri: user.photo || 'https://via.placeholder.com/50' }} style={styles.profileImage} />
        <View>
          <MonoText useUltra={true} style={styles.username}>
            {user.name}
          </MonoText>
          <Text style={styles.userHandle}>@{user.username}</Text>
        </View>
      </TouchableOpacity>
      {user.id !== userId && (
        <TouchableOpacity
          onPress={onAddFriend}
          style={[styles.friendButton, getStatusStyle(status)]}
        >
          <Text style={styles.friendButtonText}> {getStatusText(status)} </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F7F7",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userHandle: {
    fontSize: 14,
    color: "#666",
  },
  friendButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  friendsButton: {
    backgroundColor: "#D3E3D8",
  },
  addButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  requestedButton: {
    backgroundColor: "#E0E0E0",
  },
  friendButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default AddFriendCard;
