import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { toZonedTime, format } from 'date-fns-tz';

interface EmptyCalendarDateProps {
  date: string;
}

const EmptyCalendarDate: React.FC<EmptyCalendarDateProps> = ({ date }) => {
  const timeZone = 'America/Los_Angeles';

  // Parse the date string in the given time zone
  const parsedDate = toZonedTime(new Date(date), timeZone);

  // Format the day of the week and date
  const dayOfWeek = format(parsedDate, 'EEE', { timeZone });
  const dayOfMonth = format(parsedDate, 'd', { timeZone });

  return (
    <View style={[styles.container, styles.emptyContainer]}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={[styles.date, styles.emptyDate]}>{dayOfMonth}</Text>
      </View>
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
    height: 90, // Approximate height of an EventItem
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
