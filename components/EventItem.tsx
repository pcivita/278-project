import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@/utils/supabase"; // Make sure the import path is correct

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

interface User {
  id: string;
  name: string;
  photo: string | null;
}

interface EventItemProps {
  event: Event;
  userId: string; // Add userId prop to identify the current user
}

export type RootStackParamList = {
  Calendar: undefined;
  EventDetails: {
    eventName: string;
    eventTime: string;
    location: string;
    host: string;
    signups: number;
    colorScheme: string;
    isUserHost: boolean;
    eventId: string;
  };
};

type CalendarScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EventDetails"
>;

const EventItem: React.FC<EventItemProps> = ({ event, userId }) => {
  const [mainTitle, setMainTitle] = useState<string>(event.event_name);
  const [creatorPhoto, setCreatorPhoto] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  useEffect(() => {
    fetchCreatorAndAttendeeNames();
  }, []);

  const fetchCreatorAndAttendeeNames = async () => {
    const { data: creatorData, error: creatorError } = await supabase
      .from('users')
      .select('id, name, photo')
      .eq('id', event.creator_id)
      .single();

    if (creatorError) {
      console.error('Error fetching creator details:', creatorError);
      return;
    }

    const { data: signupData, error: signupError } = await supabase
      .from('event_signup')
      .select('user_id')
      .eq('event_id', event.id);

    if (signupError) {
      console.error('Error fetching signups:', signupError);
      return;
    }

    const attendeeIds = signupData.map(signup => signup.user_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name')
      .in('id', attendeeIds);

    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return;
    }

    const isOrganizer = event.creator_id === userId;
    const attendingUser = usersData.find(user => user.id === userId);
    const displayName = isOrganizer ? attendingUser?.name || creatorData.name : creatorData.name;

    setCreatorPhoto(creatorData.photo);
    setDisplayName(displayName);
    setMainTitle(`${mainTitle} with ${displayName}`);
  };

  const navigateToDetails = () => {
    navigation.navigate("EventDetails", {
      eventName: event.event_name,
      eventTime: event.event_start + event.event_end,
      location: event.location,
      host: event.creator_id,
      signups: 5,
      colorScheme: `color${1}`,
      isUserHost: true,
      eventId: event.id,
    });
  };

  return (
    <TouchableOpacity style={styles.eventItem} onPress={navigateToDetails}>
      <Image
        source={{ uri: creatorPhoto || "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
        style={styles.profileImage}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.title}>{mainTitle}</Text>
        <Text style={styles.time}>
          {`${event.event_start} - ${event.event_end}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F7FFF2",
    borderRadius: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  eventDetails: {
    flex: 1,
  },
  title: {
    fontFamily: "TripSans-Ultra", // Ultra font for the main title and Defne
    fontWeight: "bold",
  },
  time: {
    color: "#666",
  },
});

export default EventItem;
