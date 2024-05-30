import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { MonoText } from "./StyledText";
import { useNavigation } from "expo-router";
import { format } from "date-fns";

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
  attendees: Array<{ userId: string; photo: string | null }>;
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
  attendees,
}) => {
  const theme = Colors[colorScheme];
  const navigation = useNavigation();

  return (
    <View style={[styles.card, { backgroundColor: theme.light }]}>
      <View style={styles.leftSide}>
        <View style={[styles.verticalLine, { backgroundColor: theme.dark }]} />
        <View style={styles.textContainer}>
          <MonoText useUltra={true} style={styles.primaryText}>
            {eventName}
          </MonoText>
          <MonoText style={styles.secondaryText}>{eventTime}</MonoText>
          <View style={styles.bottomTextContainer}>
            <View style={styles.hostContainer}>
              <MonoText useMedium={true} style={styles.hostText}>
                Hosted by:
              </MonoText>
              <MonoText style={[styles.secondaryText, { color: "black" }]}>
                {host}
              </MonoText>
            </View>
            <View style={styles.attendeesContainer}>
              {attendees.map((attendee, index) => (
                <Image
                  key={index}
                  source={{ uri: attendee.photo || "default_image_url" }} // Replace 'default_image_url' with an actual URL
                  style={styles.attendeePhoto}
                />
              ))}
              <MonoText style={[styles.secondaryText, { color: "gray" }]}>
                {signups}
              </MonoText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={styles.location}>
          <Ionicons name="location-sharp" size={20} color="black" />
          <MonoText style={styles.secondaryText}>{location}</MonoText>
        </View>
        {isUserHost && (
          <MonoText style={styles.attendingText}>Your event</MonoText>
        )}
        {isAttending && (
          <MonoText style={styles.attendingText}>You're attending!</MonoText>
        )}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.dark }]}
          onPress={() =>
            onNavigate({
              eventName,
              eventTime,
              location,
              host,
              signups,
              colorScheme,
              isUserHost,
            })
          }
        >
          <MonoText style={styles.buttonText}>{buttonText}</MonoText>
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
    flexDirection: "row",
    alignItems: "flex-start",
    width: "55%",
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "space-between",
    paddingRight: 10,
  },
  primaryText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    lineHeight: 32,
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 18,
  },
  bottomTextContainer: {
    marginTop: "auto",
    paddingTop: 8,
  },
  hostContainer: {
    flexDirection: "row",
  },
  hostText: {
    fontSize: 14,
    lineHeight: 18,
  },
  attendeesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  attendeePhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 2,
    overflow: "hidden",
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
    height: "100%",
    borderRadius: 5,
    backgroundColor: "#54577C",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  attendingText: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 1,
    textAlign: "center",
  },
});

export default EventCard;
