import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { supabase } from "@/utils/supabase";
import { format } from "date-fns";
import { MonoText } from "./StyledText";

const NotificationItem = ({
  type,
  message,
  time,
  requestId,
  profilePictureUrl,
}) => {
  const acceptRequest = async () => {
    try {
      const { data, error } = await supabase
        .from("friends")
        .update({ status: "Friends" })
        .eq("id", requestId);

      if (error) {
        console.error("Error updating request:", error);
        return;
      }

      console.log("Request accepted:", data);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const rejectRequest = async () => {
    try {
      const { data, error } = await supabase
        .from("friends")
        .delete()
        .eq("id", requestId);

      if (error) {
        console.error("Error deleting request:", error);
        return;
      }

      console.log("Request rejected:", data);
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
            <MonoText useMedium={true} style={styles.acceptButtonText}>Accept</MonoText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={rejectRequest}>
            <MonoText useMedium={true} style={styles.buttonText}>Reject</MonoText>
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
          <MonoText key={index} style={styles.boldText}>
            {part}
          </MonoText>
        );
      }
      return part;
    });
  };

  const formattedTime = format(new Date(time), "MMM d, yyyy, HH:mm");

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: profilePictureUrl || "https://via.placeholder.com/50" }}
        style={styles.profileImage}
      />
      <View style={styles.content}>
        <MonoText style={styles.message}>{renderMessage(message)}</MonoText>
        {renderButtons()}
        <MonoText style={styles.time}>{formattedTime}</MonoText>
      </View>
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
    marginRight: 10,
  },
  content: {
    flex: 1,
    justifyContent: "space-around", // Ensure content is spaced evenly
  },
  message: {
    fontSize: 14,
    flexWrap: "wrap",
  },
  boldText: {
    fontFamily: "TripSans-Ultra",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.color2.dark,
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
    marginTop: 5, // Adjusted margin for better spacing
  },
});

export default NotificationItem;
