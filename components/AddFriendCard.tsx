import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    // TODO: Must Check if I'm Clicking on my Own Profile
    navigation.navigate("userProfile", { user: user });
  };

  const { userId } = useUser();
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Friends":
        return styles.accepted;
      case "Add Friend":
        return styles.add;
      case "Requested":
        return styles.pending;
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={goToUserProfile}>
      <MonoText useUltra={true} style={styles.username}>

        {user.username}
      </MonoText>
      {user.id !== userId && (
        <TouchableOpacity
          onPress={onAddFriend}
          style={[styles.friendButton, getStatusStyle(status)]}
        >
          <Text style={{ color: "black", fontWeight: "bold" }}> {status} </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.color2.light,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userText: {
    fontSize: 17,
    color: "white",
  },
  friendButton: {
    padding: 10,
    width: "40%",
    borderRadius: 5,
    alignItems: "center",
  },
  accepted: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.color2.dark,
  },
  add: {
    backgroundColor: Colors.color2.dark,
  },
  pending: {
    backgroundColor: "orange",
  },
  username: {
    fontSize: 17,
    marginTop: 10,
    marginBottom: 5,
  },
});
export default AddFriendCard;
