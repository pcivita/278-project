import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/utils/supabase';

const CreateEvent = () => {
  const [maxPeople, setMaxPeople] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else if (data.user) {
        setCreatorId(data.user.id);
      }
    }
    fetchUser();
  }, []);

  const createEvent = async () => {
    console.log('Creating event');
    const { data, error } = await supabase
      .from('event')
      .insert([
        {
          creator_id: creatorId,
          group_id: "9bed5464-2dd3-4655-933c-eedfffb1a7dd",
          max_people: parseInt(maxPeople, 10),
          event_name: eventName,
          event_start: new Date(eventStart).toISOString(),
          event_end: new Date(eventEnd).toISOString(),
          location: location
        },
      ]);
    if (error) {
      console.error('Error creating event:', error);
    } else {
      console.log('Event created:', data);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Max People"
        value={maxPeople}
        onChangeText={setMaxPeople}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
      />
      <TextInput
        placeholder="Event Start (YYYY-MM-DD)"
        value={eventStart}
        onChangeText={setEventStart}
        style={styles.input}
      />
      <TextInput
        placeholder="Event End (YYYY-MM-DD)"
        value={eventEnd}
        onChangeText={setEventEnd}
        style={styles.input}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <TouchableOpacity onPress={createEvent} style={styles.button}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginVertical: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#9AA899',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateEvent;
