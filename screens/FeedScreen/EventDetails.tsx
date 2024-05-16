import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import EventCard from '@/components/EventCard'
import Colors from '@/constants/Colors'
import EventDetailsCard from "@/components/EventDetailsCard"
import { MonoText } from '@/components/StyledText'
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    }
  };
}




const EventDetails = ({ route }: EventDetailsProps) => {
  // console.log(eventName, colorScheme)
  const { eventName, eventTime, location, host, signups, colorScheme, isUserHost } = route.params;
  const theme = Colors[colorScheme];
  console.log(theme)

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
      />
      <MonoText style={styles.secondaryText}>Expires Sunday 11:59pm</MonoText>
      <View style={styles.section}>
        <MonoText useUltra={true} style={styles.primaryText}>Going</MonoText>
        <View style={styles.attendees}>
          <View style={styles.user}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
              style={styles.profileImage}
            />
            <MonoText style={styles.secondaryText}>Defne</MonoText>
          </View>
          <View style={styles.user}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
              style={styles.profileImage}
            />
            <MonoText style={styles.secondaryText}>Elena</MonoText>
          </View>
          <View style={styles.user}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
              style={styles.profileImage}
            />
            <MonoText style={styles.secondaryText}>Pedro</MonoText>
          </View>
          <View style={styles.user}>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }} // Placeholder image, replace with actual image URI
              style={styles.profileImage}
            />
            <MonoText style={styles.secondaryText}>Malina</MonoText>
          </View>
        </View>
        <View style={styles.horizontalLine} />
      </View>
      <View style={styles.section}>
        <MonoText useUltra={true} style={styles.primaryText}>Notes</MonoText>
        <View style={styles.notes}>
          <MonoText style={styles.secondaryText}>
            Meet me at Lake Lag by the fire pit! Wear sunscreen and text me at 4157996842 if you are running late.
          </MonoText>
        </View>
        <View style={styles.horizontalLine} />
      </View>
      <TouchableOpacity>
        <View style={[styles.button, { backgroundColor: theme.dark }]}>
          <MonoText style={styles.buttonText}>{isUserHost ? "Your Event" : "Join Event"}</MonoText>
        </View>
      </TouchableOpacity>
    </View>
  )
}

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
    alignItems: "center"
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
    color: "white"
  },
  horizontalLine: {
    width: "100%",
    height: 1,
    borderRadius: 5,
    backgroundColor: "#E3E3E3",
    marginVertical: 15
  },
  button: {
    width: windowWidth * 0.9,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

  }
});

export default EventDetails