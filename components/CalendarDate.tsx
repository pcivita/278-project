import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EventItem from "./EventItem";

const CalendarDate = ({ date, events }) => {
  const dateEvents = events.filter(event => event.date === date);
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.date}>{new Date(date).getDate()}</Text>
      </View>
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
    backgroundColor: "#EBF6E5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dateContainer: {
    marginRight: 20,
    alignItems: "center", // Center-aligns day and date
  },
  dayOfWeek: {
    fontSize: 16,
    color: "#666",
  },
  date: {
    fontSize: 40,
    fontWeight: "bold",
  },
  eventList: {
    flex: 1,
  },
});

export default CalendarDate;
