import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import EventCard from "../../components/EventCard";
import { supabase } from "@/utils/supabase";
import { toZonedTime, format } from "date-fns-tz";

interface Event {
  event_name: string;
  event_start: string; // Updated from Date to string
  event_end: string;   // Updated from Date to string
  location: string;
  description: string;
  host: string;
  max_people: number;
  signups: number;
  current_signups: number;
  creator_id: string;
  id: string;
  isAttending: boolean;
  attendees: Array<{ userId: string; photo: string | null }>;
  event_start_date: Date; // Added for sorting
  event_end_date: Date;   // Added for sorting
}

interface User {
  id: string;
  name: string;
  photo: string | null;
}

const Feed = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  useEffect(() => {
    if (userId) {
      console.log("User ID is", userId);
    }
  }, [userId]);

  const fetchUserAndEvents = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    } else if (data.user) {
      setUserId(data.user.id);
      console.log("User ID is", data.user.id);
      await fetchEvents(data.user.id);
    } else {
      console.log("No user data found");
    }
  };

  const fetchEvents = async (userId: string) => {
    const { data: friendsData, error: friendsError } = await supabase
      .from("friends")
      .select("user_requested, user_accepted")
      .or(`user_requested.eq.${userId},user_accepted.eq.${userId}`)
      .eq("status", "Friends");

    if (friendsError) {
      console.error("Error fetching friends:", friendsError);
      return;
    }

    const friendIds = friendsData.reduce(
      (acc: string[], friend: { user_requested: string; user_accepted: string }) => {
        if (friend.user_requested !== userId) acc.push(friend.user_requested);
        if (friend.user_accepted !== userId) acc.push(friend.user_accepted);
        return acc;
      },
      []
    );

    // Include user's own ID to fetch their events as well
    const allIds = [...friendIds, userId];

    if (allIds.length === 0) {
      console.log("No friends found for this user.");
      setEvents([]);
      return;
    }

    const nowUTC = new Date().toISOString();
    // console.log("curr time in UTC:", nowUTC)

    const { data: eventsData, error: eventsError } = await supabase
      .from("event")
      .select("*")
      .in("creator_id", allIds)
      .eq('max_signup', false)
      .gte('event_end', nowUTC); // Filter events that have event_end in the future based on UTC

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return;
    }
    if (!eventsData || eventsData.length === 0) {
      console.log("No events found");
      setEvents([]);
      return;
    }

    const creatorIds = [...new Set(eventsData.map((event) => event.creator_id))];
    const { data: usersData, error: usersError } = await supabase
      .from("users")
      .select("id, name")
      .in("id", creatorIds);

    if (usersError) {
      console.error("Error fetching user details:", usersError);
      return;
    }

    const userIdToNameMap = usersData.reduce<Record<string, string>>(
      (acc, user: User) => {
        acc[user.id] = user.name;
        return acc;
      },
      {}
    );

    const eventsWithSignupsAndHosts = await Promise.all(
      eventsData.map(async (event) => {
        const { data: signupData, error: signupError } = await supabase
          .from("event_signup")
          .select("*", { count: "exact" })
          .eq("event_id", event.id);

        if (signupError) {
          console.error("Error fetching signups:", signupError);
          return {
            ...event,
            current_signups: 0,
            host: userIdToNameMap[event.creator_id] || "Unknown",
            isAttending: false,
            attendees: [],
          };
        }

        const isAttending = signupData.some((signup) => signup.user_id == userId);

        const attendeeIds = signupData.map((signup) => signup.user_id);
        const { data: attendeesData, error: attendeesError } = await supabase
          .from("users")
          .select("id, name, photo")
          .in("id", attendeeIds);

        if (attendeesError) {
          console.error("Error fetching attendees' details:", attendeesError);
          return {
            ...event,
            current_signups: signupData.length,
            host: userIdToNameMap[event.creator_id] || "Unknown",
            isAttending,
            attendees: [],
          };
        }

        const attendees = attendeesData.map((attendee) => ({
          userId: attendee.id,
          name: attendee.name, // Ensure we include the name
          photo: attendee.photo,
        }));

        return {
          ...event,
          event_start_date: new Date(event.event_start), // Ensure we have the Date object for sorting
          event_end_date: new Date(event.event_end),     // Ensure we have the Date object for sorting
          current_signups: signupData.length,
          host: userIdToNameMap[event.creator_id] || "Unknown",
          isAttending,
          attendees,
          description: event.description,
        };
      })
    );

    // Log before sorting
    console.log("Events before sorting:", eventsWithSignupsAndHosts);

    // Sort events by event_start_date in ascending order
    eventsWithSignupsAndHosts.sort((a, b) => a.event_start_date.getTime() - b.event_start_date.getTime());

    // Log after sorting
    console.log("Events after sorting:", eventsWithSignupsAndHosts);

    // Format the dates after sorting
    const formattedEvents = eventsWithSignupsAndHosts.map(event => {
      let eventStartFormatted = "Invalid date";
      let eventEndFormatted = "Invalid date";
      try {
        const timeZone = "America/Los_Angeles";
        const eventStartPST = toZonedTime(event.event_start_date, timeZone);
        const eventEndPST = toZonedTime(event.event_end_date, timeZone);
        eventStartFormatted = format(eventStartPST, "M/d h:mm a", { timeZone });
        eventEndFormatted = format(eventEndPST, "h:mm a", { timeZone });
      } catch (error) {
        console.error("Error formatting event dates:", error);
      }

      return {
        ...event,
        event_start: eventStartFormatted,
        event_end: eventEndFormatted,
      };
    });

    setEvents(formattedEvents);
  };

  const handleNavigateToEventDetails = (params: any) => {
    
    navigation.push("EventDetails", {
      eventName: params.eventName,
      eventTime: params.eventTime,
      location: params.location,
      host: params.host,
      signups: params.signups,
      colorScheme: params.colorScheme,
      isUserHost: params.isUserHost,
      eventId: params.eventId,
      description: params.description, // Pass the description
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}
    >
      {events.map((event, index) => (
        <View key={index} style={styles.dateSection}>
          <EventCard
            eventName={event.event_name}
            eventTime={`${event.event_start} - ${event.event_end}`}
            location={event.location}
            host={event.host}
            signups={`${event.current_signups}/${event.max_people}`}
            colorScheme={`color${(index % 5) + 1}`}
            onNavigate={() =>
              handleNavigateToEventDetails({
                eventName: event.event_name,
                eventTime: `${event.event_start} - ${event.event_end}`,
                location: event.location,
                host: event.host,
                signups: event.signupsText,
                colorScheme: `color${(index % 5) + 1}`,
                isUserHost: event.creator_id === userId,
                eventId: event.id,
                description: event.description,
              })
            }
            isUserHost={event.creator_id === userId}
            buttonText={"View Event"}
            isAttending={event.isAttending}
            attendees={event.attendees} // Pass attendees data here
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 10,
  },
  dateSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 8
  },
});

export default Feed;
