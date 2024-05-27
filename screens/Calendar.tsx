import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import CalendarDate from "../components/CalendarDate";
import EmptyCalendarDate from "../components/EmptyCalendarDate";
import { supabase } from '@/utils/supabase';
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
  event_date: string; // Add event_date to the Event interface
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [uniqueDates, setUniqueDates] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }

    const userId = userData.user.id;

    const { data: eventSignupData, error: eventSignupError } = await supabase
      .from('event_signup')
      .select('event_id')
      .eq('user_id', userId);

    if (eventSignupError) {
      console.error('Error fetching event signups:', eventSignupError);
      return;
    }

    const eventIds = (eventSignupData as { event_id: string }[]).map(signup => signup.event_id);

    if (eventIds.length === 0) {
      setEvents([]);
      setUniqueDates([]);
      return;
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from('event')
      .select('*')
      .in('id', eventIds);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return;
    }

    const timeZone = 'America/Los_Angeles';

    const formattedEvents = (eventsData as Event[]).map(event => {
      const eventStartPST = toZonedTime(new Date(event.event_start), timeZone);
      const eventEndPST = toZonedTime(new Date(event.event_end), timeZone);
      const eventStartFormatted = format(eventStartPST, 'yyyy-MM-dd h:mm a', { timeZone });
      const eventEndFormatted = format(eventEndPST, 'h:mm a', { timeZone });
      const eventDate = format(eventStartPST, 'yyyy-MM-dd', { timeZone });

      return {
        ...event,
        event_start: eventStartFormatted,
        event_end: eventEndFormatted,
        event_date: eventDate, // Add event_date to each event
      };
    });

    const dates = Array.from(new Set(formattedEvents.map(event => event.event_date)));

    console.log('Formatted Events:', formattedEvents); // Debugging
    console.log('Unique Dates:', dates); // Debugging

    setEvents(formattedEvents);
    setUniqueDates(dates);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: "white" }}>
      <Text style={styles.title}>May</Text>
      {uniqueDates.map(date => {
        const dateEvents = events.filter(event => event.event_date === date);
        console.log('Date:', date, 'Date Events:', dateEvents); // Debugging
        return dateEvents.length > 0 ? (
          <CalendarDate key={`calendar-date-${date}`} date={date} events={dateEvents} />
        ) : (
          <EmptyCalendarDate key={`empty-calendar-date-${date}`} date={date} />
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



  // const events = [
  //   {
  //     id: 1,
  //     title: "Dish Hike with Defne",
  //     time: "09:00 AM - 10:30 AM",
  //     date: "2024-05-15",
  //     imageUrl: "https://example.com/defne.jpg"
  //   },
  //   {
  //     id: 2,
  //     title: "Dish Hike with Defne",
  //     time: "09:00 AM - 10:30 AM",
  //     date: "2024-05-15",
  //     imageUrl: "https://example.com/defne.jpg"
  //   },
  //   {
  //     id: 3,
  //     title: "Dish Hike with Defne",
  //     time: "09:00 AM - 10:30 AM",
  //     date: "2024-05-15",
  //     imageUrl: "https://example.com/defne.jpg"
  //   },
  //   // Add more events as needed
  // ];
  // const uniqueDates = [...new Set(events.map(event => event.date))];
  // uniqueDates.push("2024-05-16"); // Adding a date with no events