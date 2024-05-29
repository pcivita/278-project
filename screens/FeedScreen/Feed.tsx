import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import EventCard from "../../components/EventCard";
import { MonoText } from '../../components/StyledText'; 
import { useNavigation } from "expo-router";
import { supabase } from '@/utils/supabase';
import { parseISO, format } from 'date-fns';

interface Event {
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
  id: string;
  isAttending: boolean;
  attendees: Array<{ userId: string, photo: string | null }>;
  signupsText: string;
}

interface User {
  id: string;
  name: string;
  photo: string | null;
}

const Feed = ({ navigation }) => {
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
      await fetchEvents(data.user.id);
    }
  };

  const fetchEvents = async (userId: string) => {
    const { data: membershipsData, error: membershipError } = await supabase
      .from('group_membership')
      .select('group_id')
      .eq('member_id', userId);

    if (membershipError) {
      console.error('Error fetching group memberships:', membershipError);
      return;
    }

    const memberships = membershipsData || [];
    const groupIds = memberships.map(m => m.group_id);

    if (groupIds.length === 0) {
      console.log('No groups found for this user.');
      setEvents([]);
      return;
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from('event')
      .select('*')
      .in('group_id', groupIds);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return;
    }

    const creatorIds = [...new Set(eventsData.map(event => event.creator_id))];
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, photo')
      .in('id', creatorIds);

    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return;
    }

    const userIdToUserMap = usersData.reduce<Record<string, { name: string, photo: string | null }>>((acc, user: any) => {
      acc[user.id] = { name: user.name, photo: user.photo };
      return acc;
    }, {});

    const eventsWithDetails = await Promise.all(eventsData.map(async (event) => {
      const { data: signupData, error: signupError } = await supabase
        .from('event_signup')
        .select('user_id')
        .eq('event_id', event.id);
    
      if (signupError) {
        console.error('Error fetching signups:', signupError);
        return {
          ...event,
          current_signups: 0,
          host: userIdToUserMap[event.creator_id]?.name || 'Unknown',
          attendees: [],
          isAttending: false,
          signupsText: '0 signups'
        };
      }
    
      const attendees = signupData.map(signup => ({
        userId: signup.user_id,
        photo: userIdToUserMap[signup.user_id]?.photo || 'default_image_url',
      }));
    
      const isAttending = signupData.some((signup) => signup.user_id === userId);
      const attendeesCount = signupData.length;
    
      const signupsText = attendeesCount > 1
        ? `${userIdToUserMap[event.creator_id]?.name || 'Someone'} +${attendeesCount - 1} more attending`
        : `${userIdToUserMap[event.creator_id]?.name || 'Someone'} attending`;
    
      const eventStart = parseISO(event.event_start);
      const eventEnd = parseISO(event.event_end);
    
      const eventStartFormatted = format(eventStart, 'MM/dd h:mm a');
      const eventEndFormatted = format(eventEnd, 'h:mm a');
    
      return {
        ...event,
        event_start: eventStartFormatted,
        event_end: eventEndFormatted,
        current_signups: signupData.length,
        host: userIdToUserMap[event.creator_id]?.name || 'Unknown',
        attendees,
        isAttending,
        signupsText
      };
    }));
    
    setEvents(eventsWithDetails);
    
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
            signups={event.signupsText}
            colorScheme={`color${index % 5 + 1}`}
            onNavigate={() => handleNavigateToEventDetails({
              eventName: event.event_name,
              eventTime: `${event.event_start} - ${event.event_end}`,
              location: event.location,
              host: event.host,
              signups: event.signupsText,
              colorScheme: `color${index % 5 + 1}`,
              isUserHost: event.creator_id === userId,
              eventId: event.id,
            })}
            isUserHost={event.creator_id === userId}
            buttonText={event.isAttending ? 'Attending' : 'View Event'}
            isAttending={event.isAttending}
            attendees={event.attendees}
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
