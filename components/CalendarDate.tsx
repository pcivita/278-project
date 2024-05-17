import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EventItem from "./EventItem";
import { toZonedTime, format } from 'date-fns-tz';

interface Event {
  id: string;
  event_name: string;
  event_start: string;
  event_end: string;
  location: string;
  host: string;
  max_people: number;
  signups: number;
  current_signups: number;
  group_id: string;
  creator_id: string;
  isAttending: boolean;
  event_date: string;
}

interface CalendarDateProps {
  date: string;
  events: Event[];
}

const CalendarDate: React.FC<CalendarDateProps> = ({ date, events }) => {
  const timeZone = 'America/Los_Angeles';

  // Parse the date string in the given time zone
  const parsedDate = toZonedTime(new Date(date), timeZone);

  // Format the day of the week and date
  const dayOfWeek = format(parsedDate, 'EEE', { timeZone });
  const dayOfMonth = format(parsedDate, 'd', { timeZone });

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayOfWeek}>{dayOfWeek}</Text>
        <Text style={styles.date}>{dayOfMonth}</Text>
      </View>
      <View style={styles.eventList}>
        {events.map(event => (
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
