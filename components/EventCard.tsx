// EventCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EventCard = ({ eventName, eventTime, location, host, signups }) => {
  return (
    <View style={styles.card}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{eventTime}</Text>
      </View>
      <Text style={styles.eventName}>{eventName}</Text>
      <Text style={styles.location}>{location}</Text>
      <Text style={styles.host}>Hosted by: {host}</Text>
      <Text style={styles.signups}>{signups} signups</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Join Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timeContainer: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginBottom: 10,
  },
  timeText: {
    fontSize: 12,
    color: '#333',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  host: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  signups: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#CDEDBC', // Light green
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#008000', // Green text
    fontWeight: 'bold',
  },
});

export default EventCard;
