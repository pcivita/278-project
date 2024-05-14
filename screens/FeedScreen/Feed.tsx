import React, { useEffect, useState} from "react";
import { ScrollView, Text, StyleSheet, View, Button } from "react-native";
import EventCard from "../../components/EventCard";
import { MonoText } from '../../components/StyledText'; 
import { useNavigation } from "expo-router";
import { FeedProps } from "./FeedStack";
import { supabase } from '@/utils/supabase';

interface Event {
  event_name: string;
  event_start: Date;
  event_end: Date;
  location: string;     // Venue or address of the event
  host: string;         // Name of the host or organizer
  max_people: number;   // Maximum number of attendees
  signups: number;      // Current number of sign-ups
  current_signups: number;  // Added to store the current number of signups
  group_id: string;     // ID of the group this event belongs to
  creator_id: string;   // User ID of the event creator
}

interface User {
  id: string;
  name: string;
}

const Feed = ({ navigation }: FeedProps) => {
  //const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState('');
  const [events, setEvents] = useState<Event[]>([]);


  useEffect(() => {
    fetchUserAndEvents();
  }, []);

  const fetchUserAndEvents = async () => {
    // Fetch user details
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
      return; // Optionally, handle error e.g., show an error message
    } else if (data.user) {
      setUserId(data.user.id)
      console.log("User ID is", userId)
      await fetchEvents(data.user.id)
    }
  };

  const fetchEvents = async (userId: string) => {
    const { data: membershipsData, error: membershipError } = await supabase
      .from('group_membership')
      .select('group_id')
      .eq('member_id', userId);
      
    if (membershipError) {
      console.error('Error fetching group memberships:', membershipError);
      return; // Handle error appropriately
    }
  
    const memberships = membershipsData || [];
    const groupIds = memberships.map(m => m.group_id);
      
    if (groupIds.length === 0) {
      console.log('No groups found for this user.');
      setEvents([]);  // Clear events as precautionary measure
      return;
    }
  
    const { data: eventsData, error } = await supabase
      .from('event')
      .select('*')
      .in('group_id', groupIds);
  
    if (error) {
      console.error('Error fetching events:', error);
      return;
    }


    // Fetch user names for the creator_ids from events
    const creatorIds = [...new Set(eventsData.map(event => event.creator_id))];
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name')  // assuming the user's name is stored under 'name'
      .in('id', creatorIds);

    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return;
    }

    // Create a map of user IDs to names
    const userIdToNameMap = usersData.reduce<Record<string, string>>((acc, user: User) => {
      acc[user.id] = user.name;
      return acc;
    }, {});
    

    // Integrate the host names into the events data
  // const eventsWithHostNames = eventsData.map(event => ({
  //   ...event,
  //   host: userIdToNameMap[event.creator_id] || 'Unknown'  // Fallback if user name is not found
  // }));
  const eventsWithSignupsAndHosts = await Promise.all(eventsData.map(async (event) => {
    const { data: signupData, error: signupError } = await supabase
      .from('event_signup')
      .select('*', { count: 'exact' })
      .eq('event_id', event.id);
    
    if (signupError) {
      console.error('Error fetching signups:', signupError);
      return {
        ...event,
        current_signups: 0,  // Default to 0 if there's an error
        host: userIdToNameMap[event.creator_id] || 'Unknown'
      };
    }

    return {
      ...event,
      current_signups: signupData.length,
      host: userIdToNameMap[event.creator_id] || 'Unknown'
    };
  }));

  setEvents(eventsWithSignupsAndHosts);
      //setEvents(eventsData);
  };
  

  const handleNavigateToEventDetails = (params: any) => {
    navigation.push("EventDetails", {
      eventName: params.eventName,
      eventTime: params.eventTime,
      location: params.location,
      host: params.host,
      signups: params.signups,
      colorScheme: params.colorScheme,
      isUserHost: params.isUserHost
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}>
      {events.map((event, index) => (
        <View key={index} style={styles.dateSection}>
          <EventCard
            eventName={event.event_name}
            eventTime={`${new Date(event.event_start).toLocaleTimeString()} - ${new Date(event.event_end).toLocaleTimeString()}`}
            location={event.location} // Update based on actual data availability
            host={event.host} // Update based on actual data availability
            signups={`${event.current_signups}/${event.max_people}`}
            colorScheme={`color${index % 5 + 1}`}
            onNavigate={handleNavigateToEventDetails}
            isUserHost={event.creator_id === userId}
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
