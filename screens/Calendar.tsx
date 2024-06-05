import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import CalendarDate from "../components/CalendarDate";
import EmptyCalendarDate from "../components/EmptyCalendarDate";
import { supabase } from "@/utils/supabase";
import { format } from "date-fns";
import { useUser } from "@/UserContext";
import { MonoText } from "@/components/StyledText";


interface Event {
  id: string;
  event_name: string;
  event_start: string;
  event_end: string;
  location: string;
  max_people: number;
  signups: number;
  current_signups: number;
  group_id: string;
  creator_id: string;
  isAttending: boolean;
  event_date: string;
  event_month: string;
}

const Calendar = () => {
  const [eventsByMonth, setEventsByMonth] = useState<
    Record<string, Record<string, Event[]>>
  >({});
  const { userId } = useUser();
  const nowUTC = new Date().toISOString();

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

    const { data: createdEventsData, error: createdEventsError } =
      await supabase.from("event").select("id").eq("creator_id", userId);
    if (createdEventsError) {
      console.error("Error fetching created events:", createdEventsError);
      return;
    }

    const createdEventIds = (createdEventsData as { id: string }[]).map(
      (event) => event.id
    );

    const allEventIds = [...new Set([...eventIds, ...createdEventIds])];

    if (allEventIds.length === 0) {
      setEventsByMonth({});
      return;
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from("event")
      .select("*")
      .in("id", allEventIds)
      .gte("event_end", nowUTC);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return;
    }

    const formattedEvents = formatEvents(eventsData);
    setEventsByMonth(formattedEvents);
  };

  const formatEvents = (eventsData: Event[]) => {
    const eventsByMonth: Record<string, Record<string, Event[]>> = {};

    eventsData.forEach((event) => {
      const eventStart = new Date(event.event_start);
      const eventEnd = new Date(event.event_end);

      // Format dates using local time without time zone conversions
      const eventStartFormatted = format(eventStart, "yyyy-MM-dd h:mm a");
      const eventEndFormatted = format(eventEnd, "h:mm a");
      const eventDate = format(eventStart, "yyyy-MM-dd");
      const eventMonth = format(eventStart, "MMMM");

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

    // Sort the events within each month and date
    Object.keys(eventsByMonth).forEach((month) => {
      const dates = Object.keys(eventsByMonth[month]).sort();
      const sortedEventsByDate: Record<string, Event[]> = {};
      dates.forEach((date) => {
        sortedEventsByDate[date] = eventsByMonth[month][date].sort(
          (a, b) =>
            new Date(a.event_start).getTime() -
            new Date(b.event_start).getTime()
        );
      });
      eventsByMonth[month] = sortedEventsByDate;
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
            newEventsByMonth[month][date].sort(
              (a, b) =>
                new Date(a.event_start).getTime() -
                new Date(b.event_start).getTime()
            );
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
    return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
        <MonoText>No events found</MonoText>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: "white" }}
    >
      {sortedMonths.map((month) => (
        <View key={`month-${month}`}>
          <MonoText useMedium={true} style={styles.title}>{month}</MonoText>
          {Object.keys(eventsByMonth[month]).map((date) => {
            console.log("month:", month);
            console.log("date", date);
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
    paddingBottom: 200, // Add paddin
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 20,
    alignSelf: "flex-start",
  },
});

export default Calendar;
