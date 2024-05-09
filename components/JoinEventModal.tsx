import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, Switch, Pressable } from "react-native";
import Modal from "react-native-modal";
import Colors from "@/constants/Colors";
import EventCard from "./EventCard";

interface JoinEventModalProps {
  isModalVisible: boolean;
  closeModal: () => void;
  eventName: string;
  eventTime: string;
  location: string;
  host: string;
  signups: string;
  colorScheme: string;
}

const JoinEventModal: React.FC<JoinEventModalProps> = ({ 
  isModalVisible, 
  closeModal, 
  eventName,
  eventTime,
  location,
  host,
  signups,
  colorScheme, 
}) => {
  return (
    <Modal
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      isVisible={isModalVisible}
      swipeDirection="down"
      onSwipeComplete={closeModal}
      animationInTiming={400}
      animationOutTiming={400}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        {/* <View style={styles.barIcon} /> */}
        <Text style={styles.title}>
          Are you sure you want to join this event?
        </Text>
        <EventCard
          eventName={eventName}
          eventTime={eventTime}
          location={location}
          host={host}
          signups={signups}
          colorScheme={colorScheme}
          joinEventButton={false}
        />
        <View style={styles.buttonsContainer}>
          <Pressable onPress={closeModal}>
            <View style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Cancel</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 12,
    borderRadius: 20,
    height: 400,
    // paddingBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginVertical: 20,
  },
  h1: {
    fontSize: 17,
    color: "black"
  },
  h1Container: {
    width: "100%",
    backgroundColor: "green",
    padding: 12,
    borderRadius: 16,
    gap: 12,
  },
  buttonsContainer: {
    height: 70,
    flexDirection: "row",
    gap: 50,
    padding: 10,
  },
  buttonContainer: {
    backgroundColor: "pink",
    width: 120,
    height: "90%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
});

export default JoinEventModal;
