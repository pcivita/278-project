import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { MonoText } from './StyledText'; 
import { useNavigation } from "expo-router";

interface EventCardProps {
  eventName: string;
  eventTime: string;
  location: string;
  host: string;
  signups: string;
  colorScheme: string;
  onNavigate: any;
  isUserHost: boolean;
  buttonText: string;
  isAttending: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  eventTime,
  location,
  host,
  signups,
  colorScheme,
  onNavigate,
  isUserHost,
  buttonText,
  isAttending,
}) => {
  const theme = Colors[colorScheme];
  const navigation = useNavigation();

  return (
    <View style={[styles.card, { backgroundColor: theme.light }]}>
      <View style={styles.leftSide}>
        <View style={[styles.verticalLine, { backgroundColor: theme.dark }]} />
        <View style={styles.textContainer}>
          <MonoText useUltra={true} style={styles.primaryText}>{eventName}</MonoText>
          <MonoText style={styles.secondaryText}>{eventTime}</MonoText>
          <View style={styles.bottomTextContainer}>
            <View style={styles.hostContainer}>
              <MonoText useMedium={true} style={styles.hostText}>Hosted by: </MonoText>
              <MonoText style={styles.secondaryText}>{host}</MonoText>
            </View>
            <MonoText style={styles.secondaryText}>{signups} signups</MonoText>
          </View>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={styles.location}>
          <Ionicons name="location-sharp" size={20} color="black" />
          <MonoText style={styles.secondaryText}>{location}</MonoText>
        </View>
        {isUserHost && <Text style={styles.hostText}>Your event</Text>}
        {isAttending && <Text style={styles.attendingText}>You're attending!</Text>}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.dark }]}
          onPress={() => onNavigate({
            eventName,
            eventTime,
            location,
            host,
            signups,
            colorScheme,
            isUserHost
          })}
        >

          <MonoText style={styles.buttonText}>View Event</MonoText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "95%",
    borderRadius: 15,
    padding: 20,
    marginVertical: 5,
    paddingLeft: 20,
    shadowColor: "#333",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align to top
    width: "55%",
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  primaryText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4, // Space between event name and time
    lineHeight: 32,
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 18,
  },
  bottomTextContainer: {
    marginTop: 'auto', // Push this container to the bottom
    paddingTop: 8, // Add space above hosted by and signups
  },
  hostContainer: {
    flexDirection: 'row',
  },
  hostText: {
    fontSize: 14,
    lineHeight: 18,
  },
  rightSide: {
    width: "40%",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  location: {
    flexDirection: "row",
    gap: 2,
    paddingRight: 5,
  },
  button: {
    backgroundColor: "#0C7BC8",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    margin: 0,
  },
  verticalLine: {
    width: 4,
    height: '100%',
    borderRadius: 5,
    backgroundColor: "#54577C",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  hostText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center'
  },
  attendingText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 1,
    textAlign: 'center'
  },
});

export default EventCard;
