// EventCard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface EventCardProps {
  eventName: string;
  eventTime: string;
  location: string;
  host: string;
  signups: string;
  colorScheme: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  eventTime,
  location,
  host,
  signups,
  colorScheme,
}) => {
  let theme = Colors.color1;
  if (colorScheme === "color2") {
    theme = Colors.color2;
  }
  if (colorScheme === "color3") {
    theme = Colors.color3;
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.light }]}>
      <View style={styles.leftSide}>
        <View>
          <Text style={styles.primaryText}>{eventName}</Text>
          <Text style={styles.secondaryText}>{eventTime}</Text>
        </View>
        <View>
          <Text style={styles.secondaryText}>Hosted by: {host}</Text>
          <Text style={styles.secondaryText}>{signups} signups</Text>
        </View>
      </View>
      <View style={styles.rightSide}>
        <View style={styles.location}>
          <Ionicons name="location-sharp" size={20} color="black" />
          <Text style={styles.secondaryText}>{location}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.dark }]}
        >
          <Text style={styles.buttonText}>Join Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#CAE9FF",
    width: "95%",
    height: 160,

    borderRadius: 30,
    padding: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftSide: {
    width: "70%",
    justifyContent: "space-between",
  },
  rightSide: {
    width: "30%",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  primaryText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 16,
  },
  location: {
    flexDirection: "row",
    gap: 5,
    paddingRight: 5,
  },
  button: {
    backgroundColor: "#0C7BC8",
    borderRadius: 15,
    padding: 10,
    alignItems: "center",
    margin: 0,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EventCard;
