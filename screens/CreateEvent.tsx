// import React from 'react';
// import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
// import { supabase } from '@/utils/supabase';


// // Initialize Supabase client

// const CreateEvent = () => {
//   const createEvent = async () => {
//     console.log('Creating event')
//     const { data, error } = await supabase
//       .from('event')
//       .insert([
//         {
//           creator_id: "fc720675-a19e-477f-8780-328b154a278a",
//           group_id: "9bed5464-2dd3-4655-933c-eedfffb1a7dd",
//           max_people: 2,
//           event_name: "test",
//           event_start: new Date().toISOString(),
//           event_end: new Date().toISOString()
//         },
//       ]).select();
//     if (error) console.error('Error creating event:', error);
//     else console.log('Event created:', data);
//   };

//   return (
//     <TouchableOpacity onPress={createEvent} style={{ padding: 10, backgroundColor: 'blue' }}>
//       <Text style={{ color: 'white' }}>Create Event</Text>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default CreateEvent;
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginVertical: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  },
});

export default CreateEvent;
