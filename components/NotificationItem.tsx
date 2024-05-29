import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { supabase } from "@/utils/supabase";

const NotificationItem = ({ type, message, time, requestId }) => {
  const acceptRequest = async () => {
    try {
      const { data, error } = await supabase
        .from("friends")
        .update({ status: "Friends" }) // Update the status to "Accepted"
        .eq("id", requestId); // Ensure you are updating the correct request ID

      if (error) {
        console.error("Error updating request:", error);
        return;
      }

      console.log("Request accepted:", data);
      // Optionally, update the local state or UI to reflect the change
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const rejectRequest = async () => {
    try {
      const { data, error } = await supabase
        .from("friends")
        .delete()
        .eq("id", requestId); // Ensure you are deleting the correct request ID

      if (error) {
        console.error("Error deleting request:", error);
        return;
      }

      console.log("Request rejected:", data);
      // Optionally, update the local state or UI to reflect the change
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const renderButtons = () => {
    if (type === "friend_request") {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={acceptRequest}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={rejectRequest}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const boldWords = ["Defne", "Annie", "Dish Hike"];

  const renderMessage = (message) => {
    const regex = new RegExp(`(${boldWords.join("|")})`, "gi");
    const parts = message.split(regex);

    return parts.map((part, index) => {
      if (
        boldWords.map((word) => word.toLowerCase()).includes(part.toLowerCase())
      ) {
        return (
          <Text key={index} style={styles.boldText}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://via.placeholder.com/50" }} // Replace with actual image URI
        style={styles.profileImage}
      />
      <View style={styles.content}>
        <Text style={styles.message}>{renderMessage(message)}</Text>
        {renderButtons()}
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: "#333",
    flexWrap: "wrap",
  },
  boldText: {
    fontFamily: "TripSans-Ultra", // Ensure this font is correctly loaded in your project
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: Colors.color2.dark,
    borderWidth: 1,
    borderColor: Colors.color2.dark,
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
  },
  acceptButtonText: {
    fontSize: 14,
    color: "#fff",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
});

export default NotificationItem;
