import React, { useEffect, useState} from "react";
import { ScrollView, Text, StyleSheet, View, Button } from "react-native";
import EventCard from "../../components/EventCard";
import { MonoText } from '../../components/StyledText'; 
import { useNavigation } from "expo-router";
import { FeedProps } from "./FeedStack";
import { supabase } from '@/utils/supabase';
import { toZonedTime, format } from 'date-fns-tz';

interface Event {
  event_name: string;
  event_start: Date;
  event_end: Date;
  location: string;     // Venue or address of the event
  host: string;         // Name of the host or organizer
  max_people: number;   // Maximum number of attendees
  signups: number;      // Current number of sign-ups
  current_signups: number;  // Added to store the current number of signups
  creator_id: string;   // User ID of the event creator
  id: string;
  isAttending: boolean; // if user is attending the event
}

interface User {
  id: string;
  name: string;
}

const Feed = ({ navigation }: FeedProps) => {
  const [userId, setUserId] = useState('');
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  const fetchUserAndEvents = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return;
    } else if (data.user) {
      setUserId(data.user.id);
      console.log("User ID is", userId);
      await fetchEvents(data.user.id);
    }
  };

  const fetchEvents = async (userId: string) => {
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select('user_requested, user_accepted')
      .or(`user_requested.eq.${userId},user_accepted.eq.${userId}`)
      .eq('status', 'Accepted');
    
    if (friendsError) {
      console.error('Error fetching friends:', friendsError);
      return;
    }

    const friendIds = friendsData.reduce((acc: string[], friend: { user_requested: string; user_accepted: string }) => {
      if (friend.user_requested !== userId) acc.push(friend.user_requested);
      if (friend.user_accepted !== userId) acc.push(friend.user_accepted);
      return acc;
    }, []);

    if (friendIds.length === 0) {
      console.log('No friends found for this user.');
      setEvents([]);
      return;
    }
    else {
      console.log(friendIds)
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from('event')
      .select('*')
      .in('creator_id', friendIds);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return;
    }

    const creatorIds = [...new Set(eventsData.map(event => event.creator_id))];
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', creatorIds);

    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return;
    }

    const userIdToNameMap = usersData.reduce<Record<string, string>>((acc, user: User) => {
      acc[user.id] = user.name;
      return acc;
    }, {});

    const eventsWithSignupsAndHosts = await Promise.all(eventsData.map(async (event) => {
      const { data: signupData, error: signupError } = await supabase
        .from('event_signup')
        .select('*', { count: 'exact' })
        .eq('event_id', event.id);

      if (signupError) {
        console.error('Error fetching signups:', signupError);
        return {
          ...event,
          current_signups: 0,
          host: userIdToNameMap[event.creator_id] || 'Unknown',
          isAttending: false
        };
      }
      
      const isAttending = signupData.some((signup) => signup.user_id == userId);

      const timeZone = 'America/Los_Angeles';
      const eventStartPST = toZonedTime(event.event_start, timeZone);
      const eventEndPST = toZonedTime(event.event_end, timeZone);
      const eventStartFormatted = format(eventStartPST, 'M/d h:mm a', { timeZone });
      const eventEndFormatted = format(eventEndPST, 'h:mm a', { timeZone });

      return {
        ...event,
        event_start: eventStartFormatted,
        event_end: eventEndFormatted,
        current_signups: signupData.length,
        host: userIdToNameMap[event.creator_id] || 'Unknown',
        isAttending
      };
    }));

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
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}>
      {events.map((event, index) => (
        <View key={index} style={styles.dateSection}>
          <EventCard
            eventName={event.event_name}
            eventTime={`${event.event_start} - ${event.event_end}`}
            location={event.location}
            host={event.host}
            signups={`${event.current_signups}/${event.max_people}`}
            colorScheme={`color${index % 5 + 1}`}
            onNavigate={() => handleNavigateToEventDetails({
              eventName: event.event_name,
              eventTime: `${event.event_start} - ${event.event_end}`,
              location: event.location,
              host: event.host,
              signups: `${event.current_signups}/${event.max_people}`,
              colorScheme: `color${index % 5 + 1}`,
              isUserHost: event.creator_id === userId,
              eventId: event.id,
            })}
            isUserHost={event.creator_id === userId}
            buttonText={event.isAttending ? 'Attending' : 'View Event'}
            isAttending={event.isAttending}
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
  },
  dateSection: {
    width: '100%',
    alignItems: "center"
  },
});

export default Feed;
