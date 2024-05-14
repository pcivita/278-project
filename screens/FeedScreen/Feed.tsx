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
  group_id: string;     // ID of the group this event belongs to
  creator_id: string;   // User ID of the event creator
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
  
    console.log("Memberships Data:", membershipsData);  // Debugging: Log the data
    
    if (membershipError) {
      console.error('Error fetching group memberships:', membershipError);
      return; // Handle error appropriately
    }
  
    const memberships = membershipsData || [];
    const groupIds = memberships.map(m => m.group_id);
  
    console.log("Group IDs:", groupIds);  // Debugging: Log the group IDs
    
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
  
    console.log("Events Data:", eventsData);  // Debugging: Log the events data
    setEvents(eventsData);
  };
  

  const handleNavigateToEventDetails = (params: any) => {
    navigation.push("EventDetails", {
      eventName: params.eventName,
      eventTime: params.eventTime,
      location: params.location,
      host: params.host,
      signups: params.signups,
      colorScheme: params.colorScheme
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
            signups={`{event.max_people}`}
            colorScheme={`color${index % 5 + 1}`}
            onNavigate={handleNavigateToEventDetails}
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









// const Feed = ({ navigation }: FeedProps) => {
//   // const navigation = useNavigation();

//   // const handleNavigateToEventDetails = (params) => {
//   //   navigation.navigate('EventDetails', params);
//   // };
//   const handleNavigateToEventDetails = (params: any) => {
//     navigation.push("EventDetails", {
//       eventName: params.eventName,
//       eventTime: params.eventTime,
//       location: params.location,
//       host: params.host,
//       signups: params.signups,
//       colorScheme: params.colorScheme
//     });
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center", paddingBottom: 100 }}>
//       <View style={styles.dateSection}>
//         <View style={styles.dateHeaderSection}>
//           <MonoText style={styles.dateHeader}>Monday 04/31</MonoText>
//         </View>
//         <EventCard
//           eventName="Movie Night"
//           eventTime="12:00 - 1:00 PM"
//           location="Xanadu"
//           host="Elena"
//           signups="0/1"
//           colorScheme="color1"
//           onNavigate={handleNavigateToEventDetails}
//         />
//         <EventCard
//           eventName="Lunch with Project Team"
//           eventTime="1:00 - 2:00 PM"
//           location="Cafeteria"
//           host="Carlos"
//           signups="3/4"
//           colorScheme="color2"
//           onNavigate={handleNavigateToEventDetails}
//         />
//         <EventCard
//           eventName="Board Games Evening"
//           eventTime="6:00 - 8:00 PM"
//           location="Common Hall"
//           host="Maria"
//           signups="1/5"
//           colorScheme="color3"
//           onNavigate={handleNavigateToEventDetails}
//         />
//       </View>
      
//       <View style={styles.dateSection}>
//         <View style={styles.dateHeaderSection}>
//           <MonoText style={styles.dateHeader}>Tuesday 05/01</MonoText>
//         </View>
//         <EventCard
//           eventName="Board Games Evening"
//           eventTime="6:00 - 8:00 PM"
//           location="Common Hall"
//           host="Maria"
//           signups="1/5"
//           colorScheme="color4"
//           onNavigate={handleNavigateToEventDetails}
//         />
//         <EventCard
//           eventName="Board Games Evening"
//           eventTime="6:00 - 8:00 PM"
//           location="Common Hall"
//           host="Maria"
//           signups="1/5"
//           colorScheme="color5"
//           onNavigate={handleNavigateToEventDetails}
//         />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   dateSection: {
//     width: '100%',
//     // alignItems: 'flex-start',  // Changed from 'center' to 'flex-start' to align left
//     alignItems: "center"
//   },
//   dateHeaderSection: {
//     width: "95%"
//   },
//   dateHeader: {
//     fontSize: 23,
//     fontFamily: 'TripSans-Medium',  // Changed from 'TripSans-Regular' to 'TripSans-Medium'
//     marginTop: 20,
//     marginBottom: 0,
//     textAlign: 'left',  // Ensure the text is aligned to the left
//     padding:10,
//   },
// });

// export default Feed;
