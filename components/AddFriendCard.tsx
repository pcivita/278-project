import { View, Text, TouchableOpacity } from "react-native";
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
  return (
    <View>
      <Text>{user.username} </Text>
      <TouchableOpacity onPress={onAddFriend}>
        <Text> {status} </Text>
      </TouchableOpacity>
    </View>
  );
};
export default AddFriendCard;
