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
  host: string;
  max_people: number;
  signups: number;
  current_signups: number;
  creator_id: string;
  id: string;
  isAttending: boolean;
  attendees: Array<{ userId: string; photo: string | null }>;
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

  const fetchUserAndEvents = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      return;
    } else if (data.user) {
      setUserId(data.user.id);
      console.log("User ID is", userId);
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
  
    const nowUTC = new Date();
    const nowPST = toZonedTime(nowUTC, 'America/Los_Angeles').toISOString();
    //const nowPSTISOString = zonedTimeToUtc(nowPST, 'America/Los_Angeles').toISOString();


    const { data: eventsData, error: eventsError } = await supabase
      .from("event")
      .select("*")
      .in("creator_id", allIds)
      .eq('max_signup', false)
      .gte('event_end', nowPST); // Filter events that have event_end in the future based on PST

  
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
  
        let eventStartFormatted = "Invalid date";
        let eventEndFormatted = "Invalid date";
        try {
          const timeZone = "America/Los_Angeles";
          if (event.event_start && event.event_end) {
            const eventStartPST = toZonedTime(new Date(event.event_start), timeZone);
            const eventEndPST = toZonedTime(new Date(event.event_end), timeZone);
            eventStartFormatted = format(eventStartPST, "M/d h:mm a", { timeZone });
            eventEndFormatted = format(eventEndPST, "h:mm a", { timeZone });
          } else {
            console.error("Invalid or missing event start/end dates.");
          }
        } catch (error) {
          console.error("Error formatting event dates:", error);
        }
  
        return {
          ...event,
          event_start: eventStartFormatted,
          event_end: eventEndFormatted,
          current_signups: signupData.length,
          host: userIdToNameMap[event.creator_id] || "Unknown",
          isAttending,
          attendees,
        };
      })
    );
  
    setEvents(eventsWithSignupsAndHosts);
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
