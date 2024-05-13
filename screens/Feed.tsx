import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import EventCard from "../components/EventCard";
import { MonoText } from '../components/StyledText'; // Adjust the import path as necessary

const Feed: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}>
      <View style={styles.dateSection}>
        <MonoText style={styles.dateHeader}>Monday 04/31</MonoText>
        <EventCard
          eventName="Movie Night"
          eventTime="12:00 - 1:00 PM"
          location="Xanadu"
          host="Elena"
          signups="0/1"
          colorScheme="color1"
        />
        <EventCard
          eventName="Lunch with Project Team"
          eventTime="1:00 - 2:00 PM"
          location="Cafeteria"
          host="Carlos"
          signups="3/4"
          colorScheme="color2"
        />
        <EventCard
          eventName="Board Games Evening"
          eventTime="6:00 - 8:00 PM"
          location="Common Hall"
          host="Maria"
          signups="1/5"
          colorScheme="color3"
        />
      </View>
      <View style={styles.dateSection}>
        <MonoText style={styles.dateHeader}>Tuesday 05/01</MonoText>
        <EventCard
          eventName="Board Games Evening"
          eventTime="6:00 - 8:00 PM"
          location="Common Hall"
          host="Maria"
          signups="1/5"
          colorScheme="color4"
        />
        <EventCard
          eventName="Board Games Evening"
          eventTime="6:00 - 8:00 PM"
          location="Common Hall"
          host="Maria"
          signups="1/5"
          colorScheme="color5"
        />
      </View>
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
    alignItems: 'flex-start',  // Changed from 'center' to 'flex-start' to align left
  },
  dateHeader: {
    fontSize: 23,
    fontFamily: 'TripSans-Medium',  // Changed from 'TripSans-Regular' to 'TripSans-Medium'
    marginTop: 20,
    marginBottom: 0,
    textAlign: 'left',  // Ensure the text is aligned to the left
    padding:10,
  },
});

export default Feed;
