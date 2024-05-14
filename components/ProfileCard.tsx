import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { MonoText } from './StyledText'; 

interface ProfileCardProps {
  name: string;
  location: string;
  bio: string;
  wants: string;
  colorScheme: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  location,
  bio,
  wants,
  colorScheme,
}) => {
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.card, { backgroundColor: theme.light }]}>
      <View style={styles.leftSide}>
        <View style={[styles.verticalLine, { backgroundColor: theme.dark }]} />
        <View style={styles.textContainer}>
          <MonoText useUltra={true} style={styles.primaryText}>{name}</MonoText>
          <View style={styles.location}>
            <Ionicons name="location-sharp" size={20} color="black" />
            <MonoText style={styles.secondaryText}>{location}</MonoText>
          </View>
          <MonoText style={styles.secondaryText}>Bio</MonoText>
          <MonoText style={styles.secondaryText}>{bio}</MonoText>
          <MonoText style={styles.secondaryText}>I want to...</MonoText>
          <MonoText style={styles.secondaryText}>{wants}</MonoText>
        </View>
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
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Adjust this to control vertical alignment
    width: "100%",
  },
  textContainer: {
    marginLeft: 10,
    justifyContent: 'space-around', // This will help distribute the text vertically
    flex: 1, // Takes up all available space after accounting for the vertical line
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
    alignItems: "center",
  },
  verticalLine: {
    width: 4,
    height: '100%',
    borderRadius: 5,
    backgroundColor: "#54577C",  // Default color, will be overwritten dynamically
  },
});

export default ProfileCard;
