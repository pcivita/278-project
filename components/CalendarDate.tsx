import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EventItem from "./EventItem";
import { toZonedTime, format } from 'date-fns-tz';
import Colors from "@/constants/Colors";

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
  console.log("date: ", date);
  const string_date = date.toString();
  // const month = string_date.slice(5,7);
  // const date_of_month = string_date.slice(8,10);
  const month = parseInt(string_date.slice(5, 7), 10).toString();
  const date_of_month = parseInt(string_date.slice(8, 10), 10).toString();
  console.log("stringify:", date.toString());
  console.log("month: ", month);
  console.log("day: ", date_of_month);
  const timeZone = 'America/Los_Angeles';


  // Parse the date string in the given time zone
  // console.log("parsed Date: ", parsedDate)
  //const string_date = parsedDate.toString()
  

  // Format the day of the week and date
  // const dayOfWeek = format(parsedDate, 'EEE');
  // const dayOfMonth = format(parsedDate, 'd');
  // console.log("parsed day of week: ", dayOfWeek);
  // console.log("parsed DATE", dayOfMonth);
  // console.log("parsed string: ", string_date);
  // console.log("parsed date: ", string_date.slice(8,10));


  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        {/* <Text style={styles.dayOfWeek}>{dayOfWeek}</Text> */}
        <Text style={styles.date}>{date_of_month}</Text>
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
    backgroundColor: Colors.color2.light,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
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



