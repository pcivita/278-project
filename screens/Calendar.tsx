import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import CalendarDate from "../components/CalendarDate";
import EmptyCalendarDate from "../components/EmptyCalendarDate";

const Calendar = () => {
  // Hardcoded event data
  const events = [
    {
      id: 1,
      title: "Dish Hike with Defne",
      time: "09:00 AM - 10:30 AM",
      date: "2024-05-15",
      imageUrl: "https://example.com/defne.jpg"
    },
    {
      id: 2,
      title: "Dish Hike with Defne",
      time: "09:00 AM - 10:30 AM",
      date: "2024-05-15",
      imageUrl: "https://example.com/defne.jpg"
    },
    {
      id: 3,
      title: "Dish Hike with Defne",
      time: "09:00 AM - 10:30 AM",
      date: "2024-05-15",
      imageUrl: "https://example.com/defne.jpg"
    },
    // Add more events as needed
  ];

  const uniqueDates = [...new Set(events.map(event => event.date))];
  uniqueDates.push("2024-05-16"); // Adding a date with no events

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>May</Text>
      {uniqueDates.map(date => {
        const hasEvents = events.some(event => event.date === date);
        return hasEvents ? (
          <CalendarDate key={date} date={date} events={events} />
        ) : (
          <EmptyCalendarDate key={date} date={date} />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left", // Change text alignment to left
    marginBottom: 10,
    marginLeft: 20, // Add left margin to the title
    marginTop: 20,
    alignSelf: "flex-start", // Ensure the text is aligned to the left within its container
  },
});

export default Calendar;
