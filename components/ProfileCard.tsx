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
  name: string;
  location: string;
  bio: string;
  wants: string;
  colorScheme: string;
}

const EventCard: React.FC<EventCardProps> = ({
  name,
  location,
  bio,
  wants,
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
      <View style={styles.header}>
        <Text style={styles.primaryText}>{name}</Text>
        <View style={styles.location}>
          <Ionicons name="location-sharp" size={20} color="black" />
          <Text style={styles.secondaryText}>{location}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.textGroup}>
          <Text style={styles.boldText}>About me</Text>
          <Text style={styles.secondaryText}>{bio}</Text>
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.boldText}>I want to...</Text>
          <Text style={styles.secondaryText}>{wants}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#CAE9FF",
    width: "95%",
    height: 200,

    borderRadius: 30,
    padding: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  body: {
    gap: 10,
  },
  textGroup: {
    
  },
  primaryText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
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
