import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@/utils/supabase";
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

interface User {
  id: string;
  name: string;
  photo: string | null;
}

interface EventItemProps {
  event: Event;
  userId: string;
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
  const [creatorPhoto, setCreatorPhoto] = useState<string | null>(null);
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  useEffect(() => {
    fetchCreatorPhoto();
  }, []);

  const fetchCreatorPhoto = async () => {
    const { data: creatorData, error: creatorError } = await supabase
      .from('users')
      .select('photo')
      .eq('id', event.creator_id)
      .single();

    if (creatorError) {
      console.error('Error fetching creator details:', creatorError);
      return;
    }

    setCreatorPhoto(creatorData.photo);
  };

  const formatTime = (dateTimeString: string): string => {
    const time = dateTimeString.substring(dateTimeString.indexOf(' ') + 1);
    return time;
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
        source={{ uri: creatorPhoto || "https://via.placeholder.com/150" }}
        style={styles.profileImage}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.title}>{event.event_name}</Text>
        <Text style={styles.time}>
          {`${formatTime(event.event_start)} - ${event.event_end}`}
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
    backgroundColor: Colors.color2.lightest,
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
    fontFamily: "TripSans-Ultra",
    fontWeight: "bold",
  },
  time: {
    color: "#666",
  },
});

export default EventItem;
