// EventCard.tsx
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { MonoText } from "./StyledText";
import { useNavigation } from "expo-router";

interface EventCardProps {
  eventName: string;
  eventTime: string;
  location: string;
  description: string;
  host: string;
  signups: string;
  colorScheme: string;
  isUserHost: boolean;
  eventId: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  eventTime,
  location,
  host,
  signups,
  colorScheme,
}) => {
  const theme = Colors[colorScheme];
  const navigation = useNavigation();
  console.log("host", host);

  return (
    <View style={[styles.card, { backgroundColor: theme.light }]}>
      <View style={styles.leftSide}>
        <View style={[styles.verticalLine, { backgroundColor: theme.dark }]} />
        <View style={styles.textContainer}>
          <MonoText useUltra={true} style={styles.primaryText}>
            {eventName}
          </MonoText>
          <MonoText style={styles.secondaryText}>{eventTime}</MonoText>
          <MonoText style={styles.secondaryText}>Hosted by: {host}</MonoText>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={styles.location}>
          <Ionicons name="location-sharp" size={20} color="black" />
          <MonoText style={styles.secondaryText}>{location}</MonoText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "95%",
    height: 170,
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
    alignItems: "center",
    justifyContent: "center", // Adjust this to control vertical alignment
    width: "70%",
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: "space-around", // This will help distribute the text vertically
    flex: 1, // Takes up all available space after accounting for the vertical line
  },
  rightSide: {
    width: "30%",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  primaryText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8, // Increase bottom margin to give more space below the headline
    lineHeight: 32, // Adjust line height for better vertical spacing
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 18, // Increase if secondary texts feel too tight vertically
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
    backgroundColor: "#54577C", // Default color, will be overwritten dynamically
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EventCard;
