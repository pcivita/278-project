import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { User } from "@/utils/interfaces";

interface AddFriendCardProps {
  user: User;
  onAddFriend: () => void; // Callback function for adding a friend
  status: string;
}

const AddFriendCard: React.FC<AddFriendCardProps> = ({
  user,
  onAddFriend,
  status,
}) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "accepted":
        return styles.accepted;
      case "add":
        return styles.add;
      case "pending":
        return styles.pending;
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.userText}>{user.username} </Text>
      {status !== "accepted" && (
        <TouchableOpacity
          onPress={onAddFriend}
          style={[styles.friendButton, getStatusStyle(status)]}
        >
          <Text> {status} </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#4a7b9d",
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
    borderRadius: 5,
    alignItems: "center",
  },
  accepted: {
    backgroundColor: "green",
  },
  add: {
    backgroundColor: "red",
  },
  pending: {
    backgroundColor: "orange",
  },
});
export default AddFriendCard;
