import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EmptyCalendarDate = ({ date }) => {
  return (
    <View style={[styles.container, styles.emptyContainer]}>
      <Text style={[styles.date, styles.emptyDate]}>{new Date(date).getDate()}</Text>
      <View style={styles.eventList}>
        <Text style={styles.noEventsText}>No events.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    backgroundColor: "#eaf0ea",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  emptyContainer: {
    height: 70, // Approximate height of an EventItem
  },
  date: {
    fontSize: 40,
    fontWeight: "bold",
    marginRight: 20,
  },
  emptyDate: {
    opacity: 0.5,
  },
  eventList: {
    flex: 1,
  },
  noEventsText: {
    color: "#666",
    fontSize: 16,
  },
});

export default EmptyCalendarDate;
