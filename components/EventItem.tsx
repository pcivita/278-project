import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

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

interface EventItemProps {
  event: Event;
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

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const [mainTitle, withText] = event.event_name.split(" with ");
  const navigation = useNavigation<CalendarScreenNavigationProp>();

  console.log("EVENT", event);

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
        source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
        style={styles.profileImage}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.title}>
          {mainTitle} <Text style={styles.regular}>with</Text>{" "}
          <Text style={styles.ultra}>{withText}</Text>
        </Text>
        <Text
          style={styles.time}
        >{`${event.event_start} - ${event.event_end}`}</Text>
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
  regular: {
    fontFamily: "TripSans-Regular", // Regular font for "with"
  },
  ultra: {
    fontFamily: "TripSans-Ultra", // Ultra font for "Defne"
  },
  time: {
    color: "#666",
  },
});

export default EventItem;
