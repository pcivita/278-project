import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import EventDetailsCard from "@/components/EventDetailsCard";
import Colors from "@/constants/Colors";
import { MonoText } from "@/components/StyledText";
import { Dimensions } from "react-native";
import { supabase } from "@/utils/supabase";
import { useUser } from "@/UserContext";
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

type RootStackParamList = {
  EditEvent: {
    eventId: string;
    eventName: string;
    eventTime: string;
    location: string;
    host: string;
    signups: string;
    colorScheme: string;
    description: string;
  };
};

interface EventDetailsProps {
  route: {
    params: {
      eventName: string;
      eventTime: string;
      description: string;
      location: string;
      host: string;
      signups: string;
      colorScheme: string;
      isUserHost: boolean;
      eventId: string;
    };
  };
  navigation: StackNavigationProp<RootStackParamList, 'EditEvent'>;
}

const EventDetails: React.FC<EventDetailsProps> = ({ route, navigation }) => {
  const {
    eventName,
    eventTime,
    location,
    host,
    signups,
    colorScheme,
    isUserHost,
    eventId,
    description,
  } = route.params;
  const theme = Colors[colorScheme]; // Gets theme from event's colour scheme
  const [userId, setUserId] = useState('');
  const [isAttending, setIsAttending] = useState(false);
  const [attendees, setAttendees] = useState<Array<{ userId: string, name: string, photo: string | null }>>([]);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      checkAttendanceStatus();
      fetchAttendees();
    }
  }, [userId]);

  const fetchUserId = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error fetching user:', error);
    } else if (data && data.user && data.user.id) {
      setUserId(data.user.id);
    } else {
      console.error('User data is invalid:', data);
    }
  };

  const checkAttendanceStatus = async () => {
    if (!userId || userId.trim() === '') {
      console.error('Invalid user ID:', userId);
      return;
    }
    const { data, error } = await supabase
      .from("event_signup")
      .select("*")
      .eq("user_id", userId)
      .eq("event_id", eventId);

    if (error) {
      console.error("Error checking attendance status:", error);
    } else if (data.length > 0) {
      setIsAttending(true);
    }
  };

  const fetchAttendees = async () => {
    const { data: signupData, error: signupError } = await supabase
      .from('event_signup')
      .select('user_id')
      .eq('event_id', eventId);

    if (signupError) {
      console.error('Error fetching signups:', signupError);
      return;
    }

    const attendeeIds = signupData.map(signup => signup.user_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, photo')
      .in('id', attendeeIds);

    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return;
    }

    const attendeesList = usersData.map(user => ({
      userId: user.id,
      name: user.name,
      photo: user.photo,
    }));

    setAttendees(attendeesList);
  };

  const joinEvent = async () => {
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("event_signup")
        .insert([{ user_id: userId, event_id: eventId }]);

      if (error) {
        console.error("Error inserting data:", error);
        return;
      
      } else {
        console.log("Data inserted successfully:", data);
      } 

      const { data: eventData, error: eventError } = await supabase
        .from('event')
        .select('current_signups, max_people')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('Error fetching event data:', eventError);
        return;
      }

      const { current_signups, max_people } = eventData;
      const updatedSignups = current_signups + 1;
      const maxSignupReached = (updatedSignups >= max_people);

      const { error: updateEventError } = await supabase
        .from('event')
        .update({
          current_signups: updatedSignups,
          max_signup: maxSignupReached
        })
        .eq('id', eventId);

      if (updateEventError) {
        console.error("Error updating event data:", updateEventError);
        return;
      }
      console.log("User signed up and event updated successfully");

      setIsAttending(true);
      fetchAttendees();
    
    } catch (error) {
      console.error("Error joining event:", error);
    }

    console.log(description)
  };

  const handleDeleteEvent = async () => {
    try {
      const { error: signupError } = await supabase
        .from('event_signup')
        .delete()
        .eq('event_id', eventId);

      if (signupError) {
        throw signupError;
      }

      const { error: eventError } = await supabase
        .from('event')
        .delete()
        .eq('id', eventId);

      if (eventError) {
        throw eventError;
      }

      Alert.alert("Event deleted successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting event:", error);
      Alert.alert("Error deleting event");
    }
  };

  const handleEditEvent = () => {
    navigation.navigate('EditEvent', {
      eventId,
      eventName,
      eventTime,
      location,
      host,
      signups,
      colorScheme,
      description,
    });
  };

  return (
    <View style={styles.container}>
      <EventDetailsCard
        eventName={eventName}
        eventTime={eventTime}
        location={location}
        description={description}
        host={host}
        signups={signups}
        colorScheme={colorScheme}
        isUserHost={isUserHost}
        eventId={eventId}
      />
      <View style={styles.section}>
        <MonoText useUltra={true} style={styles.primaryText}>
          Going
        </MonoText>
        <View style={styles.attendees}>
          {attendees.map((attendee, index) => (
            <View key={index} style={styles.user}>
              <Image
                source={{ uri: attendee.photo || 'default_image_url' }}
                style={styles.profileImage}
              />
              <MonoText style={styles.secondaryText}>{attendee.name}</MonoText>
            </View>
          ))}
        </View>
        <View style={styles.horizontalLine} />
      </View>
      <View style={styles.section}>
        <MonoText useUltra={true} style={styles.primaryText}>
          Notes
        </MonoText>
        <View style={styles.notes}>
          <MonoText style={styles.secondaryText}>
            {description}
          </MonoText>
        </View>
        <View style={styles.horizontalLine} />
      </View>
      {!isUserHost &&
        (isAttending ? (
          <MonoText style={styles.attendingText}>
            You're attending this event!
          </MonoText>
        ) : (
          <TouchableOpacity onPress={joinEvent} style={[styles.button, { backgroundColor: theme.dark }]}>
            <MonoText useMedium={true} style={styles.buttonText}>Join Event</MonoText>
          </TouchableOpacity>
        ))}
      {isUserHost && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleEditEvent} style={[styles.editButton, { backgroundColor: theme.dark }]}>
            <MonoText useMedium={true} style={styles.buttonText}>Edit Event</MonoText>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteEvent} style={[styles.deleteButton, { borderColor: theme.dark }]}>
            <MonoText useMedium={true} style={{ color: theme.dark }}>Delete Event</MonoText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
  },
  section: {
    width: "90%",
  },
  user: {
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  attendees: {
    flexDirection: "row",
    gap: 10,
  },
  primaryText: {
    fontSize: 20,
    marginBottom: 10,
  },
  secondaryText: {
    fontSize: 14,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: 'bold',
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    borderRadius: 5,
    backgroundColor: "#E3E3E3",
    marginVertical: 15,
  },
  button: {
    width: windowWidth * 0.9,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  joinButton: {
    backgroundColor: Colors.color2.dark,
  },
  attendingText: {
    fontSize: 18,
    color: "gray",
    fontWeight: "bold",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  deleteButton: {
  borderWidth: 1,
    flex: 1,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
});

export default EventDetails;
