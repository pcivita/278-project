import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const EventItem = ({ event }) => {
  return (
    <View style={styles.eventItem}>
      <Image source={{ uri: event.imageUrl }} style={styles.image} />
      <View style={styles.eventDetails}>
        <Text style={styles.title}>{event.title}</Text>
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
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
  },
  time: {
    color: "#666",
  },
});

export default EventItem;
