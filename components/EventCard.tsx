import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { MonoText } from "./StyledText";
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
  attendees: Array<{ userId: string; name: string; photo: string | null }>;
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
              {isUserHost ?
                <MonoText useMedium={true} style={styles.hostText}>
                  Your Event
                </MonoText>
              :
                <>
                  <MonoText useMedium={true} style={styles.hostText}>
                    Hosted by:
                  </MonoText>
                  <MonoText style={[styles.secondaryText, { color: "gray" }]}>
                    {host}
                  </MonoText>
                </>
              }
            </View>
            <View style={styles.attendeesContainer}>
              <View style={styles.imagesContainer}>
                {attendees !== null && attendees.slice(0, 2).map((attendee, index) => (
                  <Image
                    key={index}
                    source={{ uri: attendee.photo || "default_image_url" }} // Replace 'default_image_url' with an actual URL
                    style={[
                      styles.attendeePhoto,
                      { zIndex: attendees.length - index },
                      index === 1 && styles.backPhoto,
                    ]}
                  />
                ))}
              </View>
              {attendees!== null && attendees.length > 0 && attendees[0].name ? (
                <View style={styles.attendingTextContainer}>
                  <MonoText style={[styles.attendingNameText, { color: "black", fontWeight: "bold" }]}>
                    {attendees[0].name}
                  </MonoText>
                  <MonoText style={[styles.secondaryText, { color: "gray" }]}>
                    {attendees.length > 1
                      ? ` +${attendees.length - 1} more attending`
                      : " attending"}
                  </MonoText>
                </View>
              ) : (
                <MonoText style={[styles.secondaryText, { color: "gray", marginTop: 4 }]}>
                  No attendees yet
                </MonoText>
              )}
            </View>
          </View>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={styles.location}>
          <Ionicons name="location-sharp" size={20} color="black" />
          <MonoText style={styles.secondaryText}>{location}</MonoText>
        </View>
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
          <MonoText useMedium={true} style={styles.buttonText}>{buttonText}</MonoText>
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
    width: "60%",
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
    alignItems: "center",
    gap: 5,
  },
  hostText: {
    fontSize: 14,
    lineHeight: 18,
    top: 0.5
  },
  attendeesContainer: {
    alignItems: "flex-start", // Align items to the start (left)
    marginTop: 8,
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  attendeePhoto: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: -8, // Overlapping effect
  },
  backPhoto: {
    opacity: 0.6, // Darken the back photo
  },
  attendingTextContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  attendingNameText: {
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
    borderRadius: 100,
    padding: 10,
    paddingHorizontal: 15,
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
});

export default EventCard;
