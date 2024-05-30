import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import CalendarDate from "../components/CalendarDate";
import EmptyCalendarDate from "../components/EmptyCalendarDate";
import { supabase } from "@/utils/supabase";
import { toZonedTime, format } from "date-fns-tz";
import { useUser } from "@/UserContext";

// TODO: Sort Events
// TODO:
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
  event_month: string; // Add event_month to the Event interface
}

const Calendar = () => {
  const [eventsByMonth, setEventsByMonth] = useState<
    Record<string, Record<string, Event[]>>
  >({});
  const { userId } = useUser();

  useEffect(() => {
    fetchEvents();

    const subscription = supabase
      .channel("event_signup")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "event_signup" },
        handleInsert
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "event_signup" },
        handleDelete
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchEvents = async () => {
    const { data: eventSignupData, error: eventSignupError } = await supabase
      .from("event_signup")
      .select("event_id")
      .eq("user_id", userId);

    if (eventSignupError) {
      console.error("Error fetching event signups:", eventSignupError);
      return;
    }

    const eventIds = (eventSignupData as { event_id: string }[]).map(
      (signup) => signup.event_id
    );

    if (eventIds.length === 0) {
      setEventsByMonth({});
      return;
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from("event")
      .select("*")
      .in("id", eventIds);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return;
    }

    const formattedEvents = formatEvents(eventsData);
    setEventsByMonth(formattedEvents);
  };

  const formatEvents = (eventsData: Event[]) => {
    const timeZone = "America/Los_Angeles";
    const eventsByMonth: Record<string, Record<string, Event[]>> = {};

    eventsData.forEach((event) => {
      const eventStartPST = toZonedTime(new Date(event.event_start), timeZone);
      const eventEndPST = toZonedTime(new Date(event.event_end), timeZone);
      const eventStartFormatted = format(eventStartPST, "yyyy-MM-dd h:mm a", {
        timeZone,
      });
      const eventEndFormatted = format(eventEndPST, "h:mm a", { timeZone });
      const eventDate = format(eventStartPST, "yyyy-MM-dd", { timeZone });
      const eventMonth = format(eventStartPST, "MMMM", { timeZone });

      const formattedEvent = {
        ...event,
        event_start: eventStartFormatted,
        event_end: eventEndFormatted,
        event_date: eventDate,
        event_month: eventMonth,
      };

      if (!eventsByMonth[eventMonth]) {
        eventsByMonth[eventMonth] = {};
      }

      if (!eventsByMonth[eventMonth][eventDate]) {
        eventsByMonth[eventMonth][eventDate] = [];
      }

      eventsByMonth[eventMonth][eventDate].push(formattedEvent);
    });

    return eventsByMonth;
  };

  const handleInsert = async (payload) => {
    if (payload.new.user_id === userId) {
      const { data: eventData, error: eventError } = await supabase
        .from("event")
        .select("*")
        .eq("id", payload.new.event_id)
        .single();

      if (eventError) {
        console.error("Error fetching event:", eventError);
        return;
      }

      const formattedEvent = formatEvents([eventData]);
      setEventsByMonth((prevEventsByMonth) => {
        const newEventsByMonth = { ...prevEventsByMonth };

        Object.keys(formattedEvent).forEach((month) => {
          if (!newEventsByMonth[month]) {
            newEventsByMonth[month] = {};
          }
          Object.keys(formattedEvent[month]).forEach((date) => {
            if (!newEventsByMonth[month][date]) {
              newEventsByMonth[month][date] = [];
            }
            newEventsByMonth[month][date].push(...formattedEvent[month][date]);
          });
        });

        return newEventsByMonth;
      });
    }
  };

  const handleDelete = (payload) => {
    if (payload.old.user_id === userId) {
      setEventsByMonth((prevEventsByMonth) => {
        const newEventsByMonth = { ...prevEventsByMonth };

        Object.keys(newEventsByMonth).forEach((month) => {
          Object.keys(newEventsByMonth[month]).forEach((date) => {
            newEventsByMonth[month][date] = newEventsByMonth[month][
              date
            ].filter((event) => event.id !== payload.old.event_id);
            if (newEventsByMonth[month][date].length === 0) {
              delete newEventsByMonth[month][date];
            }
          });
          if (Object.keys(newEventsByMonth[month]).length === 0) {
            delete newEventsByMonth[month];
          }
        });

        return newEventsByMonth;
      });
    }
  };

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const sortedMonths = Object.keys(eventsByMonth).sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );

  if (Object.keys(eventsByMonth).length === 0) {
    return <Text>No events found</Text>;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: "white" }}
    >
      {sortedMonths.map((month) => (
        <View key={`month-${month}`}>
          <Text style={styles.title}>{month}</Text>
          {Object.keys(eventsByMonth[month]).map((date) => {
            const dateEvents = eventsByMonth[month][date];
            return dateEvents.length > 0 ? (
              <CalendarDate
                key={`calendar-date-${date}`}
                date={date}
                events={dateEvents}
              />
            ) : (
              <EmptyCalendarDate
                key={`empty-calendar-date-${date}`}
                date={date}
              />
            );
          })}
        </View>
      ))}
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
    textAlign: "left",
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 20,
    alignSelf: "flex-start",
  },
});

export default Calendar;
