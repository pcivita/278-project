import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import EventDetailsCard from "@/components/EventDetailsCard";
import Colors from "@/constants/Colors";
import { MonoText } from "@/components/StyledText";
import { Dimensions } from "react-native";
import { supabase } from "@/utils/supabase";
import { useUser } from "@/UserContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

interface EventDetailsProps {
  route: {
    params: {
      eventName: string;
      eventTime: string;
      location: string;
      host: string;
      signups: string;
      colorScheme: string;
      isUserHost: boolean;
      eventId: string;
    };
  };
}

const EventDetails = ({ route }: EventDetailsProps) => {
  const {
    eventName,
    eventTime,
    location,
    host,
    signups,
    colorScheme,
    isUserHost,
    eventId,
  } = route.params;
  const theme = Colors[colorScheme];
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
      } else {
        console.log("Data inserted successfully:", data);
        setIsAttending(true);
        fetchAttendees(); // Refresh attendees list
      }
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  return (
    <View style={styles.container}>
      <EventDetailsCard
        eventName={eventName}
        eventTime={eventTime}
        location={location}
        host={host}
        signups={signups}
        colorScheme={colorScheme}
        isUserHost={isUserHost}
        eventId={eventId}
      />
      <MonoText style={styles.secondaryText}>Expires Sunday 11:59pm</MonoText>
      <View style={styles.section}>
        <MonoText useUltra={true} style={styles.primaryText}>
          Going
        </MonoText>
        <View style={styles.attendees}>
          {attendees.map((attendee, index) => (
            <View key={index} style={styles.user}>
              <Image
                source={{ uri: attendee.photo || 'default_image_url' }} // Replace 'default_image_url' with an actual URL
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
            Meet me at Lake Lag by the fire pit! Wear sunscreen and text me at
            4157996842 if you are running late.
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
          <TouchableOpacity onPress={joinEvent}>
            <View style={[styles.button, { backgroundColor: theme.dark }]}>
              <MonoText style={styles.buttonText}>Join Event</MonoText>
            </View>
          </TouchableOpacity>
        ))}
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
    fontSize: 20,
    color: "white",
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
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notes: {
    marginVertical: 10,
  },
  attendingText: {
    fontSize: 20,
    color: "green",
    marginTop: 20,
  },
});

export default EventDetails;
