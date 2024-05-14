import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import EventItem from "./EventItem";

const CalendarDate = ({ date, events }) => {
  const dateEvents = events.filter(event => event.date === date);

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{new Date(date).getDate()}</Text>
      <View style={styles.eventList}>
        {dateEvents.map(event => (
          <EventItem key={event.id} event={event} />
        ))}
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
  date: {
    fontSize: 40,
    fontWeight: "bold",
    marginRight: 20,
  },
  eventList: {
    flex: 1,
  },
});

export default CalendarDate;
