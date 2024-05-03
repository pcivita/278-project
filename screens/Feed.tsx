// Feed.tsx
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import EventCard from '../components/EventCard'; // Ensure this path is correct

const Feed: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <EventCard
        eventName="Movie Night"
        eventTime="12:00 - 1:00 PM"
        location="Xanadu"
        host="Elena"
        signups="0/1"
      />
      <EventCard
        eventName="Lunch with Project Team"
        eventTime="1:00 - 2:00 PM"
        location="Cafeteria"
        host="Carlos"
        signups="3/4"
      />
      <EventCard
        eventName="Board Games Evening"
        eventTime="6:00 - 8:00 PM"
        location="Common Hall"
        host="Maria"
        signups="1/5"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
});

export default Feed;
