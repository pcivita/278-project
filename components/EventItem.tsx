import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const EventItem = ({ event }) => {
  const [mainTitle, rest] = event.title.split(" with ");
  const [withText, ultraText] = rest.split(" Defne");

  return (
    <View style={styles.eventItem}>
      <Image
              source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
              style={styles.profileImage}
       />
      <View style={styles.eventDetails}>
        <Text style={styles.title}>
          {mainTitle} <Text style={styles.regular}>with</Text> <Text style={styles.ultra}>Defne</Text>
        </Text>
        <Text style={styles.time}>{event.time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F7FFF2",
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  eventDetails: {
    flex: 1,
  },
  title: {
    fontFamily: 'TripSans-Ultra', // Ultra font for the main title and Defne
    fontWeight: "bold",
  },
  regular: {
    fontFamily: 'TripSans-Regular', // Regular font for "with"
  },
  ultra: {
    fontFamily: 'TripSans-Ultra', // Ultra font for "Defne"
  },
  time: {
    color: "#666",
  },
});

export default EventItem;
